"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import axios from "axios";
import Post from "./components/Post";
import UploadForm from "./components/UploadForm";

const socket = io("http://localhost:4000");

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        router.push("/register");
      } else {
        setUser(storedUser);
        axios.get("http://localhost:4000/api/posts").then((response) => {
          setPosts(response.data);
        });

        socket.on("newPost", (newPost) => {
          setPosts((prevPosts) => [newPost, ...prevPosts]);
        });

        socket.on("updateLikes", ({ id, likes }) => {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === id ? { ...post, likes } : post
            )
          );
        });

        socket.on("newComment", ({ id, comments }) => {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === id ? { ...post, comments } : post
            )
          );
        });

        return () => {
          socket.off("newPost");
          socket.off("updateLikes");
          socket.off("newComment");
        };
      }
    }
  }, [router]);

  if (!user) {
    return null; // or a loading spinner, or some other fallback UI
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <UploadForm />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-8">
        {posts.map((post) => (
          <Post key={post.id} post={post} userId={user.username} />
        ))}
      </div>
    </div>
  );
}
