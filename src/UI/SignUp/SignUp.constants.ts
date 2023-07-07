export const CLIENT_ID =
  "364413657269-7h80i7vdc1mbooitbpa9n2s719io1ts2.apps.googleusercontent.com";

export enum SignUpMessages {
  Welcome = "Welcome",
  ContinueAsGuest = "Continue as a Guest",
  SignUpWithGoogle = "Sign up with Google",
  Loading = "Loading...",
  LoginError = "Something went wrong, try again later.",
}

export enum SignUpURLs {
  Dashboard = "/dashboard",
  SignIn = "/signin",
  HomePage = "/languages",
}

export enum SignUpUserTypes {
  Registered = "registered",
  Guest = "guest",
}

export enum SignUpKeys {
  CurrentUserProfile = "currentUserProfile",
  DataBaseUserProfile = "databaseUserProfile",
}
