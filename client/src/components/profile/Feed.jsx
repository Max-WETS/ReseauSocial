import React, { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import Post from "./Post";
import Share from "./Share";

function Feed({ userData }) {
  const [posts, setPosts] = useState([]);
  const [confirmedFriends, setConfirmedFriends] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get(`/posts/timeline/${userData._id}`);
        const postsList = res.data.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateA > dateB ? -1 : 1;
        });
        setPosts(postsList);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, [userData]);

  useEffect(() => {
    const fetchConfirmedFriends = async () => {
      try {
        const res = await axiosInstance.get(`/friends/${user.userId}`);
        const confirmedFriendsList = res.data
          .filter((f) => f.status === "confirmé")
          .reduce((acc, obj) => {
            acc.push(obj.friendId);
            return acc;
          }, []);
        setConfirmedFriends(confirmedFriendsList);
      } catch (err) {
        console.log(err);
      }
    };
    fetchConfirmedFriends();
  }, [user.userId]);

  return (
    <>
      {(userData._id === user.userId ||
        confirmedFriends.includes(userData._id)) && (
        <Share
          user={user}
          userData={userData}
          setPosts={setPosts}
          posts={posts}
        />
      )}
      {posts.map((p) => (
        <Post post={p} key={p._id} setPosts={setPosts} />
      ))}
    </>
  );
}

export default Feed;
