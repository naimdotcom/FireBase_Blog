import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { getDatabase, ref, set, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import { timeNow } from "../../utils/moment";
import { toast } from "keep-react";

function BlogPost() {
  const [content, setContent] = useState("");
  const db = getDatabase();
  const auth = getAuth();
  const [title, setTitle] = useState("");

  const handleChange = (value) => {
    setContent(value);
  };
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      toast("Error", { description: "Title and Content is required" });
      return;
    }
    const starCountRef = ref(db, `blogs/${auth.currentUser.uid}/`);
    set(push(starCountRef), {
      creator: auth.currentUser.uid,
      content: content,
      likes: 0,
      title: title,
      createdAt: timeNow(),
      updatedAt: timeNow(),
    }).then(() => {
      setContent("");
      toast("Blog Published", {
        description: "Thanks for publishing your blog",
      });
    });
  };

  return (
    <div className="container mx-auto space-y-9">
      <p className="mt-10">Write your blog</p>
      <div className="w-full space-y-4">
        <div className="flex space-x-3 items-center ">
          <h3>Title: </h3>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter blog title"
            className="w-full p-3 border rounded"
          />
        </div>
        <div className="flex items-center w-full space-x-4">
          <h3>Content:</h3>
          <ReactQuill
            value={content}
            className="w-full"
            onChange={handleChange}
          />
        </div>
      </div>
      <button
        onClick={handlePublish}
        className=" px-5 py-2 bg-blue-500 w-full rounded-full text-white font-bold "
      >
        Publish
      </button>
    </div>
  );
}

export default BlogPost;
