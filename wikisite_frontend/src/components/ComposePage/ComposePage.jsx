import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Button, Divider } from 'semantic-ui-react';

class ComposePage extends React.Component {
  constructor(props) {
    super(props);

    // TODO: Fill with a quill delta for current content
    this.state = { title: '', quillDelta: '', text: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.onArticleSubmit = this.onArticleSubmit.bind(this);
  }

  onArticleSubmit() {
    const { title, quillDelta } = this.state;

    const action = ['api', 'articles', 'create'];
    const params = { name: title, content: JSON.stringify(quillDelta) };
    window.client.action(window.schema, action, params);
    // TODO error & success handling, redirect to the newly created article
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleChange(content, delta, source, editor) {
    this.setState({ text: content, quillDelta: editor.getContents() });
  }

  render() {
    const { text } = this.state;
    return (
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
    );
  }
}

export default withRouter(ComposePage);
