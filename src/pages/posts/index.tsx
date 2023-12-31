import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client'
import Link from 'next/link';

import { getPrismicClient } from '../../services/prismic';
import { useSession } from "next-auth/react"

import styles from './styles.module.css';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          { posts.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </Link>
          )) }
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['posts.title', 'posts.content'],
    pageSize: 100,
  })

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: post.data.title,
      excerpt: post.data.content.find((content: any) => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date ?? '').toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    };
  });

  

  return {
    props: {
      posts
    }
  }
}