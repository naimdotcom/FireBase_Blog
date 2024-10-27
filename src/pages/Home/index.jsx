import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";

import { CardComponent } from "../../components/KeepComponent/CardComponent";
import { SkeletonComponent } from "../../components/KeepComponent/SkeletonComponent";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const auth = getAuth();
  const db = getDatabase();

  const options = {
    wordwrap: 1,
    limits: 10,
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    // Reference to the 'blogs' path in Firebase
    const blogsRef = ref(db, "blogs");

    // Fetch data
    onValue(blogsRef, (snapshot) => {
      const data = snapshot.val();

      // Convert the object to an array
      const blogsArray = [];
      for (let userId in data) {
        for (let blogId in data[userId]) {
          blogsArray.push({ id: blogId, ...data[userId][blogId] });
        }
      }

      // Shuffle the blogs array and update state
      setBlogs(shuffleArray(blogsArray));
    });
  }, [db]);

  console.log("blogs", blogs);

  return (
    <div className="container mx-auto py-20 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.length > 0
          ? blogs.map((blog) => (
              <div key={blog.id} className="">
                <CardComponent data={blog} />
              </div>
            ))
          : [...Array(5)].map(() => <SkeletonComponent />)}
      </div>
    </div>
  );
}

export default Home;
