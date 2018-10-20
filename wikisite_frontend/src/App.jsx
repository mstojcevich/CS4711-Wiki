import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Card, Container, Header } from 'semantic-ui-react';

import NotFound from './components/NotFound/NotFound';
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
  render() {
    return (
      <React.Fragment>
        {/* Render navbar above router / all pages */}

        {/* Render page based on current URL */}
        <Container className="top-pad">
          <Card fluid>
            <Card.Content>
              <Router>
                <Switch>
                  <Route path="/" exact component={() => <Header as="h1">Home page</Header>} />
                  <Route component={NotFound} />
                </Switch>
              </Router>
            </Card.Content>
          </Card>
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
