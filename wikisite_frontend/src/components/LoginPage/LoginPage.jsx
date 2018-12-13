import React from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import { withAPI } from '../APIHandler/APIHandler';

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
    const { login } = this.props;

    login(
      username,
      password,
      () => {
        this.setState({
          usernameProblems: [],
          passwordProblems: [],
          genericProblems: [],
        });
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
    const { isLoggedIn, user } = this.props;

    if (isLoggedIn()) {
      return (
        <Redirect to={`/profile/${user.username}`} />
      );
    }

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

export default withAPI(withRouter(LoginPage));
