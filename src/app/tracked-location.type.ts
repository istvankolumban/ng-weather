import { CurrentConditions } from './current-conditions/current-conditions.type';
import { Forecast } from './forecasts-list/forecast.type';

export interface TrackedLocation {
  zip: string;
  currentConditions: CurrentConditions;
  forecast: Forecast;
}
