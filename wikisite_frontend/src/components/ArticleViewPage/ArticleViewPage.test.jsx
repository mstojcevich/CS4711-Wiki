import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ArticleViewPage from './ArticleViewPage';

jest.mock('react-quill');

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><ArticleViewPage /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
