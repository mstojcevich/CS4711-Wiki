import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Header, Button } from 'semantic-ui-react';
import ComposePage from '../ComposePage/ComposePage';

import { withAPI } from '../APIHandler/APIHandler';

class ArticleViewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'Loading...',
      quillDelta: 'Loading...',
      editable: false,
    };
    this.editArticle = this.editArticle.bind(this);
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
