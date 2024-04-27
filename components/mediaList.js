import { View, Text, Button } from "react-native";
import { db } from "../utils/firebaseConfig";
import { collection, addDoc, serverTimestamp, query } from "firebase/firestore";
const MedialList = ({ user }) => {
  const fetchAllData = async (userId) => {
    const userRef = db.collection("users").doc(userId);
    const snapshot = await userRef.collection("posts").get();
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };
  const fetchData = async (userId) => {
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
    <View>
      <Text>Media List of {user.email}</Text>
      <Text>A list of media</Text>
      <Button title="Fetch All Data" onPress={() => fetchAllData(user.uid)} />
    </View>
  );
};

export default MedialList;
