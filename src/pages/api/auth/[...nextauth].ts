import { query as q } from 'faunadb'

import NextAuth, { NextAuthOptions } from 'next-auth'
import GithubProvider from "next-auth/providers/github"

import { fauna } from '../../../services/fauna';

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            //   scope: 'read:user'
            // userinfo: "read:user"
        }),
    ],
    callbacks: {
        async session({ session }: any) {
            try {
                console.log("AKI")
                const user = await fauna.query(
                    q.Get(
                      q.Match(
                        q.Index('user_by_email'),
                        q.Casefold(session?.user?.email ?? '')
                      )
                    )
                  ) as any

                console.log("userActiveSubscription", user)

                session.activeSubscription = user?.data.status ?? null

                console.log("ESSE", session)

                return session
            } catch {
                return {
                    ...session,
                    activeSubscription: null,
                }
            }
        },
        async signIn({ user, account, profile }) {
            const { email } = user

            if (!email) return false;

            try {
                await fauna.query(
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match(
                                    q.Index('user_by_email'),
                                    q.Casefold(email)
                                )
                            )
                        ),
                        q.Create(
                            q.Collection('users'),
                            { data: { email } }
                        ),
                        q.Get(
                            q.Match(
                                q.Index('user_by_email'),
                                q.Casefold(email)
                            )
                        )
                    )
                )

                return true
            } catch {
                return false
            }
        },
    }
}


export default NextAuth(authOptions)