import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { useMutation, useQuery } from "@tanstack/react-query";
import Post, { PostModel } from "./Post";
import toast from "react-hot-toast";
import { useEffect } from "react";

interface Props {
  feedType: string;
}
const Posts = ({ feedType }: Props) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      default:
        return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();
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
        throw new Error(error);
      }
    },
  });
  useEffect(() => {
    refetch();
  }, [feedType]);
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
