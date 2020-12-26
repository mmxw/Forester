import React from 'react';
import { useState} from 'react';
import {Button, FlatList, Text, TouchableHighlight, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import type { ScreenProp, PlantKind, PlantState, PlantAppearance, PlantKindId, WaterFrequency } from "./types";
import { useAddPlant } from './state';

export function PlantChoiceScreen({navigation, route}: ScreenProp<"PlantChoice">) {
  const {contact} = route.params
  const [plantKindId, setPlantKindId] = useState<PlantKindId | undefined>(undefined);
  const addPlant = useAddPlant();

  function handlePickWaterFrequency(waterFrequency: WaterFrequency): void {
    if (!plantKindId) {
      throw Error('expected plantKindId to be defined');
    }
    addPlant({contact, plantKindId, waterFrequency})
    navigation.navigate("Home")
  }


  if (plantKindId) {
    return <WateringPicker contactName={contact.name} onPick={handlePickWaterFrequency} />;
  }

  const plantKinds = getPlantKinds();

  return (
    <View>
      <Text>Pick an appearance for {contact?.name}</Text>
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
const UNITS: readonly WaterFrequency["unit"][] = ['days', 'weeks', 'months'] as const;

function WateringPicker({contactName, onPick}: {contactName: string, onPick: (waterFrequency: WaterFrequency) => void}) {
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
        onValueChange={(val, _index) => setUnit(val.toString() as WaterFrequency["unit"])}>
        {UNITS.map((opt) => (
          <Picker.Item key={opt} label={opt} value={opt} />
        ))}
      </Picker>
      <Button title="done" onPress={() => onPick({
        number,
        unit
      })} />
    </View>
  );
}

function PlantKindButton({
  plantKind: {id, appearances, name},
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
        }}>{`${appearances.ok.emoji} ${name}`}</Text>
    </TouchableHighlight>
  );
}


function getPlantKinds(): PlantKind[] {
  const id = (s: string) => s as PlantKindId;

  const plantKinds: PlantKind[] = [
    {
      id: id('1'),
      name: 'Cactus',
      appearances: emojiToAppearances('🌵'),
    },
    {
      id: id('2'),
      name: 'Circle Tree',
      appearances: emojiToAppearances('🌳'),
    },

    {
      id: id('3'),
      name: 'Triangle Tree',
      appearances: emojiToAppearances('🌲'),
    },

    {
      id: id('4'),
      name: 'Clover',
      appearances: emojiToAppearances('🍀'),
    },

    {
      id: id('5'),
      name: 'Palm Tree',
      appearances: emojiToAppearances('🌴'),
    },

    {
      id: id('6'),
      name: 'Tiny Plant',
      appearances: emojiToAppearances('🌱'),
    },

    {
      id: id('7'),
      name: 'Sunflower',
      appearances: emojiToAppearances('🌻'),
    },

    {
      id: id('8'),
      name: 'Pink Blossum',
      appearances: emojiToAppearances('🌸 '),
    },

    {
      id: id('9'),
      name: 'Blossom',
      appearances: emojiToAppearances('🌼 '),
    },
  ];

  if (new Set(plantKinds.map((k) => k.id)).size !== plantKinds.length) {
    throw Error('plant kind ids are not unique');
  }
  return plantKinds;
}

function emojiToAppearances(emoji: string): Record<PlantState, PlantAppearance> {
  const appearance: PlantAppearance = {
    kind: 'emoji',
    emoji,
  };
  return {
    ok: appearance,
    droopy: appearance,
    departed: appearance,
  };
}

