import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { AuthContext } from '../components/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const Account = () => {
  const [activityHistory, setActivityHistory] = useState([
    { id: 1, input: 'This is a sample input text.', output: 'This is the corresponding output.' },
    { id: 2, input: 'Another example input.', output: 'Another example output.' },
  ]);

  const userData = {
    name: 'Hiếu Vũ',
    email: 'hieu.vu@example.com',
    photo: 'https://scontent.fhan5-9.fna.fbcdn.net/v/t39.30808-1/431246820_1453386681926182_5806316568775742809_n.jpg?stp=dst-jpg_p200x200&_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=1gePTyOGMEgQ7kNvgGpiC_3&_nc_ht=scontent.fhan5-9.fna&oh=00_AYA1Va_KpVMV0K-9Lk7rKwzQK4_j0vLJbpPt8hVtsexzbw&oe=665FE1CA',
  };

  const { logout } = useContext(AuthContext);

  // Hàm để thêm một mục mới vào lịch sử hoạt động
  const addToActivityHistory = (input, output) => {
    const newActivity = {
      id: Math.random().toString(), // Tạo một id ngẫu nhiên
      input: input,
      output: output,
    };
    setActivityHistory(prevActivity => [newActivity, ...prevActivity]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image source={{ uri: userData.photo }} style={styles.photo} />
        <View>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.dashboardContainer}>
        <Text style={styles.dashboardTitle}>Activity Dashboard</Text>
        <FlatList
          data={activityHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.activityItem}>
              <Text style={styles.input}>Input: {item.input}</Text>
              <Text style={styles.output}>Output: {item.output}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  dashboardContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  activityItem: {
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  output: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginLeft: 89,
    marginBottom: 18
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Account;
