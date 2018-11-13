import 'react-quill/dist/quill.snow.css';
import React from 'react';
import { List } from 'semantic-ui-react';
import { formatDate } from '../../util';

function createLinks(revisions) {
  const links = [];

  revisions.forEach((revision) => {
    const revisionDate = formatDate(revision.creation_date);
    links.push(
      <List.Item as="a" key={`${revisionDate}_${revision.author}`}>
        {revisionDate} by {revision.author}
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

export default ArticleRevisionList;
