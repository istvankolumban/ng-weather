import { Injectable, Signal, signal } from '@angular/core';
import { TrackedLocation } from './conditions-and-zip.type';
import { LocationService } from './location.service';
import { WeatherService } from './weather.service';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { Forecast } from './forecasts-list/forecast.type';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private locations = signal<TrackedLocation[]>([]);
  private timers: Array<{
    zip: string;
    timerId: number;
  }> = [];

  constructor(private locationService: LocationService, private weatherService: WeatherService) {
    this.locations.set(this.locationService.getLocationsFromLocalStorage());
  }

  addLocation(zip: string): void {
    if (!this.locationIsTracked(zip)) {
      this.weatherService.getCurrentCondition(zip).subscribe((currentConditions: CurrentConditions) => {
        const trackedLocation = {
          zip,
          currentConditions,
          forecast: undefined,
          lastRefreshed: new Date(),
        };
        this.locations.mutate((locations) => locations.push(trackedLocation));

        this.locationService.addOrUpdateLocationToLocalStorage(trackedLocation);

        const timerId = window.setInterval(() => {
          this.refreshLocation(zip);
        }, 5000);

        this.timers.push({
          zip,
          timerId,
        });
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

    const timerIndex = this.timers.findIndex((timer) => timer.zip === zip);
    clearInterval(this.timers[timerIndex].timerId);
    this.timers.splice(timerIndex, 1);
  }

  getLocations(): Signal<TrackedLocation[]> {
    return this.locations.asReadonly();
  }

  getWeatherIcon(id: string): string {
    return this.weatherService.getWeatherIcon(id);
  }

  getForecast(zip: string): Observable<Forecast> {
    if (this.locationIsTracked(zip)) {
      const location: TrackedLocation = this.getLocation(zip);
      if (location?.forecast) {
        return of(location.forecast);
      } else {
        return this.weatherService.getForecast(zip).pipe(
          tap((forecast: Forecast) => {
            location.forecast = forecast;
            this.locationService.addOrUpdateLocationToLocalStorage(location);
          })
        );
      }
    }
  }

  private locationIsTracked(zip: string): boolean {
    return this.locations().findIndex((loc: TrackedLocation) => loc.zip === zip) !== -1;
  }

  private locationIndex(zip: string): number {
    return this.locations().findIndex((loc: TrackedLocation) => loc.zip === zip);
  }

  private getLocation(zip): TrackedLocation {
    return this.locations().find((loc: TrackedLocation) => loc.zip === zip);
  }

  private refreshLocation(zip): void {
    this.weatherService.getCurrentCondition(zip).subscribe((currentConditions: CurrentConditions) => {
      const trackedLocation = {
        zip,
        currentConditions,
        forecast: undefined,
        lastRefreshed: new Date(),
      };
      const locationIndex = this.locationIndex(zip);
      this.locations.mutate((locations) => (locations[locationIndex] = trackedLocation));
      this.locationService.addOrUpdateLocationToLocalStorage(trackedLocation);
    });
  }
}
