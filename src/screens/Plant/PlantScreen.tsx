/**
 * This screen requires a contact,
 * and enables the user to select plant attributes
 * (such as species and watering frequency)
 */
import React from 'react';
import {Button, Text, View} from 'react-native';
import type {ScreenProp} from '../../utils/types';
import {useUIPlant} from '../../utils/state';
import {PlantView} from '../../components/PlantView';

export function PlantScreen({navigation, route}: ScreenProp<'Plant'>) {
  const {plantId} = route.params;
  const plant = useUIPlant(plantId);

  /* istanbul ignore next */
  if (!plant) {
    throw Error(`could not find plant with id ${plantId}`);
  }
  if (plant === 'loading') {
    return (
      <View>
        <Text>loading</Text>
      </View>
    );
  }

  function edit() {
    /* istanbul ignore next */
    if (plant === 'loading') {
      throw Error(
        'In impossible state: how could the button be clicked before the plant loaded?',
      );
    }
    navigation.navigate('PlantChoice', {
      action: 'updatePlant',
      plantId,
      contact: plant.contact,
    });
  }

  return (
    <View testID="PlantScreen">
      <PlantView plant={plant} />
      <Button
        accessibilityLabel={`Edit plant ${plant.contact.name}`}
        title="Edit Plant"
        onPress={edit}
      />
    </View>
  );
}
