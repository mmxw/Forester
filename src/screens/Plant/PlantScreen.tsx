/**
 * This screen requires a contact,
 * and enables the user to select plant attributes
 * (such as species and watering frequency)
 */
import React from 'react';
import {Button, Text, View, Linking, Platform, Alert} from 'react-native';
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

  function water() {
    if (plant !== 'loading') {
      let phoneNumber = plant.contact.phones[0].number
      if (Platform.OS !== 'android') {
        phoneNumber = `telprompt:${phoneNumber}`
      } else {
        phoneNumber = `tel:${phoneNumber}`
      }
      Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Unable to make a phone call')
        } else {
          return Linking.openURL(phoneNumber)
        }
      })
      .catch(err => console.log(err))
    }
  }

  return (
    <View testID="PlantScreen">
      <Button
        accessibilityLabel={`Edit plant ${plant.contact.name}`}
        title="Edit Plant"
        onPress={edit}
      />
      <PlantView plant={plant} />
      <Button 
        accessibilityLabel={`Water plant ${plant.contact.name}`}
        title="Water Plant"
        onPress={water}
      />
      
    </View>
  );
}
