import React from 'react';
import { Header } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';

import { withAPI } from '../APIHandler/APIHandler';

/**
 * ProfilePage component
 *
 * Contains a form to log into the wiki site
 */
class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      username: '',
      password: '',
    };
  }

  render() {
    const { user, isLoggedIn } = this.props;

    if (!isLoggedIn()) {
      return (
        <Redirect to={`/`} />
      );
    }

    return (
      <React.Fragment>
        <Header as="h1">Welcome {user.username}</Header>
      </React.Fragment>
    );
  }
}

export default withAPI(withRouter(ProfilePage));
