import React, { useState } from "react";
import { Card } from "react-bootstrap";
import Comment from "../comment/Comment";
import { PostType, CommentType } from "../../types/types";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify"; // Import toast
import parse from "html-react-parser";

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>(post.comments || []);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty or just whitespace.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}posts/${post.id}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast.error("You are using a guest account, please login to comment.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  return (
    <Card className="mb-4 border border-white card-custom">
     <Card.Body className="d-flex flex-column">
  <div className="d-flex justify-content-between align-items-center">
    <Card.Title className="mb-0" style={{ fontSize: "2rem" }}>
      Title: {post.title}
    </Card.Title>
    <div className="text-muted text-end">
      <small>{post.user ? post.user.fullname : "Anonymous"}</small>
      <br />
      <small>{new Date(post.timestamp).toLocaleDateString()}</small>
    </div>
  </div>

  <div className="bg-light p-2">
    {parse(post.content)}
  </div>

  <h6>Comments:</h6>
  {comments.length > 0 &&
    comments.map((comment) => (
      <Comment
        key={comment.id}
        comment={comment}
        postId={post.id}
        onDelete={handleDeleteComment}
      />
    ))}

  <form
    onSubmit={handleCommentSubmit}
    className="mt-3 d-flex align-items-center"
  >
    <input
      type="text"
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      placeholder="Add a comment..."
      required
      className="form-control"
    />
    <button type="submit" className="btn ms-2">
      <FontAwesomeIcon icon={faPaperPlane} />
    </button>
  </form>
</Card.Body>

    </Card>
  );
};

export default Post;
