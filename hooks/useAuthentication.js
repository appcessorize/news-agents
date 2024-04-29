import { auth } from "../utils/firebaseConfig";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

const useAuthentication = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (currentUser) {
          console.log("User is signed in:", currentUser.uid);
          setUser(currentUser);
        } else {
          console.log("No user is signed in.");
          setUser(null);
        }
      },
      (error) => {
        console.error("Authentication error:", error);
      }
    );

    return () => unsubscribe(); // Unsubscribe on unmount
  }, []);

  return { user };
};

export default useAuthentication;
