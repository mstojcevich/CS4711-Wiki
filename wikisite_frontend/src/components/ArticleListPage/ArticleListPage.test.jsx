import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ArticleListPage from './ArticleListPage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><ArticleListPage /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
