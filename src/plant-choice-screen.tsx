import React from 'react';
import {useState} from 'react';
import {Button, FlatList, Text, TouchableHighlight, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import type {ScreenProp, PlantKind, PlantKindId, WaterFrequency} from './types';
import {useAddPlant, usePlantKinds} from './state';

export function PlantChoiceScreen({
  navigation,
  route,
}: ScreenProp<'PlantChoice'>) {
  const {contact} = route.params;
  const plantKinds = usePlantKinds();
  const [plantKindId, setPlantKindId] = useState<PlantKindId | undefined>(
    undefined,
  );
  const addPlant = useAddPlant();

  function handlePickWaterFrequency(waterFrequency: WaterFrequency): void {
    if (!plantKindId) {
      throw Error('expected plantKindId to be defined');
    }
    addPlant({contact, plantKindId, waterFrequency});
    navigation.navigate('Home');
  }

  if (plantKindId) {
    return (
      <WateringPicker
        contactName={contact.name}
        onPick={handlePickWaterFrequency}
      />
    );
  }

  return (
    <View>
      <Text>Pick an appearance for {contact.name}</Text>
      <FlatList
        data={plantKinds}
        keyExtractor={({id}) => id}
        renderItem={({item}) => (
          <PlantKindButton
            key={item.id}
            plantKind={item}
            onPress={() => setPlantKindId(item.id)}
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
    <View>
      <Text>water {contactName} every </Text>
      <Picker
        selectedValue={'' + number}
        onValueChange={(val, _index) => setNum(parseInt(val.toString(), 10))}>
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
      <Button
        title="done"
        onPress={() =>
          onPick({
            number,
            unit,
          })
        }
      />
    </View>
  );
}

function PlantKindButton({
  plantKind: {appearances, name},
  onPress,
}: {
  plantKind: PlantKind;
  onPress: () => void;
}) {
  return (
    <TouchableHighlight onPress={() => onPress()}>
      <Text
        style={{
          fontSize: 20,
        }}>{`${appearances.happy.emoji} ${name}`}</Text>
    </TouchableHighlight>
  );
}
