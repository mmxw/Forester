import {plantToUIPlant} from './plant-calculations';
import type {Plant, PlantId, Species, SpeciesId} from './types';

test('plantToUIPlant', () => {
  const now = new Date('January 15, 2021');
  const plants: Plant[] = [
    {
      lastWatered: new Date('January 10, 2021'),
      speciesId: 'species1' as SpeciesId,
      waterFrequency: {
        number: 1,
        unit: 'weeks',
      },
      plantId: 'p1' as PlantId,
      contact: {
        recordId: 'r1',
        emails: [],
        name: 'person 1',
        phones: [],
        postalAddresses: [],
      },
    },
    {
      lastWatered: new Date('January 10, 2021'),
      speciesId: 'species1' as SpeciesId,
      waterFrequency: {
        number: 2,
        unit: 'months',
      },
      plantId: 'p2' as PlantId,
      contact: {
        recordId: 'r3',
        emails: [],
        name: 'person 3',
        phones: [],
        postalAddresses: [],
      },
    },
    {
      lastWatered: new Date('January 13, 2021'),
      speciesId: 'species2' as SpeciesId,
      waterFrequency: {
        number: 1,
        unit: 'days',
      },
      plantId: 'p2' as PlantId,
      contact: {
        recordId: 'r2',
        emails: [],
        name: 'person 2',
        phones: [],
        postalAddresses: [],
      },
    },
    {
      lastWatered: new Date('January 12, 2021'),
      speciesId: 'species2' as SpeciesId,
      waterFrequency: {
        number: 1,
        unit: 'days',
      },
      plantId: 'p2' as PlantId,
      contact: {
        recordId: 'r2',
        emails: [],
        name: 'person 2',
        phones: [],
        postalAddresses: [],
      },
    },
  ];

  const speciesArr: Species[] = [
    {
      id: 'species1' as SpeciesId,
      name: 'plant species 1',
      appearances: {
        happy: {
          emoji: '🤣',
          kind: 'emoji',
        },
        droopy: {
          emoji: '😢',
          kind: 'emoji',
        },
        departed: {
          emoji: '🤢',
          kind: 'emoji',
        },
      },
    },
    {
      id: 'species2' as SpeciesId,
      name: 'species 2',
      appearances: {
        happy: {
          emoji: '👍',
          kind: 'emoji',
        },
        droopy: {
          emoji: '🤦‍♀️',
          kind: 'emoji',
        },
        departed: {
          emoji: '👎',
          kind: 'emoji',
        },
      },
    },
  ];

  expect(
    plants.map((plant) => plantToUIPlant(plant, speciesArr, now)),
  ).toMatchSnapshot();
});
