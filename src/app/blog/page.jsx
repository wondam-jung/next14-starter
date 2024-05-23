import PostCard from "../../components/postCard/postCard";
import styles from "./blog.module.css";
import { getPosts } from "../../lib/data";

// FETCH DATA WITH AN API
const getData = async () => {
    const res = await fetch("http://localhost:3000/api/blog", { next: { revalidate: 3600 } });

    if (!res.ok) {
        throw new Error("Something went wrong");
    }

    return res.json();
};
// page 에 async 붙이면 server side component 인가
const BlogPage = async () => {
    // const posts = await getPosts(); using server actions. fetching data without an api
    const posts = await getData(); // fetching data with api
    return (
        <div className={styles.container}>
            {posts.map((post) => (
                <div className={styles.post} key={post.id}>
                    <PostCard post={post} />
                </div>
            ))}
        </div>
    );
};

export default BlogPage;