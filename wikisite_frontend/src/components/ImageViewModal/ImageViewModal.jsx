import React from 'react';
import {
  Modal, Card, Image, Header,
} from 'semantic-ui-react';
import { withAPI } from '../APIHandler/APIHandler';
import { formatDate } from '../../util';

const getInitstate = () => ({
  comment: null,
  user: null,
  uploadDate: null,
  dimensions: null,
  size: null,
  isLoading: true,
  filename: null,
});

class ImageViewModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = getInitstate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.metaUrl !== this.props.metaUrl) {
      if (this.props.metaUrl === null) {
        this.setState(getInitstate);
      } else {
        this.fetchMetaInformation();
      }
    }
  }

  fetchMetaInformation() {
    const { metaUrl, requests: { getImageMeta } } = this.props;

    try {
      const id = metaUrl.split('/').slice(-2)[0];
      getImageMeta({ id }).then(response => this.setState({
        comment: response.comments,
        user: response.uploaded_by.username,
        uploadDate: response.upload_date,
        url: response.data.replace(/\/\d+\//, '/'),
        isLoading: false,
        filename: response.data.split('/').pop(),
      })).catch(e => this.setState({
        ...getInitstate(),
        isLoading: false,
      }));
    } catch (e) {
      console.warn(e);
    }
  }

  render() {
    const { visible, onClose } = this.props;
    const {
      comment,
      user,
      uploadDate,
      dimensions,
      url,
      size,
      isLoading,
      filename,
    } = this.state;

    if (isLoading) {
      return (
        <Modal open={visible} onClose={onClose} basic size="mini" closeIcon>
          <Modal.Header>Image information</Modal.Header>
          <Modal.Content>
            <Header as="h1">Loading...</Header>
          </Modal.Content>
        </Modal>
      );
    }

    return (
      <Modal open={visible} onClose={onClose} basic size="tiny" closeIcon>
        <Modal.Header>Image information</Modal.Header>
        <Modal.Content>
          <Card fluid>
            <Image src={url} />
            <Card.Content>
              <Card.Header>{filename}</Card.Header>
              <Card.Meta>
                <span className="date">Uploaded on {formatDate(uploadDate)} by <b>{user}</b></span>
              </Card.Meta>
              <Card.Description>{comment}</Card.Description>
            </Card.Content>
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}

export default withAPI(ImageViewModal);
