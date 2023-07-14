/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getServerSession } from "next-auth/next"
import { authOptions } from '../api/auth/[...nextauth]'
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/router';

import { getPrismicClient } from "../../services/prismic";

import styles from './post.module.css';
import { useMemo } from "react";

interface Post {
  first_publication_date: string;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

const WORDS_READ_BY_HUMAN_IN_MINUTES = 200;

export default function Post({ post }: PostProps) {
  const router = useRouter();

  const dateFormated = format(
    new Date(post.first_publication_date),
    'dd MMM	yyyy',
    { locale: ptBR }
  );

  const readingTimeText = useMemo(() => {
    const totalWordsCount = post.data.content
      .map(e => RichText.asText(e.body))
      .reduce((acc, cur) => {
        const wordsCount = cur.split(/\s+|\n/).length;
        return acc + wordsCount;
      }, 0);

    const readingTime = Math.ceil(
      totalWordsCount / WORDS_READ_BY_HUMAN_IN_MINUTES
    );
    return `${readingTime} min`;
  }, [post]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {router.isFallback ? (
          <div>Carregando...</div>
        ) : (
          <>
            <section className={styles.banner}>
              <img
                src={post.data.banner.url}
                alt="Imagem representativa do tema"
              />
            </section>
            <main className={styles.main}>
              <h1 className={styles.title}>{post.data.title}</h1>
              <div className={styles.tags}>
                <span>
                  <FiCalendar size={20} />
                  {dateFormated}
                </span>
                <span>
                  <FiUser size={20} />
                  {post.data.author}
                </span>
                <span>
                  <FiClock size={20} />
                  {readingTimeText}
                </span>
              </div>

              <section className={styles.subject}>
                {post.data.content.map(subject => (
                  <div className={styles.subjectBlock} key={subject.heading}>
                    <h5>{subject.heading}</h5>
                    {subject.body.map(phrase => (
                      <p key={phrase.text}>{phrase.text}</p>
                    ))}
                  </div>
                ))}
              </section>
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions) as any
  const { slug } = context.params as any;
  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const prismic = getPrismicClient()

  const response = await prismic.getByUID('posts', String(slug), {})

  const content = response.data.content.map((paragraph: any) => ({
    heading: paragraph.heading,
    body: paragraph.body,
  }));

  const postsResponse = {
    uid: response.uid ?? '',
    first_publication_date: response.first_publication_date ?? '',
    data: {
      title: response.data.title ?? '',
      subtitle: response.data.subtitle ?? '',
      banner: {
        url: response.data.banner.url ?? '',
      },
      author: response.data.author ?? '',
      content,
    },
  };

  return {
    props: {
      post: postsResponse,
    }
  }
}