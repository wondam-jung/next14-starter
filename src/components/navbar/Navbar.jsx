import Link from "next/link";
import Links from './links/Links';
import { auth } from "../../lib/auth";
import styles from './navbar.module.css';
const Navbar = async () => {
    const session = await auth();
    console.log("session", session);
    return (
        <div className={styles.container}>
            <Link href="/" className={styles.logo}>Logo</Link>
            <div>
                <Links session={session} />
            </div>
        </div>
    );
};

export default Navbar;