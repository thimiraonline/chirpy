import { Provider } from 'next-auth/providers';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import facebookProvider from 'next-auth/providers/facebook';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import twitterProvider from 'next-auth/providers/twitter';

import { SESSION_MAX_AGE } from '$/lib/constants';

import { isENVProd } from '../../utilities/env';
import { sendVerificationEmail } from '../email/send-emails';
import { createUser } from './auth-adapter';
import { generateUsername } from './utilities';

const REQUEST_TIMEOUT = isENVProd ? 10_000 : 60_000;

export const authProviders: Provider[] = [
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    httpOptions: {
      timeout: REQUEST_TIMEOUT,
    },
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    httpOptions: {
      timeout: REQUEST_TIMEOUT,
    },
  }),
  twitterProvider({
    clientId: process.env.TWITTER_CONSUMER_KEY,
    clientSecret: process.env.TWITTER_CONSUMER_SECRET,
    httpOptions: {
      timeout: REQUEST_TIMEOUT,
    },
  }),
  facebookProvider({
    clientId: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    httpOptions: {
      timeout: REQUEST_TIMEOUT,
    },
  }),

  CredentialsProvider({
    name: 'Anonymous',
    credentials: {
      name: {
        label: 'Name',
        type: 'text',
        placeholder: 'Name',
      },
    },
    async authorize(credentials /*req*/) {
      if (
        credentials?.name ===
        process.env.TEST_USER_ID?.replace(/-/g, '').slice(0, 23)
      ) {
        // Sync with `services/hasura/seeds/default/1639909399233_user.sql`
        return {
          id: process.env.TEST_USER_ID,
          name: 'cypresstest',
          email: 'cypress.test@localhost',
          image: 'https://www.cypress.io/icons/icon-72x72.png',
        };
      }
      if (credentials?.name) {
        const name = credentials.name.trim();
        // Always create a new user with the provided name
        const user = await createUser({
          username: generateUsername(name),
          name,
        });

        return user;
      }
      return null;
    },
  }),
  EmailProvider({
    server: process.env.EMAIL_SERVER,
    from: process.env.EMAIL_FROM,
    maxAge: SESSION_MAX_AGE,
    async sendVerificationRequest({
      identifier: email,
      url /*provider: { server, from }*/,
    }) {
      await sendVerificationEmail({
        to: {
          email,
          name: email,
        },
        url,
      });
    },
  }),
];
