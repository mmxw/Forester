import type {StackScreenProps} from '@react-navigation/stack';
import type {Contact} from 'react-native-select-contact';

export type Plant = Readonly<{
  plantId: PlantId;
  contact: Contact,
  lastWatered: Date;
  waterFrequency: WaterFrequency;
  plantKindId: PlantKindId;
}>;

export type PlantId = string & {readonly plantIdBrand: unique symbol};
export type PlantKindId = string & {readonly plantKindIdBrand: unique symbol};

export type PlantState = 'ok' | 'droopy' | 'departed';

export type PlantAppearance = Readonly<{
  kind: 'emoji';
  emoji: string;
}>;

export type WaterFrequency = Readonly<{
    unit: "days" | "weeks" | "months";
    number: number;
}>

export type PlantKind = Readonly<{
  readonly id: PlantKindId;
  readonly name: string;
  readonly appearances: Record<PlantState, PlantAppearance>;
}>

type RootStackParamList = Readonly<{
  Home: undefined;
  PlantChoice: {
    contact: Contact;
  };
}>;

export type ScreenProp<
  Screen extends keyof RootStackParamList
> = StackScreenProps<RootStackParamList, Screen>;
