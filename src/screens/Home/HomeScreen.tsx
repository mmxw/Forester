import React, {useState} from 'react';
import {Text, Button, View} from 'react-native';
// using namespace import so we can mock
import * as selectContactLib from 'react-native-select-contact';
import type {ScreenProp, UIPlant} from '../../utils/types';
import {useUIPlants} from '../../utils/state';
import {FlatList} from 'react-native-gesture-handler';
import {formatDay} from '../../utils/date';

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
  // Harmless side effect we don't need to live-update the days
  // and we can mock Date.now in tests
  const now = new Date(Date.now());
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
          <Text>last watered: {formatDay(now, plant.lastWatered)} </Text>
          <Text>next watering: {formatDay(now, plant.nextWatering)}</Text>
        </View>
      )}
    />
  );
}
