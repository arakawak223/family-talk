/**
 * ひと言しつもんアプリ
 * 家族のボイスメッセージアプリ
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { RootStackParamList } from './src/types/navigation';

// Screens
import HomeScreen from './src/screens/Home/HomeScreen';
import QuestionSelectScreen from './src/screens/QuestionSelect/QuestionSelectScreen';
import RecordMessageScreen from './src/screens/RecordMessage/RecordMessageScreen';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#3498db',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'ひと言しつもん',
              headerStyle: {
                backgroundColor: '#f8f9fa',
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTintColor: '#2c3e50',
            }}
          />
          <Stack.Screen
            name="QuestionSelect"
            component={QuestionSelectScreen}
            options={{
              title: '質問を選ぶ',
            }}
          />
          <Stack.Screen
            name="RecordMessage"
            component={RecordMessageScreen}
            options={{
              title: 'メッセージを録音',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
