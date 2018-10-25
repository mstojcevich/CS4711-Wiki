import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Header } from 'semantic-ui-react';

class ArticleViewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = { title: 'Loading...', quillDelta: 'Loading...' };

    // TODO: this is terrible, I'm sorry
    setTimeout(() => {
      const action = ['api', 'articles', 'read'];
      const params = { id: props.id };
      window.client.action(window.schema, action, params).then((response) => {
        console.log(response);
        this.setState({
          title: response.name,
          quillDelta: JSON.parse(response.content),
        });
      });
    }, 0.1);
  }

  render() {
    const { title, quillDelta } = this.state;
    return (
      <React.Fragment>
        <Header>{title}</Header>
        <ReactQuill
          value={quillDelta}
          modules={{ toolbar: false }}
          readOnly
        />
      </React.Fragment>
    );
  }
}

export default withRouter(ArticleViewPage);
