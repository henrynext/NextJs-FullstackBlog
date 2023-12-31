import CategoriedsList from "@/components/CategoriedsList";
import Post from "@/components/Post";
import Image from "next/image";
import { TPost } from "./types";

const getPosts = async ():Promise<TPost[] | null> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts`, {
      cache: "no-store",
    });

    if (res.ok) {
      const posts = await res.json();
      return posts;
    }
  } catch (error) {
    console.log(error);
    
  }

  return null;
};

export default async function Home() {
  const posts = await getPosts();
  return (
    <>
      <CategoriedsList />
      {posts && posts.length > 0 ? (
        posts.map((post, i) => (
          <Post
            key={post.id}
            id={post.id}
            author={post.author.name}
            authorEmail={post.authorEmail}
            date={post.createdAt}
            thumbnail={post.imageUrl}
            title={post.title}
            content={post.content}
            category={post.catName}
            links={post.links || []}
          />
        ))
      ) : (
        <div className="py-6">No Posts</div>
      )}
    </>
  );
}
