import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SkeletonComponent } from "../../components/KeepComponent/SkeletonComponent";
import { CardComponent } from "../../components/KeepComponent/CardComponent";

function Account() {
  const { authId } = useParams();
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const starCountRef = ref(db, `blogs/${authId}`);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      const arr = [];
      snapshot.forEach((childSnapshot) => {
        arr.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setBlog(arr);
    });
  }, [authId]);

  console.log("====================================");
  console.log(blog, authId);
  console.log("====================================");
  return (
    <div className="container mx-auto py-20">
      <div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blog.length > 0
          ? blog.map((item) => (
              <div key={item.id} className="">
                <CardComponent data={item} />
              </div>
            ))
          : [...Array(5)].map(() => <SkeletonComponent />)}
      </div>
    </div>
  );
}

export default Account;
