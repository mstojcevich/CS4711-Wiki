import React from 'react';
import ReactDOM from 'react-dom';
import NotFound from './UserSettings';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UserSettings />, div);
  ReactDOM.unmountComponentAtNode(div);
});
