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
  GoogleAuthProvider,
  firebase,
} from "@firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};
const app = initializeApp(firebaseConfig);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Track whether it's login or register

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User login!");
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
        console.log("User created successfully!");
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Authentication error:", error.message);
    }
  };

  const handleGoogle = () => {
    
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
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={handleAuthentication}
          >
            <Text style={styles.buttonText}>
              {isLogin ? "Login" : "Register"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: "#4285F4",
                marginTop: 10,
              },
            ]}
            onPress={handleGoogle}
          >
            <Text style={styles.buttonText}>Login as Google Account</Text>
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
