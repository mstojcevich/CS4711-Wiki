import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import RecentArticles from './RecentArticles';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><RecentArticles /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
