import React from 'react';
import {Button, View} from 'react-native';
import type {ScreenProp} from './types';
import {selectContact} from 'react-native-select-contact';

export function HomeScreen({navigation}: ScreenProp<'Home'>) {
  async function pickContact() {
    console.log('picking');
    const contact = await selectContact();
    if (contact) {
      navigation.navigate('PlantChoice', {
        contact,
      });
    } else {
      // probably a permissions issue
      // todo: error message or something
    }
  }
  return (
    <View>
      <Button
        onPress={pickContact}
        title="pick"/>
    </View>
  );
}
