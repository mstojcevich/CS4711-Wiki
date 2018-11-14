import React from 'react';
import { Header } from 'semantic-ui-react';

import { withAPI } from '../APIHandler/APIHandler';
import ArticleList from '../ArticleList/ArticleList';

/**
 * HomePage component
 *
 * Contains general information related to the wiki
 */
class RecentArticles extends React.Component {
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
    const { isLoggedIn } = this.props;

    return (
      <React.Fragment>
        <Header as="h2">Recent Articles</Header>
        <ArticleList
          articles={articles}
          loading={loading}
          isLoggedIn={isLoggedIn}
        />
      </React.Fragment>
    );
  }
}

export default withAPI(RecentArticles);
