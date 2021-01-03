/* istanbul ignore file */
import {Text} from 'react-native';
import {
  act,
  fireEvent,
  RenderAPI,
  waitFor,
  within,
} from '@testing-library/react-native';
import type {Contact} from 'react-native-select-contact';
import type {ReactTestInstance} from 'react-test-renderer';
import * as selectContactLib from 'react-native-select-contact';
import type {WaterFrequency} from '../src/utils/types';

export interface PlantFixture {
  contact: Contact | null;
  speciesName: string;
  wateringFrequency: WaterFrequency;
}

export const STARTER_PLANTS_STATE = [
  {
    plantId: '1',
    contact: {
      name: 'Professor Professorson',
      recordId: 'record1',
      phones: [],
      emails: [],
      postalAddresses: [],
    },
    speciesId: '1',
    lastWatered: '2020-01-01T10:49:41.836Z',
    waterFrequency: {number: 3, unit: 'weeks'},
  },
  {
    plantId: '2',
    contact: {
      name: 'Person McPherson',
      recordId: 'record2',
      phones: [],
      emails: [],
      postalAddresses: [],
    },
    speciesId: '7',
    lastWatered: '2020-01-01T10:49:41.836Z',
    waterFrequency: {number: 4, unit: 'days'},
  },
];

export function plantTestInstanceToString(
  component: ReactTestInstance,
): string {
  return within(component)
    .UNSAFE_getAllByType(Text)
    .flatMap((t) => t.props.children)
    .reduce((memo, str) => memo + str);
}

export async function getPlantsFromHomeScreen(
  r: RenderAPI,
): Promise<ReactTestInstance[]> {
  await waitFor(async () => await r.findByTestId('Plants List'));
  return r.findAllByA11yLabel(/.+the plant/);
}

export function mockNowDate(now: Date) {
  jest.spyOn(global.Date, 'now').mockImplementation(() => now.valueOf());
}


export async function setPlantOptions(
  r: RenderAPI,
  speciesName: string,
  waterFrequency: WaterFrequency
) {
  const speciesButton = await r.findByA11yLabel(`Press to select species ${speciesName}`)
  fireEvent(speciesButton, 'onPress');
  const wateringPicker = await waitFor(
    async () => await r.findByA11yLabel('Select how often to water'),
  );
  // Note: We are bypassing the `Picker` components
  // https://github.com/callstack/react-native-testing-library/issues/500
  act(() => {
    wateringPicker.parent!.parent!.props.onPick(waterFrequency);
  })
}