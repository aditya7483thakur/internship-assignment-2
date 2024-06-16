"use client";
"use client";
import { useState } from "react";
import axios from "axios";

export default function Post({ post, userId }) {
  const [comment, setComment] = useState("");

  const handleLike = async () => {
    try {
      await axios.post(`http://localhost:4000/api/posts/${post.id}/like`, {
        userId,
      });
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  const handleComment = async () => {
    try {
      await axios.post(`http://localhost:4000/api/posts/${post.id}/comment`, {
        userId,
        comment,
      });
      setComment("");
    } catch (error) {
      console.error("Error commenting on the post:", error);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <img
          src={post.photoUrl}
          alt="Post Image"
          className="w-full h-64 object-fit"
        />
        <div className="p-4">
          <p className="text-white text-lg">{post.description}</p>
          <p className="text-white">Likes: {post.likes}</p>
          <button
            onClick={handleLike}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-2 mr-2 focus:outline-none"
          >
            Like
          </button>
          <div className="mt-4">
            {post.comments.map((comment, index) => (
              <p key={index} className="text-white">
                {comment}
              </p>
            ))}
          </div>
          <textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 mt-2 rounded focus:outline-none"
          />
          <button
            onClick={handleComment}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-2 focus:outline-none"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
}
