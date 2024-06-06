import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from 'react';

import Home from './screens/Home';
import Account from './screens/Account';
import LoginScreen from './screens/Login';
import GrammarCheck from './screens/GrammarCheck';
import TextCompletion from './screens/TextCompletion';
import Paraphrasing from './screens/Paraphrasing';
import PlagiarismChecker from './screens/PlagiarismChecker';
import { AuthProvider, AuthContext } from './components/AuthContext';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

const headerOptions = {
  headerStyle: {
    backgroundColor: '#2CB673',
  },
};

function BottomTab() {

  const { isLoggedIn } = useContext(AuthContext);

  return (
    <BottomTabs.Navigator screenOptions={{
      headerStyle: {backgroundColor: '#2CB673'},
      headerTintColor: 'white',
      tabBarStyle: {backgroundColor: '#2CB673'},
      tabBarActiveTintColor: 'white'
    }}>
      <BottomTabs.Screen 
        name="Writing Assistant" 
        component={Home} 
        options={{
          title: 'Writing Assistant',
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name='home' size={size} color={color} />
        }}
      />
      <BottomTabs.Screen
        name="Account"
        component={isLoggedIn ? Account : LoginScreen}
        options={{
          title: 'Account',
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

export default function App() {
  return (
    <>
    <AuthProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Home" 
            component={BottomTab} options={{
            headerShown: false
          }} />
          <Stack.Screen name="GrammarCheck" component={GrammarCheck} options={headerOptions}/>
          <Stack.Screen name="TextCompletion" component={TextCompletion} options={headerOptions}/>
          <Stack.Screen name="Paraphrasing" component={Paraphrasing} options={headerOptions}/>
          <Stack.Screen name="PlagiarismChecker" component={PlagiarismChecker} options={headerOptions}/>
        </Stack.Navigator>
      </NavigationContainer>
      </AuthProvider>
    </>
  );
};