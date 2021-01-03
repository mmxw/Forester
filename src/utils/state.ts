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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';

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

async function storePlantsToAsyncStorage(plants: Plant[]): Promise<void> {
  try {
    await AsyncStorage.setItem('plantsState', JSON.stringify(plants));
  } catch (error) {
    /* istanbul ignore next skip error handling*/
    console.error('cannot store the data in local storage', error.stack);
  }
}

export function useAddPlant() {
  const [plants, setPlants] = useRecoilState(plantsState);

  // TODO: prevent more than one plant for the same contact?
  // https://github.com/mmxw/Forester/issues/11

  async function addPlant({
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
    const newPlants = [...plants, plant];
    setPlants(newPlants);
    storePlantsToAsyncStorage(newPlants);
  }

  return addPlant;
}

export function useSpeciesArr(): Species[] {
  const speciesArr = useRecoilValue(speciesArrState);
  return speciesArr.slice();
}

type StoragePlant = Omit<Plant, 'lastWatered'> & {lastWatered: string};

async function getPlantsFromAsyncStorage(): Promise<Plant[]> {
  const jsonString = await AsyncStorage.getItem('plantsState');
  const storagePlants: StoragePlant[] =
    jsonString != null ? JSON.parse(jsonString) : [];
  return storagePlants.map((storagePlant) => ({
    ...storagePlant,
    lastWatered: new Date(storagePlant.lastWatered),
  }));
}

export function useUIPlants(): UIPlant[] | 'loading' {
  const [isLoading, setIsLoading] = useState(true);
  const [plants, setPlants] = useRecoilState(plantsState);
  const speciesArr = useRecoilValue(speciesArrState);
  // using Date.now for easier mocking in tests
  const now = new Date(Date.now());

  useEffect(() => {
    getPlantsFromAsyncStorage()
      .then((storedPlants) => {
        setPlants(storedPlants);
      })
      .catch(
        /* istanbul ignore next skip error handling */ (error) => {
          console.error(`error getting plants from storage ${error.stack}`);
          setPlants([]);
        },
      )
      .finally(() => setIsLoading(false));
  }, [setPlants, setIsLoading]);

  if (isLoading) {
    return 'loading';
  }

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
