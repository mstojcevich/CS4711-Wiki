import React from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as coreapi from 'coreapi';

/**
 * Authenticate a user with a specified username and password
 *
 * @param onSuccess Function to be called on successful login,
 *  called w/ object argument of format {username: ..., uid: ..., ...: ...}
 * @param onFail Function to be called on unsuccessful login,
 *  called w/ an object of the format {username: list of problems as strings,
 *                                     password: list of problems as strings}
 */
function authenticateUser(username, password, onSuccess, onFail) {
  const action = ['api-token-auth', 'create'];
  const params = { username, password };

  window.client.action(window.schema, action, params).then((result) => {
    const auth = new coreapi.auth.TokenAuthentication({
      scheme: 'Token',
      token: result.token,
    });
    window.client = new coreapi.Client({ auth });

    onSuccess(result);
  }).catch((error) => {
    onFail(error.content);
  });
}

/**
 * LoginPage component
 *
 * Contains a form to log into the wiki site
 */
class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      usernameProblems: [],
      passwordProblems: [],
      genericProblems: [],
    };

    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.handleUsernameInputChange = this.handleUsernameInputChange.bind(this);
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
  }

  /**
   * Log the user in, route back to '/'
   */
  onLoginSubmit() {
    const { username, password } = this.state;
    const { onLogin, history } = this.props;

    authenticateUser(
      username, password,
      (user) => {
        const authedUser = user;
        authedUser.displayName = user.username;

        this.setState({
          usernameProblems: [],
          passwordProblems: [],
          genericProblems: [],
        });

        onLogin(user);
        history.push('/');
      },
      (failures) => {
        this.setState({
          usernameProblems: failures.username || [],
          passwordProblems: failures.password || [],
          genericProblems: failures.non_field_errors || [],
        });
      },
    );
  }

  /**
   * Update state with the current username text
   *
   * @param {event} e event object
   */
  handleUsernameInputChange(e) {
    this.setState({ username: e.target.value });
  }

  /**
   * Update state with the current password text
   *
   * @param {event} e event object
   */
  handlePasswordInputChange(e) {
    this.setState({ password: e.target.value });
  }

  render() {
    const { usernameProblems, passwordProblems, genericProblems } = this.state;

    return (
      <React.Fragment>
        <Message
          attached="bottom"
          error
          header="Failed to log in"
          list={genericProblems}
          hidden={genericProblems.length === 0}
        />
        <Message
          attached="bottom"
          error
          header="Invalid username"
          list={usernameProblems}
          hidden={usernameProblems.length === 0}
        />
        <Message
          attached="bottom"
          error
          header="Invalid password"
          list={passwordProblems}
          hidden={passwordProblems.length === 0}
        />
        <Form onSubmit={this.onLoginSubmit}>
          <Form.Input
            onChange={this.handleUsernameInputChange}
            icon="user"
            placeholder="Username"
          />
          <Form.Input
            onChange={this.handlePasswordInputChange}
            icon="key"
            placeholder="Password"
            type="password"
          />
          <Button type="submit">Log In</Button>
        </Form>
      </React.Fragment>
    );
  }
}

export default withRouter(LoginPage);
