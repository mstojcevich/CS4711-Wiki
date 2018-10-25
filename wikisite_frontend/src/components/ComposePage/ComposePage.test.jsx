import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ComposePage from './ComposePage';

it.skip('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><ComposePage /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});

// Skipped until we can get Quill to work under test
