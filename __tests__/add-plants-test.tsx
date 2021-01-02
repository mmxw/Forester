import React from 'react';
import type {ReactTestInstance} from 'react-test-renderer';
import {fireEvent, render, within} from '@testing-library/react-native';
import {App} from '../src/App'
import * as selectContactLib from 'react-native-select-contact';
import {Text} from 'react-native';
import {mockNowDate, PlantFixture} from '../test-util/test-util';
import {addPlant, getPlantsFromHomeScreen} from '../test-util/test-util';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PLANT_FIXTURE_1: PlantFixture = {
  contact: {
    name: 'Professor Professorson',
    recordId: 'record1',
    phones: [],
    emails: [],
    postalAddresses: [],
  },
  speciesName: 'Cactus',
  wateringFrequency: {
    number: 3,
    unit: 'weeks',
  },
};
const PLANT_FIXTURE_2: PlantFixture = {
  contact: {
    name: 'Person McPherson',
    recordId: 'record2',
    phones: [],
    emails: [],
    postalAddresses: [],
  },
  speciesName: 'Sunflower',
  wateringFrequency: {
    number: 4,
    unit: 'days',
  },
};
const PLANT_FIXTURE_3: PlantFixture = {
  contact: {
    name: 'Ms. Pacman',
    recordId: 'record3',
    phones: [],
    emails: [],
    postalAddresses: [],
  },
  speciesName: 'Triangle Tree',
  wateringFrequency: {
    number: 1,
    unit: 'months',
  },
};

test('add plants', async () => {
  const r = render(<App />);
  // ensures exactly 1 plant list
  await r.findByTestId('Plants List');
  mockNowDate(new Date('2020-01-01T10:49:41.836Z'));

  await addPlant(r, PLANT_FIXTURE_1);
  {
    const plants = await getPlantsFromHomeScreen(r);
    expect(plants).toHaveLength(1);
    expect(plants[0].props.testID).toBe(
      'Professor Professorson the plant',
    );
    expect(plantTestInstanceToString(plants[0])).toMatchInlineSnapshot(
      `"🌵 Professor Professorson (happy)last watered: 2020-01-01T10:49:41.836Z next watering: 2020-01-01T10:49:41.836Z "`,
    );
  }

  await addPlant(r, PLANT_FIXTURE_2);
  mockNowDate(new Date('2020-02-02T10:49:41.836Z'));
  await addPlant(r, PLANT_FIXTURE_3);
  {
    const plants = await getPlantsFromHomeScreen(r);
    expect(plants).toHaveLength(3);
    expect(
      plants.map((p) => [
        p.props.testID,
        plantTestInstanceToString(p),
      ]),
    ).toMatchInlineSnapshot(`
      Array [
        Array [
          "Professor Professorson the plant",
          "🌵 Professor Professorson (droopy)last watered: 2020-01-01T10:49:41.836Z next watering: 2020-02-02T10:49:41.836Z ",
        ],
        Array [
          "Person McPherson the plant",
          "🌻 Person McPherson (departed)last watered: 2020-01-01T10:49:41.836Z next watering: 2020-02-02T10:49:41.836Z ",
        ],
        Array [
          "Ms. Pacman the plant",
          "🌲 Ms. Pacman (happy)last watered: 2020-02-02T10:49:41.836Z next watering: 2020-02-02T10:49:41.836Z ",
        ],
      ]
    `);
  }
});

test('add plants when cannot access contacts', async () => {
  jest
    .spyOn(selectContactLib, 'selectContact')
    .mockImplementation(async () => null);

  const r = render(<App />);
  // ensures exactly 1 plant list
  await r.findByTestId('Plants List');

  const addPlantButton = await r.findByA11yLabel('Add Plant');
  fireEvent(addPlantButton, 'onPress');
  await r.findByText(/issue accessing contacts/);
});

function plantTestInstanceToString(component: ReactTestInstance): string {
  return within(component)
    .UNSAFE_getAllByType(Text)
    .flatMap((t) => t.props.children)
    .reduce((memo, str) => memo + str);
}
