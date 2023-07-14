/* eslint-disable @next/next/no-img-element */
import { SignInButton } from '../SignInButton';
import { ActiveLink } from '../ActiveLink';

import styles from './styles.module.css';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <div>Home</div>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            <div>Posts</div>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}