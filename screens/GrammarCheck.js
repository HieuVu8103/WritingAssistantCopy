import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Keyboard,
  Clipboard,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Together from "together-ai";
import highlightError from "../components/FindErrorWord";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const together = new Together({
  apiKey: "641a769976dea73fe13ea16626c136498408407c837df7b32ac4ca8b3bbd9014",
});

const openAIService = async (inputText) => {
  try {
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Check input text for grammar and spelling errors from user input. Then write corrected sentence in the first line. Do not write any introductory or explanatory phrases.",
        },
        { role: "user", content: inputText },
      ],
      model: "meta-llama/Llama-3-8b-chat-hf",
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in openAIService:", error);
    return "Error occurred while processing your request.";
  }
};

const GrammarCheck = () => {
  const [inputText, setInputText] = useState("");
  const [highlightedText, setHighlightedText] = useState([]);
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uid, setUid] = useState(null);
  const db = getFirestore();
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUid(user.uid);
    }
  });
  const handleConfirm = async () => {
    setIsLoading(true);
    Keyboard.dismiss();
    try {
      const result = await openAIService(inputText);
      setOutputText(result);
      const errorHighlights = highlightError({
        input: inputText,
        output: result,
      });
      updateHighlightedText(errorHighlights);
      const docRef = await addDoc(collection(db, "database"), {
        id: uid,
        input: inputText,
        output: result,
        time: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error in handleConfirm:", error);
      setOutputText("Error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateHighlightedText = (errorHighlights) => {
    let updatedText = errorHighlights.map((error, index) => {
      if (error.isError) {
        return (
          <Text key={index} style={styles.incorrectText}>
            {error.phrase}{" "}
          </Text>
        );
      } else {
        return <Text key={index}>{error.phrase} </Text>;
      }
    });
    setHighlightedText(updatedText);
  };

  const wordCount = (text) => {
    if (typeof text === "object") {
      text = text.map((component) => component.props.children).join(" ");
    }
    if (text.trim() === "") {
      return 0;
    }
    const words = text.trim().split(/\s+/);
    return words.length;
  };

  const copyToClipboard = () => {
    Clipboard.setString(outputText);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.content} behavior="padding">
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your text"
            onChangeText={setInputText}
            value={inputText}
            multiline
          />
          <View style={styles.errorContainer}>
            <ScrollView>
              <Text>{highlightedText}</Text>
            </ScrollView>
          </View>
        </View>
        <Text style={styles.wordCount}>Word count: {wordCount(inputText)}</Text>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
        <Text style={styles.outputLabel}>Suggestion</Text>
        <View style={styles.outputContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#2CB673" />
          ) : (
            <ScrollView>
              <Text>{outputText}</Text>
            </ScrollView>
          )}
        </View>
        <Text style={styles.wordCount}>
          Word count: {wordCount(outputText)}
        </Text>
        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
          <Text style={styles.copyButtonText}>Copy</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 70,
  },
  content: {
    flex: 1,
    width: "80%",
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    marginVertical: 10,
  },
  input: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: -60,
  },
  errorContainer: {
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  incorrectText: {
    color: "red",
  },
  confirmButton: {
    backgroundColor: "#2CB673",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  outputContainer: {
    width: "100%",
    height: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  outputLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  normalText: {
    color: "#000",
  },
  wordCount: {
    padding: 10,
  },
  copyButton: {
    backgroundColor: "#2CB673",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  copyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default GrammarCheck;
