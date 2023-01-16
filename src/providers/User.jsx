import { createContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/configs";

export const UserContext = createContext();

function User({ children }) {
  const [user, setUser] = useState();
  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (currentUser.emailVerified) {
          const { displayName, email, uid, photoURL, emailVerified } =
            currentUser;
          setUser({
            username: displayName,
            email: email,
            id: uid,
            photo: photoURL,
            emailVerified: emailVerified,
          });
        } else {
          setUser({});
        }
      }
    });
    return () => {
      unsubcribe();
    };
  }, [user]);
  const signUpWithEmailPassword = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUser({
          username: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          photo: user.photoURL,
        });
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`${errorCode}: ${errorMessage}`);
      });
  };
  // Sign in with google account
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user inf
        const user = result.user;
        setUser({
          username: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          photo: user.photoURL,
        });
        console.log(token, user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`${errorCode}: ${errorMessage}`);
        // The email of the user's account used.
        const email = error.customData.email;
        console.log(email);
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(credential);
        // ...
      });
  };
  const value = useMemo(
    () => ({ user, setUser, signUpWithEmailPassword, signInWithGoogle }),
    [user]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default User;
