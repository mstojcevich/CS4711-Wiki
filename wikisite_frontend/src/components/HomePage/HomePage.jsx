import React from 'react';
import { Header } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

import { withAPI } from '../APIHandler/APIHandler';

/**
 * HomePage component
 *
 * Contains general information related to the wiki
 */
class HomePage extends React.Component {
  render() {
    return <Header as="h1">Home page</Header>;
  }
}

export default withAPI(withRouter(HomePage));
