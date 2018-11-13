import 'react-quill/dist/quill.snow.css';
import React from 'react';
import { List } from 'semantic-ui-react';
import { formatDate } from '../../util';

/**
 * Renders a list of article revisions
 */
class ArticleRevisionList extends React.Component {
  constructor(props) {
    super(props);

    this.createLinks = this.createLinks.bind(this);
  }

  createLinks() {
    const { revisions, onSelect } = this.props;
    const links = [];

    revisions.forEach((revision) => {
      const revisionDate = formatDate(revision.creation_date);
      links.push(
        <List.Item
          as="a"
          onClick={() => { onSelect(revision); }}
          key={`${revisionDate}_${revision.author}`}
        >
          {revisionDate} by {revision.author}
        </List.Item>,
      );
    });

    return links;
  }

  render() {
    const { revisions, onSelect } = this.props;

    return (
      <List link>
        {this.createLinks(revisions, onSelect)}
      </List>
    );
  }
}

export default ArticleRevisionList;
