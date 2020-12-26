import React, {useState} from 'react';
import {Text} from 'react-native';
import {RecoilRoot} from 'recoil';
import {useAddPlant, usePlantKinds, useUIPlants} from './state';
import {PlantKind, PlantKindId, UIPlant} from './types';
import {fireEvent, render, waitFor} from '@testing-library/react-native';

/*
Lots of boilerplate so we can get at the recoil state.
*/
function StateTester(): JSX.Element {
  /* testID increments each time we `onPress` */
  const [testIDNum, setTestIdNum] = useState(1);
  const uiPlants = useUIPlants();
  const plantKinds = usePlantKinds();
  const addPlant = useAddPlant();
  function onPress() {
    setTestIdNum(testIDNum + 1);
    addPlant(plantData);
  }
  const plantData = {
    plantKindId: '1' as PlantKindId,
    contact: {
      emails: [],
      name: 'p1',
      phones: [],
      postalAddresses: [],
      recordId: 'r1',
    },
    waterFrequency: {
      number: 1,
      unit: 'days' as const,
    },
  };

  const data = {
    uiPlants,
    plantKinds,
  };

  return (
    <Text testID={'' + testIDNum} onPress={onPress}>
      {JSON.stringify(data, null, 2)}
    </Text>
  );
}

const StateTesterContainer = () => (
  <RecoilRoot>
    <StateTester />
  </RecoilRoot>
);

test('can add a plant', async () => {
  jest
    .spyOn(global.Date, 'now')
    .mockImplementation(() => new Date('2020-12-27T17:01:19.102Z').valueOf());

  const rendered = render(<StateTesterContainer />);
  const jsonNode = await rendered.findByTestId('1');

  function getData(): {uiPlants: UIPlant[]; plantKinds: PlantKind[]} {
    const str = jsonNode.children.toString();
    return JSON.parse(str);
  }

  expect(getData().uiPlants).toEqual([]);
  expect(getData().plantKinds).toMatchSnapshot('initial plant kinds');

  fireEvent(jsonNode, 'onPress');

  await waitFor(async () => rendered.findByTestId('2'));
  expect(getData().uiPlants).toMatchSnapshot('UI plants after one added');
});
