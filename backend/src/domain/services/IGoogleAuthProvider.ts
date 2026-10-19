// Domain Service Interface: IGoogleAuthProvider

export interface GoogleAuthPayload {
  googleId: string;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface IGoogleAuthProvider {
  verifyIdToken(idToken: string): Promise<GoogleAuthPayload>;
}
