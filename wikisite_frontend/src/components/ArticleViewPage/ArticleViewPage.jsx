import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Button, Divider, Grid } from 'semantic-ui-react';

import { withAPI } from '../APIHandler/APIHandler';
import ArticleHistoryButton from './ArticleHistoryButton';
import { formatDate } from '../../util';

class ArticleViewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'Loading...',
      quillDelta: 'Loading...',
      history: [],
    };

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
    const { title, quillDelta, history } = this.state;

    const lastModify = history ? history[history.length - 1] : null;
    const lastModifyDate = lastModify ? formatDate(lastModify.creation_date) : 'unknown';
    const lastModifyUser = lastModify ? lastModify.author.username : 'unknown';

    return (
      <React.Fragment>
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
            <Button.Group>
              <ArticleHistoryButton
                onSelect={this.loadRevision}
                revisions={history}
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
