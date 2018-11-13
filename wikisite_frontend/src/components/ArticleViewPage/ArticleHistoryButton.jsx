import 'react-quill/dist/quill.snow.css';
import React from 'react';
import { Button, Icon, Popup } from 'semantic-ui-react';
import ArticleRevisionList from './ArticleRevisionList';

/**
 * Renders a list of article revisions
 */
class ArticleHistoryButton extends React.Component {
  render() {
    const { revisions, onSelect } = this.props;

    return (
      <Popup
        on="click"
        position="bottom right"
        trigger={<Button compact><Icon name="history" />History</Button>}
      >
        <Popup.Content>
          <ArticleRevisionList revisions={revisions} onSelect={onSelect} />
        </Popup.Content>
      </Popup>
    );
  }
}

export default ArticleHistoryButton;
