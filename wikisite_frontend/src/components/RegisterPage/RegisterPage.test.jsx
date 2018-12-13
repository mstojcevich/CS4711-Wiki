import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './RegisterPage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><RegisterPage /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
