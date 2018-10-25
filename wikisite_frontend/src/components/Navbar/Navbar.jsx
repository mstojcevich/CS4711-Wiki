import React from 'react';
import { Menu, Container, Form } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';

/**
 * NavBar component
 *
 * Display links, article search bar, login/logout/register links
 */
class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
    };

    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
  }

  /**
   * Navigate to an article based on search query
   *
   * eg. /articles/{searchQuery}
   */
  onSearchSubmit() {
    const { searchQuery } = this.state;
    const { history } = this.props;

    if (searchQuery !== '') {
      history.push(`/articles/${searchQuery}`);
    }
  }

  /**
   * Update state with the user's current search text
   *
   * @param {event} e event object
   */
  handleSearchInputChange(e) {
    this.setState({ searchQuery: e.target.value });
  }

  render() {
    return (
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header>
            <Link to="/">Wikisite</Link>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Form onSubmit={this.onSearchSubmit}>
                <Form.Input
                  onChange={this.handleSearchInputChange}
                  icon="search"
                  placeholder="Search for articles..."
                />
              </Form>
            </Menu.Item>
            <UserSection {...this.props} />
          </Menu.Menu>
        </Container>
      </Menu>
    );
  }
}

function LoggedInUserSection(props) {
  const { user, logout } = props;

  return (
    <React.Fragment>
      <Menu.Item>
        <Link to={`/profile/${user.user_id}`}>{ user.displayName }</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/" onClick={logout}>Logout</Link>
      </Menu.Item>
    </React.Fragment>
  );
}

function LoggedOutUserSection() {
  return (
    <>
      <Menu.Item>
        <Link to="/login">Register</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/login">Login</Link>
      </Menu.Item>
    </>
  );
}

function UserSection(props) {
  const { user } = props;

  if (user !== null && user !== undefined) {
    return <LoggedInUserSection {...props} />;
  }

  return <LoggedOutUserSection {...props} />;
}

export default withRouter(NavBar);
