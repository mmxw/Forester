import React from 'react';
import {
  fireEvent,
  render,
  RenderAPI,
  within,
} from '@testing-library/react-native';
import {App} from '../src/App';
import type {WaterFrequency} from '../src/utils/types';
import {
  mockNowDate,
  plantTestInstanceToString,
  setPlantOptions,
  STARTER_PLANTS_STATE,
} from '../test-util/test-util';
import {getPlantsFromHomeScreen} from '../test-util/test-util';
import AsyncStorage from '@react-native-async-storage/async-storage';

test('edit plants', async () => {
  mockNowDate(new Date('2020-01-01T10:49:41.836Z'));
  await AsyncStorage.setItem(
    'plantsState',
    JSON.stringify(STARTER_PLANTS_STATE),
  );

  const r = render(<App />);
  await editPlant(r, 'Professor Professorson', {
    speciesName: 'Circle Tree',
    waterFrequency: {
      number: 5,
      unit: 'weeks',
    },
  });

  const plantScreen = await r.findByTestId('PlantScreen');
  const plantView = await within(plantScreen).findByA11yLabel(
    /Professor Professorson the plant/,
  );
  const plantStr = plantTestInstanceToString(plantView);
  expect(plantStr).toMatch(/🌳 Professor Professorson/);
  expect(JSON.parse((await AsyncStorage.getItem('plantsState'))!))
    .toMatchInlineSnapshot(`
    Array [
      Object {
        "contact": Object {
          "emails": Array [],
          "name": "Professor Professorson",
          "phones": Array [],
          "postalAddresses": Array [],
          "recordId": "record1",
        },
        "lastWatered": "2020-01-01T10:49:41.836Z",
        "plantId": "1",
        "speciesId": "2",
        "waterFrequency": Object {
          "number": 5,
          "unit": "weeks",
        },
      },
      Object {
        "contact": Object {
          "emails": Array [],
          "name": "Person McPherson",
          "phones": Array [],
          "postalAddresses": Array [],
          "recordId": "record2",
        },
        "lastWatered": "2020-01-01T10:49:41.836Z",
        "plantId": "2",
        "speciesId": "7",
        "waterFrequency": Object {
          "number": 4,
          "unit": "days",
        },
      },
    ]
  `);
});

export async function editPlant(
  r: RenderAPI,
  plantName: string,
  {
    speciesName,
    waterFrequency,
  }: {speciesName: string; waterFrequency: WaterFrequency},
): Promise<void> {
  const plants = await getPlantsFromHomeScreen(r);
  {
    const plantText = plants
      .map(plantTestInstanceToString)
      .find((p) => p.includes(plantName));
    if (plantText === undefined) {
      throw Error(`could not find rendered plant matching ${plantName}`);
    }
    if (plantText.includes(speciesName)) {
      throw Error('Bad test design: speciesName would not change');
    }
  }

  const plantScreenButton = await r.findByA11yLabel(
    `Go to plant screen for plant ${plantName}`,
  );
  fireEvent(plantScreenButton, 'onPress');
  const editButton = await r.findByA11yLabel(`Edit plant ${plantName}`);
  fireEvent(editButton, 'onPress');
  return setPlantOptions(r, speciesName, waterFrequency);
}
