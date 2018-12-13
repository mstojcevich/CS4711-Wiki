import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ProfilePage from './ProfilePage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><ProfilePage /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
