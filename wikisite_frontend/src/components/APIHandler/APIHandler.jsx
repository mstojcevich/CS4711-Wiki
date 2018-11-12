import React from 'react';
import * as coreapi from 'coreapi';
import Cookies from 'js-cookie';

import requestFunctions from './APIRequests';

const API_URL = 'https://cs4711-team3-wiki.herokuapp.com/';
const SCHEMA_URL = `${API_URL}schema/`;

const API_CONTEXT = React.createContext({});

/**
 * Provide a react component with props that help you use the API
 *
 * e.x. (
 *   class MyUserName extends React.Component {
 *     render() {
 *       return <h1>I am {this.props.user.username}</h1>
 *     }
 *   }
 *
 *   export default withAPI(MyUserName);
 * )
 *
 * You can see from this example that when we export MyUserName, we pass it into the function
 * `withAPI` first. This makes sure MyUserName is passed props like `user` which contains user info
 * (if the app is logged in...)
 *
 * @param {React.Component} Component react component that will be passed API information via props
 */
export const withAPI = Component => (
  (props) => {
    const { Consumer } = API_CONTEXT;

    return (
      <Consumer>
        { ({
          isLoading, // {Boolean} is the APIHandler loading?
          isLoggedIn, // {Function} check if there is a logged in user on the page
          user, // {Object} user details
          login, // {Function} see loadAuthFromAPI function in this file
          logout, // {Function} see removeAuth function in this file
          requests, // {Object} API request functions defined in ./APIRequests.js
        }) => (!isLoading
          ? (
            <Component
              isLoading={isLoading}
              isLoggedIn={isLoggedIn}
              user={user}
              login={login}
              logout={logout}
              requests={requests}
              {...props}
            />
          ) : null)
        }
      </Consumer>
    );
  }
);

/**
 * Take all api request functions in APIRequests, plug in coreapi client and schema,
 * return them as an object
 *
 * @param {Object} client see coreapi documentation
 * @param {Object} schema see coreapi documentation
 *
 * @return {Object} keys named after functions that represent API requests
 */
const mapFunctionsToCoreAPI = (client, schema) => {
  const requests = {};

  requestFunctions.forEach((f) => {
    if (typeof f === 'function') {
      requests[f.name] = true
        ? params => (
          f(client, schema, params)
        )
        : () => (
          new Promise(
            () => { throw new Error('Client not initialized'); },
            () => { throw new Error('Client not initialized'); },
          )
        );
    }
  });

  return requests;
};

/**
 * Generate an object containing the initial state for APIHandler
 *
 * @return {Object} state object, see return val
 */
const getInitState = () => ({
  client: new coreapi.Client(),
  schema: null,
  user: null,
  loading: true,
  requests: {},
});

/**
 * Store all boilerplate logic for accessing coreapi, save results in own state
 */
export default class APIHandler extends React.Component {
  constructor(props) {
    super(props);

    const preState = getInitState();
    this.state = {
      ...preState,
      requests: mapFunctionsToCoreAPI(
        preState.client,
        preState.schema,
      ),
    };

    this.loadAuthFromAPI = this.loadAuthFromAPI.bind(this);
    this.removeAuth = this.removeAuth.bind(this);
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.clearLoading = this.clearLoading.bind(this);
  }

  componentDidMount() {
    this.setLoading(this.loadAuthFromCookie());
  }

  /**
   * Trigger loading in state and then optionally perform callback function
   *
   * @param {Function} callback will be called after updating loading state
   */
  setLoading(callback = () => {}) {
    this.setState({ loading: true }, callback);
  }

  /**
   * Take all api request functions in APIRequests, plug in coreapi client and schema,
   * put them in the state requests property
   */
  mapRequestsToClient() {
    const { client, schema } = this.state;
    const requests = mapFunctionsToCoreAPI(client, schema);

    this.setState({ requests }, this.clearLoading);
  }

