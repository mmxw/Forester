import React from 'react';
import {SafeAreaView, View, Text} from 'react-native';
import {TouchableHighlight} from 'react-native';

const style = {
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'center',
  marginTop: 250
} as const;

function App(): JSX.Element {
  return (
    <SafeAreaView
      style={style}>
      <View>
        <Text>FORESTER</Text>
        <TouchableHighlight>
          <Text>Go to landing page</Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}

export default App;
