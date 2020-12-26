import {plantToUIPlant} from './plant-calculations';
import type {Plant, PlantId, PlantKind, PlantKindId} from './types';

test('plantToUIPlant', () => {
  const now = new Date('January 15, 2021');
  const plants: Plant[] = [
    {
      lastWatered: new Date('January 10, 2021'),
      plantKindId: 'plantKind1' as PlantKindId,
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
      lastWatered: new Date('January 13, 2021'),
      plantKindId: 'plantKind2' as PlantKindId,
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
      plantKindId: 'plantKind2' as PlantKindId,
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

  const plantKinds: PlantKind[] = [
    {
      id: 'plantKind1' as PlantKindId,
      name: 'plant kind 1',
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
      id: 'plantKind2' as PlantKindId,
      name: 'face kind 2',
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
    plants.map((plant) => plantToUIPlant(plant, plantKinds, now)),
  ).toMatchSnapshot();
});
