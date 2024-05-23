"use server";
import { connectToDb } from "./utils";
import { revalidatePath } from "next/cache";
import { Post, User } from "./models";
import { signIn, signOut } from "../lib/auth";
import bcrypt from "bcryptjs";

/* server action
클라이언트에서 직접 서버 사이드 로직을 호출할 수 있어, API 경로를 거치지 않고도 서버와 통신.
*/

export const addPost = async (prevState, formData) => {
    const { title, desc, slug, userId } = Object.fromEntries(formData);
    try {
        connectToDb();
        const newPost = new Post({ title, desc, slug, userId });
        await newPost.save();
        revalidatePath("/blog");
        revalidatePath("/admin");
    } catch (error) {
        console.log(error);
        return { error: "Something went wrong!" };
    }
};

// server action
export const deletePost = async (formData) => {
    const { id } = Object.fromEntries(formData);

    try {
        connectToDb();

        await Post.findByIdAndDelete(id);
        console.log("deleted from db");
        revalidatePath("/blog");
        revalidatePath("/admin");
    } catch (err) {
        console.log(err);
        return { error: "Something went wrong!" };
    }
};

export const addUser = async (prevState, formData) => {
    const { username, email, password, img } = Object.fromEntries(formData);

    try {
        connectToDb();
        const newUser = new User({
            username,
            email,
            password,
            img,
        });

        await newUser.save();
        console.log("saved to db");
        revalidatePath("/admin");
    } catch (err) {
        console.log(err);
        return { error: "Something went wrong!" };
    }
};

export const deleteUser = async (formData) => {
    const { id } = Object.fromEntries(formData);

    try {
        connectToDb();

        await Post.deleteMany({ userId: id });
        await User.findByIdAndDelete(id);
        console.log("deleted from db");
        revalidatePath("/admin");
    } catch (err) {
        console.log(err);
        return { error: "Something went wrong!" };
    }
};


export const handleGithubLogin = async () => {
    "use server";
    await signIn("github");
};

export const login = async (prevState, formData) => {
    const { username, password } = Object.fromEntries(formData);
    console.log(username, password);
    try {
        await signIn("credentials", { username, password });
        revalidatePath("/admin");
    } catch (err) {
        console.log(err);

        if (err.message.includes("CredentialsSignin")) {
            return { error: "Invalid username or password" };
        }
        // return {error: "Something went wrong"}
        /* reason
        NEXT_REDIRECT ERROR, singIn 이 끝나면 nextAuth 는 user 를 next js redirect method 를 호출해서 home 으로 보냄
        이 메소드가 intentionally throws error
        */
        throw err;
    }
};

export const handleLogout = async () => {
    "use server";
    await signOut();
};

export const register = async (previousState, formData) => {
    const { username, email, password, img, passwordRepeat } =
        Object.fromEntries(formData);

    if (password !== passwordRepeat) {
        return { error: "Passwords do not match" };
    }

    try {
        connectToDb();

        const user = await User.findOne({ username });

        if (user) {
            return { error: "Username already exists" };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            img,
        });

        await newUser.save();
        console.log("saved to db");

        return { success: true };
    } catch (err) {
        console.log(err);
        return { error: "Something went wrong!" };
    }
};