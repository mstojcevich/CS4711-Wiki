import React from 'react';
import ReactDOM from 'react-dom';
import ImageViewModal from './ImageViewModal';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ImageViewModal />, div);
  ReactDOM.unmountComponentAtNode(div);
});
