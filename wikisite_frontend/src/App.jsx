import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Card, Container, Header } from 'semantic-ui-react';

import * as coreapi from 'coreapi';

import Navbar from './components/Navbar/Navbar';
import NotFound from './components/NotFound/NotFound';
import LoginPage from './components/LoginPage/LoginPage';

window.client = new coreapi.Client();
window.schema = null;
window.client.get('http://localhost:8000/schema/').then((schema) => {
  window.schema = schema;
});

/**
 * App component
 *
 * This component will wrap the entire application.
 *
 * It handles the following:
 * - Rendering Navbar
 * - Routing
 *   - Render the currently routed to page component or a 404 page
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };

    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  /**
   * Callback function used to assign a user object to App state
   *
   * @param {object} user information from the API detailing a user
   */
  onLogin(user) {
    this.setState({
      user,
    });
  }

  /**
   * Callback function used to remove the user object from App state
   */
  onLogout() {
    this.setState({
      user: null,
    });
  }

  render() {
    const { user } = this.state;
    return (
      <Container>
        <Router>
          <React.Fragment>
            {/* Render navbar above router / all pages */}
            <Navbar user={user} logout={this.onLogout} />
            {/* Render page based on current URL */}
            <Card fluid>
              <Card.Content>
                <Switch>
                  <Route path="/" exact component={() => <Header as="h1">Home page</Header>} />
                  <Route path="/login" exact component={() => <LoginPage onLogin={this.onLogin} />} />
                  <Route
                    path="/profile/:userId"
                    exact
                    component={
                      ({ match: { params } }) => (
                        <Header as="h1">Welcome user (id={params.userId})</Header>
                      )
                    }
                  />
                  <Route component={NotFound} />
                </Switch>
              </Card.Content>
            </Card>
          </React.Fragment>
        </Router>
      </Container>
    );
  }
}

export default App;