  /**
   * End loading in state and then optionally perform callback function
   *
   * @param {Function} callback will be called after updating loading state
   */
  clearLoading(callback = () => {}) {
    this.setState({ loading: false }, callback);
  }

  /**
   * Authenticate a user with a specified username and password
   *
   * @param onSuccess Function to be called on successful login,
   *  called w/ object argument of format {username: ..., uid: ..., ...: ...}
   * @param onFail Function to be called on unsuccessful login,
   *  called w/ an object of the format:
   *  {
   *    username: list of problems as strings,
   *    password: list of problems as strings
   *  }
   */
  loadAuthFromAPI(username, password, onSuccess, onFail) {
    const action = ['api-token-auth', 'create'];
    const params = { username, password };
    const { client, schema } = this.state;

    this.setLoading(
      () => client.action(schema, action, params).then((authenticatedUser) => {
        const auth = new coreapi.auth.TokenAuthentication({
          scheme: 'Token',
          token: authenticatedUser.token,
        });

        this.setState({
          client: new coreapi.Client({ auth }),
        }, () => {
          const { client: clientAfterUpdate } = this.state;
          // Get the new schema (w/ authenticated endpoints),
          clientAfterUpdate.get(SCHEMA_URL).then((newSchema) => {
            // Save the schema and user in state,
            this.setState({
              schema: newSchema,
              user: authenticatedUser,
            }, () => {
              const { user } = this.state;

              // Save the user information in a cookie
              Cookies.set('user', JSON.stringify(user));

              // Update available requests
              this.mapRequestsToClient();

              // Call the success callback function
              onSuccess(user);
            });
          }).catch(error => this.clearLoading(onFail(error.content)));
        });
      }).catch(error => this.clearLoading(onFail(error.content))),
    );
  }

  /**
   * Updates the client property in state with a new client, re-authenticated from the API with the
   * token stored in cookies; If cookies do not exist, load a fresh schema and wipe other state.
   */
  loadAuthFromCookie() {
    // Set the user from cookie if it exists
    const userCookie = Cookies.get('user');

    if (userCookie) {
      // Re-authenticate with saved user token
      const auth = new coreapi.auth.TokenAuthentication({
        scheme: 'Token',
        token: JSON.parse(userCookie).token,
      });

      // Refresh the client with new authentication
      this.setState({
        client: new coreapi.Client({ auth }),
      }, () => {
        const { client: clientAfterUpdate } = this.state;

        // Load the schema w/ authenticated endpoints
        clientAfterUpdate.get(SCHEMA_URL).then((schema) => {
          this.setState({
            schema,
            user: JSON.parse(userCookie),
          }, this.mapRequestsToClient);
        }).catch(error => this.clearLoading(console.error(error.content)));
      });
    } else {
      // The user has no cookie, re-initialize state
      const { client } = this.state;

      client.get(SCHEMA_URL).then((schema) => {
        this.setState({
          ...getInitState(),
          schema,
        }, this.mapRequestsToClient);
      }).catch(error => this.clearLoading(console.error(error.content)));
    }
  }

  /**
   * Remove the user object from state and cookies
   */
  removeAuth() {
    this.setState(getInitState(), () => {
      Cookies.remove('user');

      // This will just reload the un-authenticated schema since there is no user cookie
      this.loadAuthFromCookie();
    });
  }

  /**
   * Check that the user's authentication is good
   *
   * TODO: Actually verify token validity from the API and return a promise that consumers can wait
   * on
   */
  checkAuthentication() {
    const { user, loading } = this.state;

    return (
      user !== null
      && loading === false
    );
  }

  render() {
    const {
      loading,
      user,
      requests,
    } = this.state;
    const { children } = this.props;
    const { Provider } = API_CONTEXT;
    const Child = React.Children.only(children);

    return (
      <Provider value={{
        isLoading: loading,
        isLoggedIn: this.checkAuthentication,
        user,
        login: this.loadAuthFromAPI,
        logout: this.removeAuth,
        requests,
      }}
      >
        {Child}
      </Provider>
    );
  }
}
