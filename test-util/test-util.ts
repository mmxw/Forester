/* istanbul ignore file */
import {Text} from 'react-native';
import { act, fireEvent, RenderAPI, waitFor, within } from "@testing-library/react-native";
import type { Contact } from "react-native-select-contact";
import type { ReactTestInstance } from "react-test-renderer";
import * as selectContactLib from 'react-native-select-contact';
import type { WaterFrequency } from "../src/utils/types";


export interface PlantFixture {
  contact: Contact | null;
  speciesName: string;
  wateringFrequency: WaterFrequency;
}

export function plantTestInstanceToString(component: ReactTestInstance): string {
  return within(component)
    .UNSAFE_getAllByType(Text)
    .flatMap((t) => t.props.children)
    .reduce((memo, str) => memo + str);
}

export async function getPlantsFromHomeScreen(
  r: RenderAPI,
): Promise<ReactTestInstance[]> {
  await waitFor(async () => await r.findByA11yHint('Plants List'));
  return r.findAllByA11yHint(/.+the plant/);
}

export function mockNowDate(now: Date) {
  jest.spyOn(global.Date, 'now').mockImplementation(() => now.valueOf());
}

export async function addPlant(
  r: RenderAPI,
  {contact, speciesName, wateringFrequency}: PlantFixture,
): Promise<void> {
  jest
    .spyOn(selectContactLib, 'selectContact')
    .mockImplementation(async () => contact);

  const addPlantButton = await r.findByA11yLabel('Add Plant');
  fireEvent(addPlantButton, 'onPress');
  const speciesButtons = await waitFor(
    async () => await r.findAllByA11yHint(/Press to select species/),
  );
  const cactusButton = speciesButtons.find((b) =>
    b.props.accessibilityHint.includes(speciesName),
  );
  expect(cactusButton).toBeDefined();
  if (!cactusButton) {
    throw Error('expected cactusButton to be defined');
  }

  fireEvent(cactusButton, 'onPress');
  const wateringPicker = await waitFor(
    async () => await r.findByA11yHint('Select how often to water'),
  );
  // Note: We are bypassing the `Picker` components
  // https://github.com/callstack/react-native-testing-library/issues/500
  act(() => wateringPicker.parent!.parent!.props.onPick(wateringFrequency));
}