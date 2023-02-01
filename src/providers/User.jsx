import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/configs";
import { addDocument, getSimpleDocument, updateField } from "../firebase/util";

export const UserContext = createContext();

function User({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const { displayName, email, uid, photoURL, emailVerified } =
          currentUser;
        getSimpleDocument("Users", uid)
          .then((res) => {
            setUser({
              username: displayName,
              email: email,
              id: uid,
              photo: photoURL,
              emailVerified: emailVerified,
              coin: res.coin,
              nameBet: res.nameBet,
              roomIdJoin: res.roomIdJoin,
              online: res.online,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubcribe();
    };
  }, []);
  const signUpWithEmailPassword = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        const data = {
          username: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          photo: user.photoURL,
          id: user.uid,
          coin: 1000,
          nameBet: "",
          roomIdJoin: "",
          online: true,
        };
        setUser(data);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`${errorCode}: ${errorMessage}`);
      });
  };
  // Sign in with google account
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const data = {
          username: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          photo: user.photoURL,
          id: user.uid,
          coin: 1000,
          nameBet: "",
          roomIdJoin: "",
          online: true,
        };
        setUser(data);
        addDocument("Users", user.uid, data);
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
  const logout = useCallback(() => {
    signOut(auth)
      .then(() => {
        setUser(null);
        updateField("Users", user.id, "online", false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      signUpWithEmailPassword,
      signInWithGoogle,
      logout,
    }),
    [user, logout]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default User;
