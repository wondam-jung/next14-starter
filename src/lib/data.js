import { unstable_noStore as noStore } from "next/cache";
import { Post, User } from "./models";
import { connectToDb } from "./utils";

export const getPosts = async () => {
    try {
        connectToDb(); // noStore 사용안함 (캐시 사용함)
        const posts = await Post.find();
        return posts;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to fetch posts!");
    }
};


export const getPost = async (slug) => {
    try {
        connectToDb();
        const post = await Post.findOne({ slug });
        return post;
    } catch (error) {
        throw new Error("failed to get Post");
    }
};

export const getUser = async (id) => {
    noStore();
    try {
        connectToDb();
        const user = await User.findById(id);
        return user;
    } catch (error) {
        throw new Error("failed to get User");
    }
};

export const getUsers = async (id) => {
    try {
        connectToDb();
        const users = await User.find();
        return users;
    } catch (error) {
        throw new Error("failed to get Users");
    }
};