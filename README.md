## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```


run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Rendering
1. SSR
- client(request) -> server(response: html, javascript for interaction)
- user is waiting for interactivity
- pros: the initial page load is faster. better for old devices and slow internet connections. better SEO
- cons: Less interaction. more server loads, slower subsequent page loads, state management complexity
2. CSR
- client(request) -> server(response: index.html, whole javascript that build web application aka. javascript bundle file )
- user is waiting for as soon as the page is ready user can interact with it.
- user browser has to render this page not the server
- user see white page until the page is rendered. (initial load is slower)
- props: initial load is slower but once we create single web application it's much faster to navigate between pages after initial load
- less server load and CSR is best for the user interactivity
- cons: may affect SEO, slower initial load, dependency on client resources(if you have a huge app all devices might have some problems)

3. next.js
- next.js use SSR. + user interaction(e.g. hooks -> "use client")

## How to avoid Hydration Issues
1. "use client"
- use "useEffect" and make sure it is client component
- wrap variable with attr suppressHydrationWarning 
2. Not using "use client"
- use dynamic import with options ssr to false

```
"use client";
// even if use "use client", the initial render will be on the server side.
// Next js check your component on the server side first and it expects that you have
// the same component on the client side.


import Image from "next/image";
import styles from "./contact.module.css";
import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import HydrationTest from "@/components/hydrationTest";

// const HydrationTestNoSSR = dynamic(()=>import("@/components/hydrationTest"), {ssr: false})

export const metadata = {
    title: "Contact Page",
    description: "Contact description",
};

const ContactPage = () => {
    const [isClient, setIsClient] = useState(false);
    const a = Math.random();
    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.imgContainer}>
                <Image src="/contact.png" alt="" fill className={styles.img} />
            </div>
            <div className={styles.formContainer}>
                {isClient && a}
                {/* <HydrationTestNoSSR/> */}
                {/* <div suppressHydrationWarning>{a}</div> */}
                <form action="" className={styles.form}>
                    <input type="text" placeholder="Name and Surname" />
                    <input type="text" placeholder="Email Address" />
                    <input type="text" placeholder="Phone Number (Optional)" />
                    <textarea
                        name=""
                        id=""
                        cols="30"
                        rows="10"
                        placeholder="Message"
                    ></textarea>
                    <button>Send</button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;

```

##  if i wrap my server side component with my client side component? is my server side component is going to be a client side component or server side component?
- it's still going to be server component
- client side and server side components don't affect each other

## Client Side Navigation
```
"use client"

const router = useRouter();
const pathname = usePathname();
const searchParam = useSearchParam();

const q = searchParam.get("q")

const handleClick = () => {
    router.forward()
    router.replace("/") // no history stack
    router.push("/home") // history stack
}

```

## Server Side Navigation (default)

```
const BlogPage = ({params, searchParams}) => {
    // component props
}
```
