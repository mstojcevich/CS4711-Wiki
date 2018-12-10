import React from 'react';
import ReactDOM from 'react-dom';
import ImageMetaModal from './ImageMetaModal';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ImageMetaModal />, div);
  ReactDOM.unmountComponentAtNode(div);
});
