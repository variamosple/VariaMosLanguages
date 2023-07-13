import { SignUpKeys } from "./SignUp.constants";

export function logoutUser() {
  sessionStorage.clear();
  window.location.href = "/";
  return true;
}

export function getUserProfile(): {
  email: string;
  familyName: string;
  givenName: string;
  googleId: string;
  imageUrl: string;
  name: string;
  userType: string;
} {
  return JSON.parse(sessionStorage.getItem(SignUpKeys.CurrentUserProfile));
}

export function getDataBaseUserProfile(): {
  user: { id: string; name: string },
  permissions: {id: number; name: string}[]
} {
  return JSON.parse(sessionStorage.getItem(SignUpKeys.DataBaseUserProfile));
}
