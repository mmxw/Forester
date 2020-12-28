/**
 * This screen requires a contact,
 * and enables the user to select plant attributes
 * (such as species and watering frequency)
 */
import React from 'react';
import {useState} from 'react';
import {Button, FlatList, Text, TouchableHighlight, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import type {
  ScreenProp,
  Species,
  SpeciesId,
  WaterFrequency,
} from '../../utils/types';
import {useAddPlant, useSpeciesArr} from '../../utils/state';

export function EditPlantScreen({navigation, route}: ScreenProp<'EditPlant'>) {
  const {contact} = route.params;
  const speciesArr = useSpeciesArr();
  const [speciesId, setSpeciesId] = useState<SpeciesId | undefined>(undefined);
  const addPlant = useAddPlant();

  function handlePickWaterFrequency(waterFrequency: WaterFrequency): void {
    /* istanbul ignore next */
    if (!speciesId) {
      throw Error('expected speciesId to be defined');
    }
    addPlant({contact, speciesId: speciesId, waterFrequency});
    navigation.navigate('Home');
  }

  if (speciesId) {
    return (
      <WateringPicker
        contactName={contact.name}
        onPick={handlePickWaterFrequency}
      />
    );
  }

  return (
    <View accessibilityLabel="Pick species from the list">
      <Text>Pick an appearance for {contact.name}</Text>
      <FlatList
        accessibilityLabel="Species List"
        data={speciesArr}
        keyExtractor={({id}) => id}
        renderItem={({item}) => (
          <SpeciesButton
            key={item.id}
            species={item}
            onPress={() => setSpeciesId(item.id)}
          />
        )}
      />
    </View>
  );
}

const NUMS = [1, 2, 3, 4, 5, 6];
const UNITS: WaterFrequency['unit'][] = ['days', 'weeks', 'months'];

function WateringPicker({
  contactName,
  onPick,
}: {
  contactName: string;
  onPick: (waterFrequency: WaterFrequency) => void;
}) {
  const [number, setNum] = useState(NUMS[0]);
  const [unit, setUnit] = useState(UNITS[1]);
  return (
    <View accessible accessibilityHint="Select how often to water">
      <Text>water {contactName} every </Text>
      {(() => {
        // awkwardness because Picker isn't mocked
        /* istanbul ignore next */ return (
          <>
            <Picker
              selectedValue={'' + number}
              onValueChange={(val, _index) =>
                setNum(parseInt(val.toString(), 10))
              }>
              {NUMS.map((n) => '' + n).map((opt) => (
                <Picker.Item key={opt} label={opt} value={opt} />
              ))}
            </Picker>
            <Picker
              selectedValue={unit}
              onValueChange={(val, _index) =>
                setUnit(val.toString() as WaterFrequency['unit'])
              }>
              {UNITS.map((opt) => (
                <Picker.Item key={opt} label={opt} value={opt} />
              ))}
            </Picker>
          </>
        );
      })()}
      <Button
        title="done"
        onPress={
          /* istanbul ignore next */
          () =>
            onPick({
              number,
              unit,
            })
        }
      />
    </View>
  );
}

function SpeciesButton({
  species: {appearances, name},
  onPress,
}: {
  species: Species;
  onPress: () => void;
}) {
  return (
    <TouchableHighlight
      accessibilityHint={`Press to select species ${name}`}
      onPress={() => onPress()}>
      <Text
        accessibilityLabel={name}
        style={{
          fontSize: 20,
        }}>{`${appearances.happy.emoji} ${name}`}</Text>
    </TouchableHighlight>
  );
}
