import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, StyleSheet, Keyboard, Clipboard, ScrollView, ActivityIndicator } from 'react-native';
import Together from 'together-ai';

const together = new Together({
  apiKey: '641a769976dea73fe13ea16626c136498408407c837df7b32ac4ca8b3bbd9014',
});

const openAIService = async (inputText) => {
  try {
    const response = await together.chat.completions.create({
      messages: [
        { role: 'system', content: 'Pick up where the user left off and complete the input text with generated sentences.Remember to write the user text as well.(do not include any introductory or explanatory phrases.)' },
        { role: 'user', content: inputText },
      ],
      model: 'meta-llama/Llama-3-8b-chat-hf',
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error in openAIService:', error);
    return 'Error occurred while processing your request.';
  }
};

const TextCompletion = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true); 
    Keyboard.dismiss();
    try {
      const response = await openAIService(inputText);
      let modifiedOutputText = response;
      if (modifiedOutputText.startsWith("Here is the completed text:")) {
        modifiedOutputText = modifiedOutputText.replace("Here is the completed text:", "").trim();
      }
      setOutputText(modifiedOutputText);
    } catch (error) {
      console.error('Error in handleConfirm:', error);
      setOutputText('Error occurred while processing your request.');
    } finally {
      setIsLoading(false); 
    }
  };

  const wordCount = (text) => {
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
        <TextInput
          style={styles.input}
          placeholder="Enter your text"
          onChangeText={setInputText}
          value={inputText}
          multiline
        />
        <Text style={styles.wordCount}>Word count: {wordCount(inputText)}</Text>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
        <Text style={styles.outputLabel}>Output Text</Text>
        <View style={styles.outputContainer}>
          {isLoading ? ( 
            <ActivityIndicator size="large" color="#2CB673" />
          ) : (
            <ScrollView>
              <Text style={styles.outputText}>{outputText}</Text>
            </ScrollView>
          )}
        </View>
        <Text style={styles.wordCount}>Word count: {wordCount(outputText)}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 70
  },
  content: {
    flex: 1,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10
  },
  confirmButton: {
    backgroundColor: '#2CB673',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  outputContainer: {
    width: '100%',
    height: 250,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10
  },
  outputLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  wordCount: {
    padding: 10,
  },
  copyButton: {
    backgroundColor: '#2CB673',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TextCompletion;
