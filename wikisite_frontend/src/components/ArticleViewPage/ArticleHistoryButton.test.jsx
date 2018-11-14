import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ArticleHistoryButton from './ArticleHistoryButton';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><ArticleHistoryButton /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
