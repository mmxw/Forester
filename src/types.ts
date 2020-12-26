import type {StackScreenProps} from '@react-navigation/stack';
import type { Contact } from 'react-native-select-contact';

type RootStackParamList = {
  Home: undefined;
  PlantChoice: {
      contact: Contact
  };
};

export type ScreenProp<
  Screen extends keyof RootStackParamList
> = StackScreenProps<RootStackParamList, Screen>;

export type PlantId = string & {readonly plantIdKind: unique symbol};

export type PlantState = 'ok' | 'droopy' | 'departed';

export type PlantAppearance = {
  kind: 'emoji';
  emoji: string;
};

export interface PlantKind {
  id: PlantId;
  name: string;
  appearances: Record<PlantState, PlantAppearance>;
}

