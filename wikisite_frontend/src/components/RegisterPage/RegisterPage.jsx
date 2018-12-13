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
class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      username: '',
      password: '',
      usernameProblems: [],
      passwordProblems: [],
      genericProblems: [],
    };

    this.onRegisterSubmit = this.onRegisterSubmit.bind(this);
    this.handleUsernameInputChange = this.handleUsernameInputChange.bind(this);
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
  }

  /**
   * Log the user in, route back to '/'
   */
   onRegisterSubmit() {
     const { login, requests } = this.props;
     const { username, password } = this.state;

     requests.registerUser({
       username: username,
       password: password,
     }).then(response => (
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
       )
     )).catch((error) => {
       /*
       If the error wasn't actually generated by the API, error.content won't exist,
       so we just pass the error though as a non field failure.
       Note that non field failures can also come from the API.
       */
       const failures = error.content ? error.content : {
         non_field_failures: error,
       };

       this.setState({
         titleProblems: failures.name || [],
         contentProblems: failures.content || [],
         genericProblems: failures.non_field_failures || [],
       });
     });
   }
  /**
   * Update state with the current username text
   *
   * @param {event} e event object
   */
  handleEmailInputChange(e) {
    this.setState({ email: e.target.value });
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
    const { user, isLoggedIn } = this.props;

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
          header="Failed to register"
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
        <Form onSubmit={this.onRegisterSubmit}>
          <Form.Input
            onChange={this.handleUsernameInputChange}
            icon="user"
            placeholder="Desired Username"
          />
          <Form.Input
            onChange={this.handlePasswordInputChange}
            icon="key"
            placeholder="Password"
            type="password"
          />
          <Button type="submit">Register</Button>
        </Form>
      </React.Fragment>
    );
  }
}

export default withAPI(withRouter(RegisterPage));
