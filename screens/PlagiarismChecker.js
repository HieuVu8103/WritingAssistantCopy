import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, StyleSheet, Keyboard, Modal, ScrollView, Pressable, Linking, Alert, ActivityIndicator } from 'react-native';
import Together from 'together-ai';
import { WebView } from 'react-native-webview';

const together = new Together({
  apiKey: '641a769976dea73fe13ea16626c136498408407c837df7b32ac4ca8b3bbd9014',
});

const openAIService = async (inputText) => {
  try {
    const response = await together.chat.completions.create({
      messages: [
        { role: 'system', content: 'Check the input text for plagiarism, analyze the input text and compare it with other documents on the internet. Then you simply provide a percentage of how much of the text matches other documents on the first line, as well as links to those documents on the new line. Do not need any introductory or explanatory phrases.' },
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

const PlagiarismChecker = () => {
  const [inputText, setInputText] = useState('');
  const [matchingPercentage, setMatchingPercentage] = useState('');
  const [matchingLinks, setMatchingLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLink, setSelectedLink] = useState('');

  const handleConfirm = async () => {
    setIsLoading(true);
    Keyboard.dismiss();
    try {
      const result = await openAIService(inputText);
      const [percentageString, ...links] = result.split('\n');
      setMatchingPercentage(percentageString);
      setMatchingLinks(links.filter(link => link.trim() !== ''));
    } catch (error) {
      console.error('Error in handleConfirm:', error);
      setMatchingPercentage('Error occurred while processing your request.');
      setMatchingLinks([]);
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

  const openURL =  async (url) => {
    const isSupported = await Linking.canOpenURL(url);
    if(isSupported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Can't open this url: ${url}`);
    }
  }

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
        {isLoading ? (
            <ActivityIndicator size="large" color="#2CB673" />
        ) : (
          <ScrollView contentContainerStyle={styles.resultsContainer}>
            <View>
              <Text style={styles.matchingPercentage}>Matching percent: {matchingPercentage}</Text>
            </View>
            {matchingLinks.map((link, index) => (
              <Pressable key={index} onPress={() => openURL(link)} style={styles.linkContainer}>
                <Text style={styles.matchingLink} numberOfLines={1} ellipsizeMode="middle">{link}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
      <Modal visible={modalVisible} animationType="slide">
        <WebView source={{ uri: selectedLink }} />
        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 70,
  },
  content: {
    flex: 1,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 250,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  confirmButton: {
    backgroundColor: '#2CB673',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: -10,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsContainer: {
    width: '100%',
  },
  matchingPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: "center"
  },
  linkContainer: {
    backgroundColor: '#2CB673',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    minWidth: 331
  },
  matchingLink: {
    color: 'blue',
  },
  closeButton: {
    backgroundColor: '#2CB673',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  wordCount: {
    padding: 10,
  },
});

export default PlagiarismChecker;
