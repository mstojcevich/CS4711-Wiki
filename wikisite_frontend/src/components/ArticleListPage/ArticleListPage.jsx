import React from 'react';
import { Header } from 'semantic-ui-react';

import { withAPI } from '../APIHandler/APIHandler';
import ArticleList from '../ArticleList/ArticleList';

/**
 * HomePage component
 *
 * Contains general information related to the wiki
 */
class ArticleListPage extends React.Component {
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
        const sort_articles_desc = function (date1, date2) {
          // This is a comparison function that will result in dates being sorted in
          // DESCENDING order.
          if (date1.creation_date > date2.creation_date) return -1;
          if (date1.creation_date < date2.creation_date) return 1;
          return 0;
        };
        const articles = response.sort(sort_articles_desc);
        
        // Set the articles in state, set loading to false
        this.setState({
          articles,
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
        <Header as="h2">ArticleListPage</Header>
        <ArticleList
          articles={articles}
          loading={loading}
          isLoggedIn={isLoggedIn}
        />
      </React.Fragment>
    );
  }
}

export default withAPI(ArticleListPage);
