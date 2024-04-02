import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  FacebookAuthProvider,
  getAuth,
} from "firebase/auth";

import { auth } from "@/src/lib/firebase/firebase";

export function onAuthStateChanged(cb) {
  return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
          await signInWithPopup(auth, provider);
  } catch (error) {
          console.error("Error signing in with Google", error);
  }
}

export async function signInWithFacebook() {
  const provider = new FacebookAuthProvider();
  const auths = getAuth();
	provider.addScope('email, pages_show_list,pages_read_engagement,pages_manage_posts');
  try {
    await signInWithPopup(auths, provider)
  } catch (error) {
    console.error("Error signing in with facebook", error);
  }
}

export async function signOut() {
  try {
          return auth.signOut();
  } catch (error) {
          console.error("Error signing out with Google", error);
  }
}
