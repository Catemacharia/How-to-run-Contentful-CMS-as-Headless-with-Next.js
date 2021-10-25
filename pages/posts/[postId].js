import {getPostAndMorePosts,getAllPostsForHome} from "../../lib/api";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Head from "next/head";
import Link from "next/link";
import {useRouter} from "next/router";
import styles from "../../styles/Home.module.css";


export default function Post({post,relatedPosts}){

    const router = useRouter();

    return (
      <div className={styles.container}>

        <Head>
        <title>Blog app</title>
        <meta name="description" content="Simple blog app with Contentful CMS" />
        <link rel="icon" href="/favicon.ico" />
        </Head>

        

      <main className={styles.main}>

        <div className={styles.homeLink}>
            <Link href="/">
                <a>Home</a>
            </Link>
        </div>

        {
            router.isFallback ? (
                <div styles={styles.title}>
                    Loading...
                </div>
            ) : (
            <>
            <div className={styles.content}>
            
            <div styles={styles.title}>
                {post.title}
            </div>
    
            {/** date */}
    
            <p className={styles.meta}>
                {new Date(post.date).toDateString()}
            </p>
    
            {/** cover-image */}
    
            <div className={styles.coverImage}>
                <img src={post.coverImage.url} alt={post.title} />
            </div>
    
            {/** content */}
    
            <div className={styles.contentBody}>
                {documentToReactComponents(post.description.json)}
            </div>
    
            </div>
    
            <div className={styles.grid}>
              {
                relatedPosts.length > 0 ? (
                    <>
                        <div className={styles.title}>
                            Related posts
                        </div>
                        {
                        relatedPosts.map((post) => (
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
                        }
                    </>
                ) : null
              }
            </div>
                </>
            )   
        }

        
      </main>

      <footer className={styles.footer}>
        <p>Simple blog app</p>
      </footer>
    </div>
    )
}

export async function getStaticProps({params:{postId}}){
    let {post,relatedPosts} = await getPostAndMorePosts(false,postId);
    return {
        props:{
            post,
            relatedPosts
        }
    }
}

export async function getStaticPaths(){

    const posts = await getAllPostsForHome(false);

    let paths = posts.map((post) => ({
        params:{
            postId:post.sys.id
        }
    })  
    );

    return {
        paths,
        fallback:true
    }
}