require('./ImageUploadPlaceholder.js');

class ImageUpload {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.range = null;

    if (typeof (this.options.upload) !== 'function') {
      console.warn('[Missing config] upload function that returns a promise is required');
    }

    const toolbar = this.quill.getModule('toolbar');
    toolbar.addHandler('image', this.selectLocalImage.bind(this));
  }

  selectLocalImage() {
    this.range = this.quill.getSelection();
    this.fileHolder = document.createElement('input');
    this.fileHolder.setAttribute('type', 'file');
    this.fileHolder.setAttribute('accept', 'image/*');
    this.fileHolder.onchange = this.fileChanged.bind(this);
    this.fileHolder.click();
  }

  fileChanged() {
    const file = this.fileHolder.files[0];

    const fileReader = new FileReader();
    if (file) {
      fileReader.readAsDataURL(file);
    }

    this.options.upload(file)
      .then((params) => {
        this.insertToEditor(params);
      },
      (error) => {
        console.warn(error.message);
      });
  }

  insertToEditor(params) {
    this.quill.setContents(this.quill.getContents().insert({ imageUpload: params.url }, { 'data-meta-url': params.metaUrl }));
  }
}

export default ImageUpload;
