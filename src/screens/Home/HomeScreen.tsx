import React, {useState} from 'react';
import {Text, Button, View} from 'react-native';
// using namespace import so we can mock
import * as selectContactLib from 'react-native-select-contact';
import {FlatList, TouchableHighlight} from 'react-native-gesture-handler';
import type {ScreenProp, UIPlant, PlantId} from '../../utils/types';
import {useUIPlants} from '../../utils/state';
import {PlantView} from '../../components/PlantView';

export function HomeScreen({navigation}: ScreenProp<'Home'>) {
  const plants = useUIPlants();
  const [
    hasProblemGettingPermissions,
    setHasProblemGettingPermissions,
  ] = useState(false);

  async function startAddPlant() {
    const contact = await selectContactLib.selectContact();
    if (contact) {
      navigation.navigate('PlantChoice', {
        contact,
        action: 'addPlant',
      });
      setHasProblemGettingPermissions(false);
    } else {
      setHasProblemGettingPermissions(true);
    }
  }

  function onPressPlant(plantId: PlantId): void {
    navigation.navigate('Plant', {plantId});
  }

  const MaybeErrorMessage = hasProblemGettingPermissions ? (
    <Text accessible style={{color: 'red'}}>
      There was an issue accessing contacts.
    </Text>
  ) : null;

  return (
    <View>
      {plants === 'loading' ? (
        <Text> loading... </Text>
      ) : (
        <>
          {MaybeErrorMessage}
          <Plants plants={plants} onPressPlant={onPressPlant} />
          <Button
            title="Add Plant"
            accessibilityLabel={'Add Plant'}
            onPress={startAddPlant}
          />
        </>
      )}
    </View>
  );
}

function Plants({
  plants,
  onPressPlant,
}: {
  plants: UIPlant[];
  onPressPlant: (plantId: PlantId) => void;
}) {
  return (
    <FlatList
      testID="Plants List"
      data={plants}
      keyExtractor={({plantId}) => plantId}
      renderItem={({item: plant}) => (
        <TouchableHighlight
          accessible
          accessibilityLabel={`Go to plant screen for plant ${plant.contact.name}`}
          testID={`${plant.contact.name} the plant`}
          onPress={() => onPressPlant(plant.plantId)}>
          <PlantView plant={plant} />
        </TouchableHighlight>
      )}
    />
  );
}
