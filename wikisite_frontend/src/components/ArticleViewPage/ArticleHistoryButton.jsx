import 'react-quill/dist/quill.snow.css';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Icon, Popup } from 'semantic-ui-react';
import ArticleRevisionList from './ArticleRevisionList';

/**
 * Renders a list of article revisions
 */
class ArticleHistoryButton extends React.Component {
  render() {
    const { revisions } = this.props;

    return (
      <Popup
        on="click"
        position="bottom right"
        trigger={<Button compact><Icon name="history" />History</Button>}
      >
        <Popup.Content>
          <ArticleRevisionList revisions={revisions} />
        </Popup.Content>
      </Popup>
    );
  }
}

export default withRouter(ArticleHistoryButton);
