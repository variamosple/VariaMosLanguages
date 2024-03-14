import { SignUpKeys, SignUpUserTypes } from "./SignUp.constants";

export function logoutUser() {
  localStorage.clear();
  window.location.href = "/";
  return true;
}

export function getUserProfile(): {
  email: string;
  familyName?: string;
  givenName?: string;
  googleId?: string;
  imageUrl?: string;
  name?: string;
  userType: string;
} {
  const currentProfile = localStorage.getItem(SignUpKeys.CurrentUserProfile)

  if (!currentProfile) {
    return {
      email: null,
      givenName: "Guest",
      userType: SignUpUserTypes.Guest,
    };
  }
  
  return JSON.parse(currentProfile);
}

export function getDataBaseUserProfile(): {
  user: { id: string; name: string },
  permissions: {id: number; name: string}[]
} {
  return JSON.parse(localStorage.getItem(SignUpKeys.DataBaseUserProfile));
}
