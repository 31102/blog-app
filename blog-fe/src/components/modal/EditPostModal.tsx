import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import MyEditor from "../textEditor/MyEditor";

interface EditPostModalProps {
  show: boolean;
  onHide: () => void;
  post: { id: string; title: string; content: string } | null; // Allow null for initial state
  onSubmit: (postId: string, title: string, content: string) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ show, onHide, post, onSubmit }) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  // Update title and content whenever the post changes
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (post) {
      onSubmit(post.id, title, content);
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="editPostTitle">
            <Form.Label>Post Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="editPostContent">
            <Form.Label>Post Content</Form.Label>
            <MyEditor onChange={setContent} initialContent={content} /> {/* Use MyEditor here */}
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">Save Changes</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPostModal;
