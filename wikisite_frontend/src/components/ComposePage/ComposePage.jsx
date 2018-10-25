import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import {
  Form, Button, Divider, Message,
} from 'semantic-ui-react';

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
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.onArticleSubmit = this.onArticleSubmit.bind(this);
  }

  onArticleSubmit() {
    const { title, quillDelta } = this.state;

    const action = ['api', 'articles', 'create'];
    const params = { name: title, content: JSON.stringify(quillDelta) };
    window.client.action(window.schema, action, params).then((response) => {
      // Navigate to the view page
      this.setState({ destinationId: response.id });
    }).catch((error) => {
      const failures = error.content;
      console.error(failures);
      this.setState({
        titleProblems: failures.name || [],
        contentProblems: failures.content || [],
        genericProblems: failures.non_field_failures || [],
      });
    });
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleChange(content, delta, source, editor) {
    this.setState({ text: content, quillDelta: editor.getContents() });
  }

  render() {
    const { text, destinationId } = this.state;
    const { genericProblems, titleProblems, contentProblems } = this.state;
    if (destinationId !== null) {
      return (
        <Redirect to={`/view/${destinationId}`} />
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
            onChange={this.handleChange}
          />
          <Divider />
          <Button type="submit">Create article</Button>
        </Form>
      </React.Fragment>
    );
  }
}

export default withRouter(ComposePage);
