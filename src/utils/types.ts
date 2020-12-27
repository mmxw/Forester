/**
 * types that are shared between several modules
 */
import type {StackScreenProps} from '@react-navigation/stack';
import type {Contact} from 'react-native-select-contact';

/**
 * Users can create a plant for one of their contacts,
 * and the app will indicate if they need to "water" the plant
 * (stay in touch with the friend or family member or colleague)
 */
export type Plant = Readonly<{
  plantId: PlantId;
  contact: Contact;
  lastWatered: Date;
  waterFrequency: WaterFrequency;
  speciesId: SpeciesId;
}>;

/**
 * Plants get droopy and then depart if they aren't
 * watered frequently enough.
 */
export type PlantState = 'happy' | 'droopy' | 'departed';

/**
 * A plant has a species, such as "hosue plant" or "cactus",
 * which determines how it displays.
 */
export type Species = Readonly<{
  readonly id: SpeciesId;
  readonly name: string;
  readonly appearances: Record<PlantState, PlantAppearance>;
}>;

/**
 * Represents in a Plant in a way that is
 * easier to use in the UI.
 */
export type UIPlant = Readonly<{
  name: string;
  appearance: PlantAppearance;
  lastWatered: Date;
  waterFrequency: WaterFrequency;
  nextWatering: Date;
  state: PlantState;
}>;

export type PlantId = string & {readonly plantIdBrand: unique symbol};
export type SpeciesId = string & {readonly speciesId: unique symbol};

export type PlantAppearance = Readonly<{
  kind: 'emoji';
  emoji: string;
}>;

export type WaterFrequency = Readonly<{
  unit: 'days' | 'weeks' | 'months';
  number: number;
}>;

type RootStackParamList = Readonly<{
  Home: undefined;
  PlantChoice: {
    contact: Contact;
  };
}>;

/**
 * Enables screens to have well-typed props
 */
export type ScreenProp<
  Screen extends keyof RootStackParamList
> = StackScreenProps<RootStackParamList, Screen>;
