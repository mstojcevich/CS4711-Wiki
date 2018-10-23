import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Card, Container, Header } from 'semantic-ui-react';

import Navbar from './components/Navbar/Navbar';
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
      <Container>
        <Router>
          <React.Fragment>
            {/* Render navbar above router / all pages */}
            <Navbar />
            {/* Render page based on current URL */}
            <Card fluid>
              <Card.Content>
                <Switch>
                  <Route path="/" exact component={() => <Header as="h1">Home page</Header>} />
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
