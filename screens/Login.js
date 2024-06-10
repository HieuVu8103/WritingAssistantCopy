import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { initializeApp } from "@firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  initializeAuth,
  getReactNativePersistence,
} from "@firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSh-kV1ia7gJcMMHHY3URrzHnIXz1AtA8",
  authDomain: "autho-d6261.firebaseapp.com",
  projectId: "autho-d6261",
  storageBucket: "autho-d6261.appspot.com",
  messagingSenderId: "500884480715",
  appId: "1:500884480715:web:a9f3641479bfeb03e8f14e",
  measurementId: "G-WCNBH5EEP8",
};
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Track whether it's login or register
  const [realName, setRealName] = useState("");

  const db = getFirestore();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User login!");
        navigation.navigate("Home");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in successfully!");
      } else {
        if (password !== confirmPassword) {
          console.error("Passwords do not match!");
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        const docRef = await addDoc(collection(db, "user"), {
          id: auth.currentUser.uid,
          email,
          name: realName,
        });
        console.log("User created successfully!");
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRealName("");
      }
    } catch (error) {
      console.error("Authentication error:", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Real Name"
              value={realName}
              onChangeText={setRealName}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {!isLogin && (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={handleAuthentication}
          >
            <Text style={styles.buttonText}>
              {isLogin ? "Login" : "Register and Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.toggleText}>
              {isLogin
                ? "Need an account? Register"
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  button: {
    height: 48,
    backgroundColor: "#2CB673",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  toggleText: {
    marginTop: 16,
    color: "#2CB673",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default LoginScreen;
