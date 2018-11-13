import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Button, Divider, Grid, Icon } from 'semantic-ui-react';

import { withAPI } from '../APIHandler/APIHandler';
import ArticleHistoryButton from './ArticleHistoryButton';

class ArticleViewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'Loading...',
      quillDelta: 'Loading...',
    };
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
    const { title, quillDelta } = this.state;

    return (
      <React.Fragment>
        <Grid columns="equal">
          <Grid.Column>
            <Header as="h2">
              {title}
              <Header.Subheader>
                Last updated 3 hours ago by marcusant
              </Header.Subheader>
            </Header>
          </Grid.Column>
          <Grid.Column className="right aligned">
            <Button.Group>
              <ArticleHistoryButton revisions={
                [
                  {
                    author: 'marcusant',
                    creation_date: '11/5/2018 5pm',
                  },
                ]
              }
              />
            </Button.Group>
          </Grid.Column>
        </Grid>
        <Divider />
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
}

export default withAPI(withRouter(ArticleViewPage));
