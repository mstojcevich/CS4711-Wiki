import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from './HomePage';

const props = {
  isLoggedIn: () => false,
  requests: {
    getArticles: () => new Promise(resolve => resolve()),
  },
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><HomePage {...props} /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
