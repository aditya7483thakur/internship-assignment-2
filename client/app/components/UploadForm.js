"use client"; // pages/uploadForm.js
import { useState } from "react";
import axios from "axios";

export default function UploadForm() {
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // State to track upload status

  const handleUpload = async () => {
    if (!photo) {
      alert("Please select a photo to upload.");
      return;
    }

    setIsUploading(true); // Set upload state to true

    try {
      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("description", description);

      await axios.post("http://localhost:4000/api/upload", formData);
      setDescription(""); // Clear description input
      setPhoto(null); // Clear photo input after successful upload
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false); // Reset upload state to false after completion
    }
  };

  // Function to handle file input change
  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]); // Update photo state with selected file
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="bg-gray-900 w-full m-5 h-30vh px-6 md:mx-auto rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-800 p-8 rounded-lg">
          <h1 className="text-3xl text-white font-bold mb-6 text-center">
            Upload Form
          </h1>
          <div className="mb-4">
            <label htmlFor="description" className="block text-white">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="photo" className="block text-white">
              Choose Photo
            </label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handleFileChange} // Handle file input change
              className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={isUploading} // Disable button during upload
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
