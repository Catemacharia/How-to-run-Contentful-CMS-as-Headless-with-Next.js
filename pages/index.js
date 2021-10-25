import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import styles from '../styles/Home.module.css'
import {getAllPostsForHome} from "../lib/api"

export default function Home({allPosts}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Blog app</title>
        <meta name="description" content="Simple blog app with Contentful CMS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <div className={styles.grid}>
          {
            allPosts.length > 0 ? (
              allPosts.map((post) => (
                <div className={styles.card} key={post.sys.id}>
                  <div className={styles.imageHolder}>
                    <img src={post.coverImage.url} alt={post.title} />
                  </div>
                  <div className={styles.details}>
                    <Link href={`posts/${post.sys.id}`}>
                      <a>
                      {post.title} &rarr;
                      </a>
                    </Link>
                    <p>{post.excerpt}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.card}>
            <p>No posts added!</p>
          </div>
            )
          }
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Simple blog app</p>
      </footer>
    </div>
  )
}

export async function getStaticProps({preview = false}){
  let allPosts = (await getAllPostsForHome(preview))  ?? [];

  return {
      props: { preview, allPosts },revalidate:10
    
  }
  
}