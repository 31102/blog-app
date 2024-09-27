import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Container, Pagination } from "react-bootstrap";
import Post from "../../components/post/Post";
import { PostType } from "../../types/types";
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}posts`, {
          params: { page: currentPage, limit },
        });
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Failed to fetch posts.");
        toast.error("Failed to fetch posts."); // Error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

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
    <Container className="mt-5">
      <h1 className="mb-4">All Posts</h1>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <div>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                maxHeight: "600px",
                overflowY: "scroll",
                overflowX: "hidden",
                border: "1px solid darkgray",
                borderRadius: "5px",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              <style>
                {`
                  ::-webkit-scrollbar {
                    width: 8px;
                  }
                  ::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  ::-webkit-scrollbar-thumb {
                    background-color: gray;
                    border-radius: 10px;
                  }
                  ::-webkit-scrollbar-thumb:hover {
                    background-color: darkgray;
                  }
                  scrollbar-width: thin;
                  scrollbar-color: gray transparent;
                `}
              </style>
              <Post post={post} />
            </div>
          ))}
        </div>
      )}

      <Pagination className="mt-4">
        <Pagination.Prev
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </Container>
  );
};

export default HomePage;
