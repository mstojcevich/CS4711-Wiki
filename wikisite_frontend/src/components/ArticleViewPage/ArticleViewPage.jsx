import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Header,
  Button,
  Divider,
  Grid,
  Icon,
  Message,
} from 'semantic-ui-react';

import imageUpload from '../../image-upload-plugin-fork/quill-plugin-image-upload-master';
import { withAPI } from '../APIHandler/APIHandler';
import ArticleHistoryButton from './ArticleHistoryButton';
import { formatDate } from '../../util';
import '../ComposePage/override.css';
import ImageMetaModal from '../ImageMetaModal/ImageMetaModal';
import ImageViewModal from '../ImageViewModal/ImageViewModal';

// TODO we duplicate a lot of logic from the compose page (for editing),
// we should probably move editing entirely over to the compose page

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

class ArticleViewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'Loading...',
      quillDelta: 'Loading...',
      history: [],
      editing: false,
      locked: false,
      genericProblems: [],
      contentProblems: [],
      imageCommentCallback: () => {},
      cancelImageCommentCallback: () => {},
      showCommentModal: false,
      clickedImage: null,
      viewingImage: false,
    };

    this.loadRevision = this.loadRevision.bind(this);
    this.onEditButton = this.onEditButton.bind(this);
    this.onSaveButton = this.onSaveButton.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.requestArticleContent();
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

  componentDidUpdate(prevProps) {
    const { id } = this.props;

    if (id !== prevProps.id) {
      this.requestArticleContent();
    }

    this.attachImageHandlers();
  }

  onEditButton() {
    const { quillDelta } = this.state;
    this.setState({ editing: true, curQuillDelta: quillDelta });
  }

  onSaveButton() {
    const { id, requests } = this.props;
    const { curQuillDelta, title } = this.state;

    requests.updateArticle({
      id,
      name: title,
      content: JSON.stringify(curQuillDelta),
    }).then((response) => {
      this.setState(response);
      this.setState({ editing: false });
    }).catch((error) => {
      /*
      If the error wasn't actually generated by the API, error.content won't exist,
      so we just pass the error though as a non field failure.
      Note that non field failures can also come from the API.
      */
      const failures = error.content ? error.content : {
        non_field_failures: error,
      };

      this.setState({
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

  handleChange(content, delta, source, editor) {
    this.setState({ quillDelta: content, curQuillDelta: editor.getContents() });
  }

  requestArticleContent() {
    const { requests, id } = this.props;

    requests.getArticle({ id }).then((response) => {
      this.setState(response, this.attachImageHandlers);
    }).catch(() => this.setState({
      title: 'Could not retrieve article',
      quillDelta: null,
    }));
  }

  loadRevision(revision) {
    const { requests } = this.props;

    // Load the revision page
    requests.getRevision(revision.url).then((detailedRevision) => {
      this.setState({ quillDelta: detailedRevision.quillDelta });
    }).catch((err) => {
      console.error(err);
    });
  }

  attachImageHandlers() {
    Array.from(document.getElementsByTagName('img')).forEach((item) => {
      const metaUrl = item.getAttribute('data-meta-url');
      item.addEventListener('click', () => {
        this.setState({
          clickedImage: metaUrl,
          viewingImage: true,
        });
      });
    });
  }

  closeModal() {
    this.setState({
      viewingImage: false,
      clickedImage: null,
    });
  }

  render() {
    const {
      genericProblems,
      contentProblems,
      title, quillDelta,
      history,
      locked, editing,
      modules,
      showCommentModal,
      cancelImageCommentCallback,
      imageCommentCallback,
      clickedImage,
      viewingImage,
    } = this.state;

    const { user } = this.props;

    const lastModify = history ? history[history.length - 1] : null;
    const lastModifyDate = lastModify ? formatDate(lastModify.creation_date) : 'unknown';
    const lastModifyUser = lastModify ? lastModify.author.username : 'unknown';

    return (
      <React.Fragment>
        <Message
          error
          header="Failed to edit article"
          list={genericProblems}
          hidden={genericProblems.length === 0}
        />
        <Message
          error
          header="Invalid content"
          list={contentProblems}
          hidden={contentProblems.length === 0}
        />
        <Grid columns="equal">
          <Grid.Column>
            <Header as="h2">
              {title}
              <Header.Subheader>
                Last updated {lastModifyDate} by {lastModifyUser}
              </Header.Subheader>
            </Header>
          </Grid.Column>
          <Grid.Column className="right aligned">
            {locked === true && <Icon name="lock" />}
            <Button.Group>
              <ArticleHistoryButton
                onSelect={this.loadRevision}
                revisions={history}
              />
              {(locked === false || (user && user.username === 'admin')) && <Button onClick={this.onEditButton} compact><Icon name="edit" />Edit</Button>}
            </Button.Group>
          </Grid.Column>
        </Grid>
        <Divider />
        {quillDelta !== null && editing === false && (
          <React.Fragment>
            <ReactQuill
              value={quillDelta}
              modules={{ toolbar: false }}
              readOnly
            />
            <ImageViewModal
              metaUrl={clickedImage}
              visible={viewingImage}
              onClose={this.closeModal}
            />
          </React.Fragment>
        )}
        {quillDelta !== null && editing === true && (
          <React.Fragment>
            <ReactQuill
              defaultValue={quillDelta}
              onChange={this.handleChange}
              modules={modules}
              formats={quillFormats}
            />
            <Divider />
            <Button onClick={this.onSaveButton}><Icon name="save" />Save</Button>
            <ImageMetaModal
              visible={showCommentModal}
              onSubmit={imageCommentCallback}
              onCancel={cancelImageCommentCallback}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default withAPI(withRouter(ArticleViewPage));
