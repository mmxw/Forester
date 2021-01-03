import React from 'react';
import {View, Text} from 'react-native';
import type {UIPlant} from '../utils/types';
import {formatDay} from '../utils/date';

export function PlantView({plant}: {plant: UIPlant}) {
  // Harmless side effect we don't need to live-update the days
  // and we can mock Date.now in tests
  const now = new Date(Date.now());
  const {name} = plant.contact;
  return (
    <View accessible accessibilityLabel={`${name} the plant`}>
      <Text>
        {plant.appearance.emoji} {name} ({plant.state})
      </Text>
      <Text>last watered: {formatDay(now, plant.lastWatered)} </Text>
      <Text>next watering: {formatDay(now, plant.nextWatering)}</Text>
    </View>
  );
}
