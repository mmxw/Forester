import React from 'react';
import {Text, Button, View} from 'react-native';
import type {ScreenProp, UIPlant} from './types';
import {selectContact} from 'react-native-select-contact';
import {useUIPlants} from './state';
import {FlatList} from 'react-native-gesture-handler';

export function HomeScreen({navigation}: ScreenProp<'Home'>) {
  const plants = useUIPlants();

  async function pickContact() {
    const contact = await selectContact();
    if (contact) {
      navigation.navigate('PlantChoice', {
        contact,
      });
    } else {
      // probably a permissions issue–should show something to the user
      // and then retry
      // https://github.com/mmxw/Forester/issues/9
      throw Error('error getting permissions');
    }
  }
  return (
    <View>
      <Plants plants={plants} />
      <Button onPress={pickContact} title="pick" />
    </View>
  );
}

function Plants({plants}: {plants: UIPlant[]}) {
  return (
    <FlatList
      data={plants}
      renderItem={({item: plant}) => (
        <View>
          <Text>
            {plant.appearance.emoji} {plant.name} ({plant.state})
          </Text>
          <Text>last watered: {plant.lastWatered.toISOString()} </Text>
          <Text>next watering: {plant.nextWatering.toISOString()} </Text>
        </View>
      )}
    />
  );
}
