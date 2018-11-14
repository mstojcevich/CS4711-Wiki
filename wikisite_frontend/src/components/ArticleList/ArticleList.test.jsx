import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ArticleList from './ArticleList';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><ArticleList /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
