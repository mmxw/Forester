import {atom, useRecoilState, useRecoilValue} from 'recoil';
import type {
  Plant,
  PlantAppearance,
  PlantId,
  PlantKind,
  PlantKindId,
  PlantState,
  UIPlant,
  WaterFrequency,
} from './types';
import {Contact} from 'react-native-select-contact';
import {plantToUIPlant} from './plant-calculations';

let i = 0;
/* istanbul ignore next */
const uuid =
  process.env.NODE_ENV === 'test'
    ? () => '' + ++i
    : (() => {
        // needed for uuid. Blows up when run in tests
        require('react-native-get-random-values');
        return require('uuid').v4;
      })();

const plantsState = atom({
  key: 'plantsState',
  default: [] as Plant[],
});

const plantKindsState = atom({
  key: 'plantKindsState',
  default: (() => {
    const id = (s: string) => s as PlantKindId;
    function emojiToAppearances(
      emoji: string,
    ): Record<PlantState, PlantAppearance> {
      const appearance: PlantAppearance = {
        kind: 'emoji',
        emoji,
      };
      return {
        happy: appearance,
        droopy: appearance,
        departed: appearance,
      };
    }

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

    /* istanbul ignore next */
    if (new Set(plantKinds.map((k) => k.id)).size !== plantKinds.length) {
      throw Error('plant kind ids are not unique');
    }
    return plantKinds;
  })(),
});

export function useAddPlant() {
  const [plants, setPlants] = useRecoilState(plantsState);

  // TODO: prevent more than one plant for the same contact?
  // https://github.com/mmxw/Forester/issues/11

  function addPlant({
    plantKindId,
    waterFrequency,
    contact,
  }: {
    plantKindId: PlantKindId;
    waterFrequency: WaterFrequency;
    contact: Contact;
  }) {
    const plant = makePlant({
      contact,
      plantKindId,
      waterFrequency,
    });
    setPlants([...plants, plant]);
  }

  return addPlant;
}

export function usePlantKinds(): PlantKind[] {
  const plantKinds = useRecoilValue(plantKindsState);
  return plantKinds.slice();
}

export function useUIPlants(): UIPlant[] {
  const plants = useRecoilValue(plantsState);
  const plantKinds = useRecoilValue(plantKindsState);
  // using Date.now for easier mocking in tests
  const now = new Date(Date.now());

  return plants.map((plant) => plantToUIPlant(plant, plantKinds, now));
}

function makePlant({
  plantKindId,
  waterFrequency,
  contact,
}: {
  plantKindId: PlantKindId;
  waterFrequency: WaterFrequency;
  contact: Contact;
}): Plant {
  return {
    plantId: uuid() as PlantId,
    contact,
    plantKindId,
    // using Date.now for easier mocking
    lastWatered: new Date(Date.now()),
    waterFrequency,
  };
}
