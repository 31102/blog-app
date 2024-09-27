import React, { useState } from 'react';
import { Modal as BootstrapModal, Button, Form } from 'react-bootstrap';

interface ReplyModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (content: string) => void;
}

const ReplyModal: React.FC<ReplyModalProps> = ({ show, onHide, onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue);
      setInputValue('');
      onHide();
    }
  };

  return (
    <BootstrapModal show={show} onHide={onHide} size="lg">
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>Add a Reply</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={5}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your reply here..."
              required
            />
          </Form.Group>
          <div className="modal-footer">
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </BootstrapModal.Body>
    </BootstrapModal>
  );
};

export default ReplyModal;
