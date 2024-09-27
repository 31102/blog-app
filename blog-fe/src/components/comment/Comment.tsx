import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { ReplyType } from "../../types/types";
import ReplyModal from "../modal/Modal";
import { toast } from 'react-toastify';

interface CommentProps {
  comment: {
    id: string;
    content: string;
    timestamp: string;
    user: {
      fullname: string;
    };
    replies?: ReplyType[];
  };
  postId: string;
  onDelete: (commentId: string) => void; // Callback for deleting the comment
}

const Comment: React.FC<CommentProps> = ({ comment, postId, onDelete }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [replies, setReplies] = useState<ReplyType[]>(comment.replies || []);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleToggleReplies = () => {
    setShowReplies((prev) => !prev);
  };

  const handleReplySubmit = async (content: string) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.post(
        `${BASE_URL}posts/${postId}/comments/${comment.id}/replies`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReplies((prev) => [...prev, response.data]);
      toast.success("Reply added successfully!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { statusCode } = error.response.data;
        if (statusCode === 401) {
          toast.error("You are using a guest account. You can only read comments and replies.");
        } else {
          toast.error("Failed to post reply.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleDeleteComment = async () => {
    const token = localStorage.getItem("access_token");
    try {
      await axios.delete(`${BASE_URL}posts/${postId}/comments/${comment.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Comment deleted successfully!");
      onDelete(comment.id);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { statusCode } = error.response.data;
        if (statusCode === 401) {
          toast.error("You are using a guest account. You can only read comments and replies.");
        } else if (statusCode === 403) {
          toast.error("You can only delete your comments.");
        } else {
          toast.error("Failed to delete comment.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="comment mt-2 p-2 rounded border border-secondary shadow bg-light">
      <div className="d-flex justify-content-between">
        <strong>
          <FontAwesomeIcon icon={faComment} className="me-1" />
          {comment.user.fullname}
        </strong>
        <span className="text-muted">{new Date(comment.timestamp).toLocaleString()}</span>
      </div>
      <input
        type="text"
        value={comment.content}
        disabled
        className="form-control mt-2"
      />
      {replies.length > 0 && (
        <>
          <button onClick={handleToggleReplies} className="btn btn-link">
            {showReplies ? "Hide Replies" : "Show Replies"}
          </button>
          {showReplies && (
            <div className="ms-3">
              {replies.map((reply) => (
                <Reply key={reply.id} reply={reply} postId={postId} setReplies={setReplies} />
              ))}
            </div>
          )}
        </>
      )}
      <button onClick={() => setModalOpen(true)} className="btn btn-link">
        Add Reply
      </button>
      <button onClick={handleDeleteComment} className="btn btn-link text-danger">
        Delete Comment
      </button>
      <ReplyModal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        onSubmit={handleReplySubmit}
      />
    </div>
  );
};

const Reply: React.FC<{ reply: ReplyType; postId: string; setReplies: React.Dispatch<React.SetStateAction<ReplyType[]>> }> = ({ reply, postId, setReplies }) => {
  const [showNestedReplies, setShowNestedReplies] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [nestedReplies, setNestedReplies] = useState<ReplyType[]>(reply.replies || []);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleToggleNestedReplies = () => {
    setShowNestedReplies((prev) => !prev);
  };

  const handleReplySubmit = async (content: string) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.post(
        `${BASE_URL}posts/${postId}/comments/${reply.id}/replies`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNestedReplies((prev) => [...prev, response.data]);
      toast.success("Reply added successfully!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { statusCode } = error.response.data;
        if (statusCode === 401) {
          toast.error("You are using a guest account. You can only read comments and replies.");
        } else {
          toast.error("Failed to post reply.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleDeleteReply = async () => {
    const token = localStorage.getItem("access_token");
    try {
      await axios.delete(`${BASE_URL}posts/${postId}/comments/${reply.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Reply deleted successfully!");
      setReplies((prev) => prev.filter((r) => r.id !== reply.id));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { statusCode } = error.response.data;
        if (statusCode === 401) {
          toast.error("You are using a guest account. You can only read comments and replies.");
        } else {
          toast.error("You can only delete your replies.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="reply mt-2 p-2 rounded border border-secondary shadow bg-light">
      <div className="d-flex justify-content-between">
        <strong>{reply.user.fullname}</strong>
        <span className="text-muted">{new Date(reply.timestamp).toLocaleString()}</span>
      </div>
      <input
        type="text"
        value={reply.content}
        disabled
        className="form-control mt-2"
      />
      <button onClick={() => setModalOpen(true)} className="btn btn-link">
        Add Reply
      </button>
      <button onClick={handleDeleteReply} className="btn btn-link text-danger">
        Delete Reply
      </button>
      {nestedReplies.length > 0 && (
        <>
          <button onClick={handleToggleNestedReplies} className="btn btn-link">
            {showNestedReplies ? "Hide Replies" : "Show Replies"}
          </button>
          {showNestedReplies && (
            <div className="ms-3">
              {nestedReplies.map((nestedReply) => (
                <Reply key={nestedReply.id} reply={nestedReply} postId={postId} setReplies={setNestedReplies} />
              ))}
            </div>
          )}
        </>
      )}
      <ReplyModal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        onSubmit={handleReplySubmit}
      />
    </div>
  );
};

export default Comment;
