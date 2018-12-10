import React from 'react';
import {
  Modal, Input, Button, Icon,
} from 'semantic-ui-react';

class ImageMetaModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageComment: '',
    };

    this.setImageComment = this.setImageComment.bind(this);
    this.submit = this.submit.bind(this);
  }

  setImageComment({ target: { value: imageComment } }) {
    this.setState({ imageComment });
  }

  submit() {
    const { imageComment } = this.state;
    const { onSubmit } = this.props;

    onSubmit(imageComment);
  }

  render() {
    const { imageComment } = this.state;
    const { visible = false, onCancel } = this.props;

    return (
      <Modal open={visible} closeIcon onClose={onCancel}>
        <Modal.Header>Enter image comment</Modal.Header>
        <Modal.Content>
          <label>
            Image comment (optional)&nbsp;
            <Input icon="image" placeholder="Enter a comment" value={imageComment} onChange={this.setImageComment} />
          </label>
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={this.submit}>
            <Icon name="checkmark" /> Done
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ImageMetaModal;
