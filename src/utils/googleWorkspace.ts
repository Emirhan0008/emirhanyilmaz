import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Reuse existing app if already initialized
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const WORKSPACE_GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.send'
];

const provider = new GoogleAuthProvider();
WORKSPACE_GMAIL_SCOPES.forEach(scope => provider.addScope(scope));
provider.setCustomParameters({
  prompt: 'select_account'
});

// Flag to indicate if we are in the middle of a sign-in flow
let isSigningIn = false;

// Cache the access token strictly in memory (NEVER in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;

export const initWorkspaceAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // If user is restored but token is missing from memory, require interactive sign-in for Gmail scopes
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignInForGmail = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google erişim jetonu (access token) alınamadı.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Workspace Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getWorkspaceAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogleWorkspace = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface SendGmailOptions {
  to: string;
  subject: string;
  body: string;
  fromName?: string;
}

/**
 * Sends an email using the official Gmail REST API on behalf of the authenticated user.
 * Base64url encodes RFC 2822 compliant message.
 */
export const sendEmailViaGmailApi = async ({
  to,
  subject,
  body,
  fromName
}: SendGmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const token = await getWorkspaceAccessToken();
  if (!token) {
    throw new Error('Gmail oturumu aktif değil. Lütfen önce Google hesabınızla giriş yapın.');
  }

  // Construct RFC 2822 email format
  const currentUser = auth.currentUser;
  const senderEmail = currentUser?.email || 'me';
  const senderHeader = fromName ? `"${fromName}" <${senderEmail}>` : senderEmail;

  // Encode subject to UTF-8 Base64 RFC 2047 format if needed
  const encodedSubject = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;

  const emailLines = [
    `From: ${senderHeader}`,
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    body
  ];

  const emailString = emailLines.join('\r\n');

  // Convert to web-safe base64
  const rawBase64 = btoa(unescape(encodeURIComponent(emailString)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: rawBase64 })
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const message = errorJson.error?.message || `Gmail API hatası (${response.status})`;
    throw new Error(message);
  }

  const result = await response.json();
  return { success: true, messageId: result.id };
};
