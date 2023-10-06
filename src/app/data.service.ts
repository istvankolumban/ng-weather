import { Injectable, Signal, signal } from '@angular/core';
import { TrackedLocation } from './conditions-and-zip.type';
import { LocationService } from './location.service';
import { WeatherService } from './weather.service';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { Forecast } from './forecasts-list/forecast.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private locations = signal<TrackedLocation[]>([]);

  constructor(private locationService: LocationService, private weatherService: WeatherService) {
    this.locations.set(this.locationService.getLocationsFromLocalStorage());
  }

  addLocation(zip: string): void {
    if (this.locations().find((location: TrackedLocation) => location.zip === zip) === undefined) {
      this.weatherService.getCurrentCondition(zip).subscribe((currentConditions: CurrentConditions) => {
        const trackedLocation = {
          zip,
          currentConditions,
          forecast: undefined,
          lastRefreshed: new Date(),
        };
        this.locations.mutate((locations) => locations.push(trackedLocation));

        this.locationService.addLocationToLocalStorage(trackedLocation);
      });
    }
  }

  removeLocation(zip: string): void {
    this.locations.mutate((locations) => {
      for (let i in locations) {
        if (locations[i].zip == zip) {
          locations.splice(+i, 1);
        }
      }
    });
    this.locationService.removeLocationFromLocalSotage(zip);
  }

  getLocations(): Signal<TrackedLocation[]> {
    return this.locations.asReadonly();
  }

  getWeatherIcon(id: string): string {
    return this.weatherService.getWeatherIcon(id);
  }

  getForecast(zip: string): Observable<Forecast> {
    return this.weatherService.getForecast(zip); // temporary logic, just return the forecast for now. Later implement the save and retrieve.
  }
}
