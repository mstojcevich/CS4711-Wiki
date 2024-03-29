import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import {
  Form, Button, Divider, Message,
} from 'semantic-ui-react';

import { withAPI } from '../APIHandler/APIHandler';
import ImageMetaModal from '../ImageMetaModal/ImageMetaModal';
import imageUpload from '../../image-upload-plugin-fork/quill-plugin-image-upload-master';
import './override.css';

Quill.register('modules/imageUpload', imageUpload);

const quillModules = imageUploadHandler => ({
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
    ['clean'],
  ],
  imageUpload: imageUploadHandler,
});

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'clean', 'imageUpload', 'data-meta-url',
];

class ComposePage extends React.Component {
  constructor(props) {
    super(props);

    // TODO: Fill with a quill delta for current content
    this.state = {
      title: '', // title of the wiki post
      quillDelta: '', // Content of the quill delta representing the wiki post
      text: '', // HTML content of the quill editor
      destinationId: null, // If non-null, wiki page ID to redirect to
      titleProblems: [], // Problems with the title field
      contentProblems: [], // Problems with the article content
      genericProblems: [], // Other problems
      imageCommentCallback: () => {},
      cancelImageCommentCallback: () => {},
      showCommentModal: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.onArticleSubmit = this.onArticleSubmit.bind(this);
  }

  componentDidMount() {
    const { requests: { uploadImage } } = this.props;
    const imageUploadHandler = ({
      upload: file => (
        // return a Promise that resolves in a link to the uploaded image
        new Promise((resolve, reject) => {
          const cancel = () => this.setState({ showCommentModal: false }, reject);
          this.rejectImageComment(cancel, () => {
            const callback = comments => uploadImage({
              data: file,
              comments,
            }).then((data) => {
              this.setState({ showCommentModal: false }, () => resolve({
                url: data.data,
                metaUrl: data.url,
              }));
            });
            this.awaitImageComment(callback);
          });
        })),
    });

    this.setState({ modules: quillModules(imageUploadHandler) });
  }

  onArticleSubmit() {
    const { requests } = this.props;
    const { title, quillDelta } = this.state;

    requests.createArticle({
      name: title,
      content: JSON.stringify(quillDelta),
    }).then(response => (
      this.setState({ destinationId: response })
    )).catch((error) => {
      /*
      If the error wasn't actually generated by the API, error.content won't exist,
      so we just pass the error though as a non field failure.
      Note that non field failures can also come from the API.
      */
      const failures = error.content ? error.content : {
        non_field_failures: error,
      };

      this.setState({
        titleProblems: failures.name || [],
        contentProblems: failures.content || [],
        genericProblems: failures.non_field_failures || [],
      });
    });
  }

  awaitImageComment(callback) {
    this.setState({
      showCommentModal: true,
      imageCommentCallback: callback,
    });
  }

  rejectImageComment(reject, callback) {
    this.setState({
      cancelImageCommentCallback: reject,
    }, callback);
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleChange(content, delta, source, editor) {
    this.setState({ text: content, quillDelta: editor.getContents() });
  }

  render() {
    const { isLoggedIn } = this.props;
    const {
      text,
      destinationId,
      genericProblems,
      titleProblems,
      contentProblems,
      modules,
      showCommentModal,
      imageCommentCallback,
      cancelImageCommentCallback,
    } = this.state;

    if (!isLoggedIn()) {
      return (
        <Redirect to="/" />
      );
    }

    if (destinationId !== null) {
      return (
        <Redirect to={`/articles/${destinationId}`} />
      );
    }

    return (
      <React.Fragment>
        <Message
          error
          header="Failed to submit article"
          list={genericProblems}
          hidden={genericProblems.length === 0}
        />
        <Message
          error
          header="Invalid title"
          list={titleProblems}
          hidden={titleProblems.length === 0}
        />
        <Message
          error
          header="Invalid content"
          list={contentProblems}
          hidden={contentProblems.length === 0}
        />
        <Form onSubmit={this.onArticleSubmit}>
          <Form.Input
            type="text"
            placeholder="Article title"
            onChange={this.handleTitleChange}
          />
          <ReactQuill
            value={text}
            formats={quillFormats}
            modules={modules}
            onChange={this.handleChange}
          />
          <Divider />
          <Button type="submit">Create article</Button>
        </Form>
        <ImageMetaModal
          visible={showCommentModal}
          onSubmit={imageCommentCallback}
          onCancel={cancelImageCommentCallback}
        />
      </React.Fragment>
    );
  }
}

export default withAPI(withRouter(ComposePage));
