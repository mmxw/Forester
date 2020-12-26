import {
  Plant,
  PlantKind,
  PlantKindId,
  PlantState,
  UIPlant,
  WaterFrequency,
} from './types';

const ONE_DAY = 60 * 60 * 24;
// TODO: better date math!
const ONE_MONTH = ONE_DAY * 30;
const ONE_WEEK = ONE_DAY * 7;

export function plantToUIPlant(
  {contact, lastWatered, waterFrequency, plantKindId}: Plant,
  plantKinds: PlantKind[],
  now: Date,
): UIPlant {
  const plantKind = lookupPlantKind(plantKinds, plantKindId);
  const [state, nextWatering] = calcPlantStateAndNextWatering(
    now,
    lastWatered,
    waterFrequency,
  );
  const appearance = plantKind.appearances[state];

  return {
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
  return ['happy', new Date(now.valueOf() + diff)];
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
  const _exhaustivenessCheck: never = unit;
}

function lookupPlantKind(
  plantKinds: PlantKind[],
  plantKindId: PlantKindId,
): PlantKind {
  const kind = plantKinds.find((kind) => kind.id === plantKindId);
  if (!kind) {
    // todo: better error handling
    throw Error(`invalid data! could not find plant kind id ${plantKindId}`);
  }
  return kind;
}
