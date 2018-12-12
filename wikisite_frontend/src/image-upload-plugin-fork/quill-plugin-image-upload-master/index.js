require('./ImageUploadPlaceholder.js');
const imageIdManger = require('./imageIdManger');
const constant = require('./constant');

class ImageUpload {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.range = null;

    if (typeof (this.options.upload) !== 'function') {console.warn('[Missing config] upload function that returns a promise is required');}

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
    const imageId = imageIdManger.generate();

    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      // const base64ImageSrc = fileReader.result;
      // this.insertBase64Image(base64ImageSrc, imageId);
    }, false);
    if (file) {
      fileReader.readAsDataURL(file);
    }

    this.options.upload(file)
      .then((params) => {
        this.insertToEditor(params, imageId);
      },
      (error) => {
        console.warn(error.message);
      });
  }

  insertBase64Image(url, imageId) {
    const { range } = this;
    this.quill.insertEmbed(range.index, 'imageUpload', `${imageId}${constant.ID_SPLIT_FLAG}${url}`);
  }

  insertToEditor(params) {
    console.log(params)
    this.quill.updateContents(this.quill.getContents().insert({ imageUpload: params.url }, { 'data-meta-url': params.metaUrl }));
  }
}

export default ImageUpload;
