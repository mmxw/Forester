import {atom, useRecoilState, useRecoilValue} from 'recoil';
import type {
  Plant,
  PlantAppearance,
  PlantId,
  Species,
  SpeciesId,
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

const speciesArrState = atom({
  key: 'speciesArrState',
  default: (() => {
    const id = (s: string) => s as SpeciesId;
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

    const speciesArr: Species[] = [
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
    if (new Set(speciesArr.map((s) => s.id)).size !== speciesArr.length) {
      throw Error('plant species ids are not unique');
    }
    return speciesArr;
  })(),
});

export function useAddPlant() {
  const [plants, setPlants] = useRecoilState(plantsState);

  // TODO: prevent more than one plant for the same contact?
  // https://github.com/mmxw/Forester/issues/11

  function addPlant({
    speciesId,
    waterFrequency,
    contact,
  }: {
    speciesId: SpeciesId;
    waterFrequency: WaterFrequency;
    contact: Contact;
  }) {
    const plant = makePlant({
      contact,
      speciesId,
      waterFrequency,
    });
    setPlants([...plants, plant]);
  }

  return addPlant;
}

export function useSpeciesArr(): Species[] {
  const speciesArr = useRecoilValue(speciesArrState);
  return speciesArr.slice();
}

export function useUIPlants(): UIPlant[] {
  const plants = useRecoilValue(plantsState);
  const speciesArr = useRecoilValue(speciesArrState);
  // using Date.now for easier mocking in tests
  const now = new Date(Date.now());

  return plants.map((plant) => plantToUIPlant(plant, speciesArr, now));
}

function makePlant({
  speciesId,
  waterFrequency,
  contact,
}: {
  speciesId: SpeciesId;
  waterFrequency: WaterFrequency;
  contact: Contact;
}): Plant {
  return {
    plantId: uuid() as PlantId,
    contact,
    speciesId: speciesId,
    // using Date.now for easier mocking
    lastWatered: new Date(Date.now()),
    waterFrequency,
  };
}
