import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import MyEditor from "../textEditor/MyEditor";

const CreatePostModal: React.FC<{ show: boolean; onHide: () => void; onSubmit: (title: string, content: string) => void }> = ({ show, onHide, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, content);
    setTitle("");
    setContent("");
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="postTitle">
            <Form.Label>Post Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="postContent">
            <Form.Label>Post Content</Form.Label>
            <MyEditor onChange={setContent} /> {/* Use MyEditor here */}
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">Create Post</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePostModal;
