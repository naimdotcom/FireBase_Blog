import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "keep-react";
import parse from "html-react-parser";
import moment from "moment";

function SingleBlog() {
  const [blog, setBlog] = useState({});
  const [user, setUser] = useState({});
  const { authId, blogId } = useParams();
  const navigator = useNavigate();
  const option = {
    replace: (domNode) => {
      if (domNode.name === "a") {
        return (
          <a
            href={domNode.attribs.href}
            target={domNode.attribs.target}
            rel={domNode.attribs.rel}
            className="text-blue-600 underline hover:text-blue-800 hover:no-underline" // Tailwind CSS styles
          >
            {domNode.children[0].data}
            {""}
            {/* Assuming there's only one text node */}
          </a>
        );
      }
    },
  };

  useEffect(() => {
    const db = getDatabase();
    const starCountRef = ref(db, `blogs/${authId}/${blogId}`);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setBlog(data);
    });

    onValue(ref(db, `users/${authId}`), (snapshot) => {
      const data = snapshot.val();
      setUser(data);
    });
  }, [authId, blogId]);

  return (
    <div className="container mx-auto py-7 w-full space-y-5">
      <div
        onClick={() => {
          navigator(`/user/${authId}`);
        }}
      >
        <Card className="min-w-full">
          <CardContent className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user?.profileImage ? user?.profileImage : ""} />
              <AvatarFallback>unknown</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user?.username ? user?.username : ""}</CardTitle>
              <CardDescription>
                Joined: {moment(blog?.createdAt).fromNow()}
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full">
        <Card className="min-w-full">
          <CardContent className="text-center">
            <CardTitle className="text-3xl font-bold underline capitalize">
              {blog?.title ? blog?.title : ""}
            </CardTitle>
            <CardDescription className="px-10 py-20">
              <p>{parse(blog?.content ? blog?.content : "", option)}</p>
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SingleBlog;
