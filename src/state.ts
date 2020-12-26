import {atom, useRecoilState} from 'recoil';
import type {
  Plant,
  PlantId,
  PlantKind,
  PlantKindId,
  WaterFrequency,
} from './types';
// needed for uuid
import 'react-native-get-random-values';
import { v4 } from 'uuid';
import { Contact } from 'react-native-select-contact';

const plantsState = atom({
  key: 'plantsState',
  default: new Array<Plant>(),
});

export function useAddPlant() {
  const [plants, setPlants] = useRecoilState(plantsState);

  // TODO: prevent more than one plant for the same contact?

  function addPlant({
    plantKindId,
    waterFrequency,
    contact
  }: {
    plantKindId: PlantKindId;
    waterFrequency: WaterFrequency;
    contact: Contact
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

export function usePlants(): Plant[] {
  const [plants, _setPlants] = useRecoilState(plantsState);

  return plants.slice();

}

function makePlant({
  plantKindId,
  waterFrequency,
  contact
}: {
  plantKindId: PlantKindId;
  waterFrequency: WaterFrequency;
  contact: Contact
}): Plant {
  return {
    plantId: v4() as PlantId,
    contact,
    plantKindId,
    lastWatered: new Date(),
    waterFrequency,
  };
}
