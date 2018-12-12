const Quill = require('quill');

const Image = Quill.import('formats/image');

const ATTRIBUTES = [
  'alt',
  'height',
  'width',
  'data-meta-url',
];

class ImageUpload extends Image {
  static formats(domNode) {
    return ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        // eslint-disable-next-line
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

ImageUpload.blotName = 'imageUpload';

Quill.register({
  'formats/imageUpload': ImageUpload,
});
