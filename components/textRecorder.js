import { db } from "../utils/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { useState } from "react";
import { Button, TextInput, Text } from "react-native";
const TextRecorder = ({ user }) => {
  const [textFromUser, setTextFromUser] = useState(null);
  const [textFromFirestore, setTextFromFirestore] = useState(null);
  const [textLoading, setTextLoading] = useState(false);
  const addDataToFirestore = async () => {
    setTextLoading(true);
    try {
      const docRef = await addDoc(collection(db, "text"), {
        textContent: textFromUser,
        userId: user.uid,
        timestamp: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
      setTextLoading(false);
    } catch (e) {
      setTextLoading(false);
      console.error("Error adding document: ", e);
    }
  };

  //get text from firestore
  const fetchTextData = async (userId) => {
    setTextLoading(true);
    try {
      // Create a query to find documents where the "userId" field matches the specified userId
      const q = query(collection(db, "text"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If there's at least one matching document, use the first one found
        const docSnap = querySnapshot.docs[0];
        setTextFromFirestore(docSnap.data().textContent);
        setTextLoading(false);
      } else {
        setTextLoading(false);
        setTextFromFirestore("No text data found for this user.");
      }
    } catch (error) {
      setTextLoading(false);
      console.error("Error fetching text data:", error);
    }
  };
  return (
    <>
      <TextInput
        placeholder="Enter something..."
        value={textFromUser}
        onChangeText={setTextFromUser}
      />

      <Text>Get text from firebase</Text>
      <Text>{textFromFirestore}</Text>
      {textFromUser && (
        <>
          {textLoading ? (
            <Text>Loading...</Text>
          ) : (
            <>
              <Button
                title="add data to firestore"
                onPress={addDataToFirestore}
              />
              <Button
                title="fetch text from firestore"
                onPress={() => fetchTextData(user.uid)}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default TextRecorder;
