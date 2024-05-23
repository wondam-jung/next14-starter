"use client";
import Image from "next/image";
import { useState } from "react";
import { handleLogout } from "../../../lib/action";
import NavLink from "../navLink/navLink";
import styles from "./links.module.css";

const links = [
    {
        title: "Homepage",
        path: "/"
    },
    {
        title: "About",
        path: "/about"
    },
    {
        title: "Contact",
        path: "/contact"
    },
    {
        title: "Blog",
        path: "/blog"
    }
];

const Links = ({ session }) => {
    const [open, setOpen] = useState();

    const isAdmin = true;
    return (
        <div className={styles.container}>
            <div className={styles.links}>
                {links.map((link => (
                    <NavLink item={link} key={link.title} />
                )))}
                {session ? (
                    <>
                        {session.user?.isAdmin && <NavLink item={{ title: "Admin", path: "/admin" }} />}
                        <form action={handleLogout}>
                            <button className={styles.logout}>logout</button>
                        </form>
                    </>
                ) : (
                    <NavLink item={{ title: "Login", path: "/login" }} />
                )}
            </div>
            <Image className={styles.menuButton} src="/menu.png" alt="" width={30} height={30} />
            {
                open && <div className={styles.mobileLinks}>
                    {links.map((link) => (
                        <NavLink item={link} key={link.title} />
                    ))}
                </div>
            }
        </div>
    );
};

export default Links;