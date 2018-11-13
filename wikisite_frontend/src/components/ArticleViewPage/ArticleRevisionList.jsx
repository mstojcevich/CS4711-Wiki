import 'react-quill/dist/quill.snow.css';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { List } from 'semantic-ui-react';

function createLinks(revisions) {
  const links = [];

  revisions.forEach((revision) => {
    links.push(
      <List.Item as="a">
        {revision.creation_date} by {revision.author}
      </List.Item>,
    );
  });

  return links;
}

/**
 * Renders a list of article revisions
 */
class ArticleRevisionList extends React.Component {
  render() {
    const { revisions } = this.props;

    return (
      <List link>
        {createLinks(revisions)}
      </List>
    );
  }
}

export default withRouter(ArticleRevisionList);
