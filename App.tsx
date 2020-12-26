/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, View, Text} from 'react-native';
import {Button} from 'react-native-paper';

const style = {
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'center',
  marginTop: 250
} as const;

function App(): JSX.Element {

  const onPress = () => {
    
  }

  return (
    <SafeAreaView
      style={style}>
      <View>
        <Text>FORESTER</Text>
        <Button onPress={() => {}}>Go to landing page</Button>
      </View>
    </SafeAreaView>
  );
}

export default App;
