/**
 * types that are shared between several modules
 */
import type {StackScreenProps} from '@react-navigation/stack';
import type {Contact} from 'react-native-select-contact';

export interface PlantOptions {
  readonly speciesId: SpeciesId;
  readonly waterFrequency: WaterFrequency;
}

/**
 * Users can create a plant for one of their contacts,
 * and the app will indicate if they need to "water" the plant
 * (stay in touch with the friend or family member or colleague)
 */
export interface Plant extends PlantOptions {
  readonly plantId: PlantId;
  readonly contact: Contact;
  readonly lastWatered: Date;
}

/**
 * Plants get droopy and then depart if they aren't
 * watered frequently enough.
 */
export type PlantState = 'happy' | 'droopy' | 'departed';

/**
 * A plant has a species, such as "hosue plant" or "cactus",
 * which determines how it displays.
 */
export interface Species {
  readonly id: SpeciesId;
  readonly name: string;
  readonly appearances: Record<PlantState, PlantAppearance>;
}

/**
 * Represents in a Plant in a way that is
 * easier to use in the UI.
 */
export interface UIPlant {
  readonly plantId: PlantId;
  readonly contact: Contact;
  readonly appearance: PlantAppearance;
  readonly lastWatered: Date;
  readonly waterFrequency: WaterFrequency;
  readonly nextWatering: Date;
  readonly state: PlantState;
}

export type PlantId = string & {readonly plantIdBrand: unique symbol};
export type SpeciesId = string & {readonly speciesId: unique symbol};

export interface PlantAppearance {
  readonly kind: 'emoji';
  readonly emoji: string;
}

export interface WaterFrequency {
  readonly unit: 'days' | 'weeks' | 'months';
  readonly number: number;
}

type RootStackParamList = Readonly<{
  Home: undefined;
  PlantChoice:
    | {
        action: 'addPlant';
        contact: Contact;
      }
    | {action: 'updatePlant'; contact: Contact; plantId: PlantId};
  Plant: {
    plantId: PlantId;
  };
}>;

/**
 * Enables screens to have well-typed props
 */
export type ScreenProp<
  Screen extends keyof RootStackParamList
> = StackScreenProps<RootStackParamList, Screen>;
