import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Spinner,
  Container,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { PostType } from "../../types/types";
import CreatePostModal from "../../components/modal/CreatePostModal";
import EditPostModal from "../../components/modal/EditPostModal";
import Post from "../../components/post/Post";
import { toast } from 'react-toastify'; // Import toast

const Profile: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostType | null>(null);
  const [userFullName, setUserFullName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchUserPosts = async () => {
      const accessToken = localStorage.getItem("access_token");
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}posts/my-posts`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            page: currentPage,
            limit: 5,
          },
        });
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setError("Error fetching user posts.");
        console.error("Error fetching user posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setUserFullName(user.fullname);
    }

    fetchUserPosts();
  }, [BASE_URL, currentPage]);

  const handleCreatePost = async (title: string, content: string) => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      toast.error("Title and content cannot be empty."); // Error toast
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await axios.post(
        `${BASE_URL}posts`,
        { title: trimmedTitle, content: trimmedContent },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setPosts((prevPosts) => [response.data, ...prevPosts]);
      toast.success("Post created successfully!"); // Success toast
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post."); // Error toast
    }
  };

  const handleEditPost = async (postId: string, title: string, content: string) => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      toast.error("Title and content cannot be empty."); // Error toast
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await axios.put(
        `${BASE_URL}posts/${postId}`,
        { title: trimmedTitle, content: trimmedContent },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? response.data : post))
      );
      setShowEditModal(false);
      toast.success("Post edited successfully!"); // Success toast
    } catch (error) {
      console.error("Error editing post:", error);
      toast.error("Failed to edit post."); // Error toast
    }
  };

  const handleDeletePost = async (postId: string) => {
    const accessToken = localStorage.getItem("access_token");
    try {
      await axios.delete(`${BASE_URL}posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      toast.success("Post deleted successfully!"); // Success toast
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post."); // Error toast
    }
  };

  const openEditModal = (post: PostType) => {
    setCurrentPost(post);
    setShowEditModal(true);
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const postRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getPostStyle = (index: number): React.CSSProperties => {
    const postElement = postRefs.current[index];
    return postElement && postElement.scrollHeight > 500
      ? { overflowY: "scroll", maxHeight: "500px" }
      : {};
  };

  if (isLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 text-center">
        <p>{error}</p>
      </Container>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={{ textTransform: "capitalize" }}>
          {userFullName}'s Profile
        </h2>
        <Button onClick={() => setShowCreateModal(true)}>Create Post</Button>
      </div>

      <Row>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post, index) => (
            <Col key={post.id} xs={12} className="mb-3">
              <div className="border border-secondary shadow p-3 rounded">
                <div className="d-flex justify-content-end mb-2">
                  <div className="d-flex">
                    <FaEdit
                      className="me-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => openEditModal(post)}
                    />
                    <FaTrash
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDeletePost(post.id)}
                    />
                  </div>
                </div>
                <div
                  ref={(el) => (postRefs.current[index] = el)}
                  style={getPostStyle(index)}
                >
                  <Post post={post} />
                </div>
              </div>
            </Col>
          ))
        )}
      </Row>

      <Pagination className="mt-4">
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>

      <CreatePostModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
      />
      {currentPost && (
        <EditPostModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          post={currentPost}
          onSubmit={handleEditPost}
        />
      )}
    </div>
  );
};

export default Profile;
