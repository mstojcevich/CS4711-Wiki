import React from 'react';
import ReactDOM from 'react-dom';
import ArticleListPage from './ArticleListPage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ArticleListPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
