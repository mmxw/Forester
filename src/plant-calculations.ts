import {
  Plant,
  PlantKind,
  PlantKindId,
  PlantState,
  UIPlant,
  WaterFrequency,
} from './types';

// TODO: better date math and display https://github.com/mmxw/Forester/issues/12
const ONE_DAY = 1000 * 60 * 60 * 24;
const ONE_MONTH = ONE_DAY * 30;
const ONE_WEEK = ONE_DAY * 7;

export function plantToUIPlant(
  {contact, lastWatered, waterFrequency, plantKindId}: Plant,
  plantKinds: PlantKind[],
  now: Date,
): UIPlant {
  const plantKind = findPlantKind(plantKinds, plantKindId);
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
  // eslint-disable-next-line
  const _exhaustivenessCheck: never = unit;
}

function findPlantKind(
  plantKinds: PlantKind[],
  plantKindId: PlantKindId,
): PlantKind {
  const kind = plantKinds.find((k) => k.id === plantKindId);
  if (!kind) {
    // todo: better error handling for assertions https://github.com/mmxw/Forester/issues/10
    throw Error(`invalid data! could not find plant kind id ${plantKindId}`);
  }
  return kind;
}
