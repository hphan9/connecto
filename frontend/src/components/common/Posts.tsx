import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import Post, { PostModel } from "./Post";
import { useEffect } from "react";

interface Props {
  feedType: string;
  username: string;
  userId: string;
}
const Posts = ({ feedType, username, userId }: Props) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/timeline";
      case "posts":
        // rememeber to put the "/" before url since fech("url") is relative to root
        return "/api/posts/user/" + username;
      case "likes":
        return "/api/posts/likes/" + userId;
      default:
        return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();
  console.log(POST_ENDPOINT);
  const {
    data: posts,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<Array<PostModel>>({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT, {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something wrong");
        return data;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
  });
  useEffect(() => {
    refetch();
  }, [feedType, username, refetch]);
  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post {...post} key={post._id} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
