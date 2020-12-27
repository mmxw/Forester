/**
 * @format
 */

import 'react-native';
import React from 'react';
import {App} from './App';
import {render} from '@testing-library/react-native';

it('renders correctly', async () => {
  const r = render(<App />);
  await r.findByA11yHint('Home Screen');
});
