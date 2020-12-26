import React from 'react';
import {Text, Button, View} from 'react-native';
import type {ScreenProp} from './types';
import {selectContact} from 'react-native-select-contact';
import { usePlants } from './state';

export function HomeScreen({navigation}: ScreenProp<'Home'>) {
  const plants = usePlants();

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
      <Text>{JSON.stringify(plants)}</Text>
      <Button
        onPress={pickContact}
        title="pick"/>
    </View>
  );
}
