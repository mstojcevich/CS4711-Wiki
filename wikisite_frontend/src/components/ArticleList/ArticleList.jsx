import React from 'react';
import {
  List,
  Button,
  Icon,
} from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { formatDate } from '../../util';

const ArticleList = ({
  articles = [],
  loading = false,
  isLoggedIn = () => false,
  history = {},
}) => {
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
                <b>Created:</b> {formatDate(article.creation_date)}
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
  );
};

export default withRouter(ArticleList);
