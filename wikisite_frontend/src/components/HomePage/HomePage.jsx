import React from 'react';
import {
  Header,
  List,
  Button,
  Icon,
} from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';

import { withAPI } from '../APIHandler/APIHandler';

/**
 * HomePage component
 *
 * Contains general information related to the wiki
 */
class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      loading: false,
    };
  }

  componentDidMount() {
    const { requests: { getArticles } } = this.props;

    // Request the list of articles from the API
    this.setState({ loading: true }, () => {
      getArticles().then((response) => {
        // Set the articles in state, set loading to false
        this.setState({
          articles: response,
          loading: false,
        });
      }).catch(() => {
        // We errored! Set loading to false
        this.setState({ loading: false });
      });
    });
  }

  render() {
    const { loading, articles } = this.state;
    const { isLoggedIn, history } = this.props;

    // While the list of articles is loading, just render a list with a loading
    // message as its only item
    if (loading) {
      return (
        <List divided relaxed>
          <List.Item>
            <List.Content>
              <List.Header>Loading...</List.Header>
            </List.Content>
          </List.Item>
        </List>
      );
    }

    // If we aren't loading, show a list of all the recent articles
    // Also show a create articles button if the user is logged in
    return (
      <div>
        <Header as="h2">Recent Articles</Header>
        <List divided relaxed>
          {articles.length
            ? articles.map(article => (
              <List.Item key={article.id}>
                <List.Icon name="file text" size="large" verticalAlign="middle" />
                <List.Content>
                  <List.Header>
                    <Link to={`/articles/${article.id}`}>{article.name}</Link>
                  </List.Header>
                  <List.Description>
                    <b>Created:</b> {new Date(article.creation_date).toString()}
                  </List.Description>
                </List.Content>
              </List.Item>
            ))
            : (
              <List.Item>
                <List.Content>
                  <List.Header>No articles in the wiki. Sign in to create an article!</List.Header>
                </List.Content>
              </List.Item>
            )
          }
          {isLoggedIn() && (
            <List.Item>
              <List.Content>
                <Button onClick={() => history.push('/compose')}>
                  <Icon name="pencil" />Create new article
                </Button>
              </List.Content>
            </List.Item>
          )}
        </List>
      </div>
    );
  }
}

export default withAPI(withRouter(HomePage));
