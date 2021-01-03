import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from './screens/Home/HomeScreen';
import {PlantChoiceScreen} from './screens/PlantChoice/PlantChoiceScreen';
import {RecoilRoot} from 'recoil';
import {PlantScreen} from './screens/Plant/PlantScreen';

const Stack = createStackNavigator();

export function App() {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PlantChoice" component={PlantChoiceScreen} />
          <Stack.Screen name="Plant" component={PlantScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
}
