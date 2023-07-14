import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";
import styles from './styles.module.css';

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps) {
  const { asPath } = useRouter()
  const isActive = asPath === rest.href
  const className = isActive ? styles.active: ''

  return (
    <Link {...rest}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  );
}