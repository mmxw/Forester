import React, {useState} from 'react';
import {Text, Button, View} from 'react-native';
// using namespace import so we can mock
import * as selectContactLib from 'react-native-select-contact';
import type {ScreenProp, UIPlant} from '../../utils/types';
import {useUIPlants} from '../../utils/state';
import {FlatList} from 'react-native-gesture-handler';

export function HomeScreen({navigation}: ScreenProp<'Home'>) {
  const plants = useUIPlants();
  const [
    hasProblemGettingPermissions,
    setHasProblemGettingPermissions,
  ] = useState(false);

  async function pickContact() {
    const contact = await selectContactLib.selectContact();
    if (contact) {
      navigation.navigate('PlantChoice', {
        contact,
      });
      setHasProblemGettingPermissions(false);
    } else {
      setHasProblemGettingPermissions(true);
    }
  }

  const MaybeErrorMessage = hasProblemGettingPermissions ? (
    <Text accessible style={{color: 'red'}}>
      There was an issue accessing contacts.
    </Text>
  ) : null;

  return (
    <View>
      {MaybeErrorMessage}
      <Plants plants={plants} />
      <Button
        title="Add Plant"
        accessibilityLabel={'Add Plant'}
        onPress={pickContact}
      />
    </View>
  );
}

function Plants({plants}: {plants: UIPlant[]}) {
  return (
    <FlatList
      accessibilityHint="Plants List"
      data={plants}
      keyExtractor={({plantId}) => plantId}
      renderItem={({item: plant}) => (
        <View accessible accessibilityHint={`${plant.name} the plant`}>
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
