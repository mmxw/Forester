/**
 * This file has utilities for converting from our internal data format
 * to a format that is closer to what the UI needs.
 *
 * For example, the code in this file calcuates what plant icon to show
 * based on watering frequency, species, last watering, etc.
 */
import {ONE_DAY, ONE_MONTH, ONE_WEEK} from './date';
import {
  Plant,
  Species,
  SpeciesId,
  PlantState,
  UIPlant,
  WaterFrequency,
} from './types';

export function plantToUIPlant(
  {plantId, contact, lastWatered, waterFrequency, speciesId}: Plant,
  speciesArr: Species[],
  now: Date,
): UIPlant {
  const species = findSpecies(speciesArr, speciesId);
  const [state, nextWatering] = calcPlantStateAndNextWatering(
    now,
    lastWatered,
    waterFrequency,
  );
  const appearance = species.appearances[state];

  return {
    plantId,
    name: contact.name,
    appearance,
    lastWatered,
    nextWatering,
    waterFrequency,
    state,
  };
}

function calcPlantStateAndNextWatering(
  now: Date,
  lastWatered: Date,
  waterFrequency: WaterFrequency,
): [PlantState, Date] {
  const frequencyMillis = waterFrequencyToMilliseconds(waterFrequency);
  const diff = now.valueOf() - lastWatered.valueOf();
  if (diff > frequencyMillis * 2) {
    return ['departed', now];
  }
  if (diff > frequencyMillis) {
    return ['droopy', now];
  }
  return ['happy', new Date(lastWatered.valueOf() + frequencyMillis)];
}

function waterFrequencyToMilliseconds({number, unit}: WaterFrequency): number {
  switch (unit) {
    case 'days':
      return number * ONE_DAY;
    case 'months':
      return number * ONE_MONTH;
    case 'weeks':
      return number * ONE_WEEK;
  }
}

function findSpecies(speciesArr: Species[], speciesId: SpeciesId): Species {
  const species = speciesArr.find((k) => k.id === speciesId);
  /* istanbul ignore next */
  if (!species) {
    // todo: better error handling for assertions https://github.com/mmxw/Forester/issues/10
    throw Error(`invalid data! could not find plant species id ${speciesId}`);
  }
  return species;
}
