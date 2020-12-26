import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { HomeScreen } from './home-screen';
import { PlantChoiceScreen } from './plant-choice-screen';


const Stack = createStackNavigator();

export function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PlantChoice" component={PlantChoiceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
