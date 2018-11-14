import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import React from 'react';
import { withRouter } from 'react-router-dom';
import ComposePage from '../ComposePage/ComposePage';
import {
  Header,
  Button,
  Divider,
  Grid,
} from 'semantic-ui-react';


import { withAPI } from '../APIHandler/APIHandler';
import ArticleHistoryButton from './ArticleHistoryButton';
import { formatDate } from '../../util';

class ArticleViewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'Loading...',
      quillDelta: 'Loading...',

      editable: false,
      history: [],
    };
    this.editArticle = this.editArticle.bind(this);
    this.loadRevision = this.loadRevision.bind(this);
  }

  componentDidMount() {
    this.requestArticleContent();
  }

  componentDidUpdate(prevProps) {
    const { id } = this.props;

    if (id !== prevProps.id) {
      this.requestArticleContent();
    }
  }

  editArticle() {
    this.setState({
      editable: true,
    });
    this.forceUpdate();
  }

  requestArticleContent() {
    const { requests, id } = this.props;

    requests.getArticle({ id }).then((response) => {
      this.setState(response);
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

  render() {

    const { title, quillDelta, editable } = this.state;
    const { isLoggedIn } = this.props;

    if (!isLoggedIn()) {
      return (
        <React.Fragment>
          <Header>{title}</Header>
          {quillDelta !== null && (
            <ReactQuill
              value={quillDelta}
              modules={{ toolbar: false }}
              readOnly
            />
          )}
        </React.Fragment>
      );
    }
    if (!editable) {
      return (
        <React.Fragment>
          <Header>{title}</Header>
          {quillDelta !== null && (
            <ReactQuill
              value={quillDelta}
              modules={{ toolbar: false }}
              readOnly
            />
          )}
          <Form onSubmit={this.editArticle}>
            <Button type="submit">Edit article</Button>
          </Form>
        </React.Fragment>
      );
    }
    return <ComposePage />;
  }
}

export default withAPI(withRouter(ArticleViewPage));
