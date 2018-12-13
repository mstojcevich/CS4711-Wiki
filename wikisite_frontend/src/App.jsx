import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Card, Container } from 'semantic-ui-react';

import APIHandler from './components/APIHandler/APIHandler';
import Navbar from './components/Navbar/Navbar';
import NotFound from './components/NotFound/NotFound';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import HomePage from './components/HomePage/HomePage';
import ComposePage from './components/ComposePage/ComposePage';
import ArticleViewPage from './components/ArticleViewPage/ArticleViewPage';
import ArticleListPage from './components/ArticleListPage/ArticleListPage';

/**
 * App component
 *
 * This component will wrap the entire application.
 *
 * It handles the following:
 * - Rendering Navbar
 * - Routing
 *   - Render the currently routed to page component or a 404 page
 * - Setting up API provider
 */
class App extends React.Component {
  render() {
    return (
      <APIHandler>
        <Container>
          <Router>
            <React.Fragment>
              {/* Render navbar above router / all pages */}
              <Navbar />
              {/* Render page based on current URL */}
              <Card fluid>
                <Card.Content>
                  <Switch>
                    <Route path="/" exact component={() => <HomePage />} />
                    <Route path="/login" exact component={() => <LoginPage onLogin={this.onLogin} />} />
                    <Route path="/register" exact component={() => <RegisterPage onRegister={this.onRegister} />} />
                    <Route path="/compose" exact component={() => <ComposePage />} />
                    <Route path="/article-list" exact component={() => <ArticleListPage />} />
                    <Route
                      path="/articles/:id"
                      exact
                      component={
                        ({ match }) => <ArticleViewPage id={match.params.id} />
                      }
                    />
                    <Route
                      path="/profile/:userId"
                      exact
                      component={
                        ({ match: { params } }) => (
                          <ProfilePage />
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
      </APIHandler>
    );
  }
}

export default App;
