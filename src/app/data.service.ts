import { Injectable, OnDestroy, Signal, signal } from '@angular/core';
import { TrackedLocation } from './conditions-and-zip.type';
import { LocationService } from './location.service';
import { WeatherService } from './weather.service';
import { Forecast } from './forecasts-list/forecast.type';
import { Observable, combineLatest, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService implements OnDestroy {
  private locations = signal<TrackedLocation[]>([]);
  private timers: Array<{
    zip: string;
    timerId: number;
  }> = [];

  constructor(private locationService: LocationService, private weatherService: WeatherService) {
    const locationsFromStorage = this.locationService.getLocationsFromLocalStorage();
    locationsFromStorage.forEach((loc: TrackedLocation) => {
      this.registerTimer(loc.zip);
    })
    this.locations.set(locationsFromStorage);
  }

  addLocation(zip: string): void {
    if (!this.locationIsTracked(zip)) {
      this.createOrUpdateLocation(zip);
      this.registerTimer(zip);
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
    this.clearTimer(zip);
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
      return of(location.forecast);
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

  private createOrUpdateLocation(zip): void {
    combineLatest([this.weatherService.getCurrentCondition(zip), this.weatherService.getForecast(zip)])
      .subscribe(([currentConditions, forecast]) => {
        const trackedLocation = {
          zip,
          currentConditions,
          forecast,
        };
        const locationIndex = this.locationIndex(zip);
        if (locationIndex === -1) {
          this.locations.mutate((locations) => locations.push(trackedLocation));
        } else {
          this.locations.mutate((locations) => (locations[locationIndex] = trackedLocation));
        }
        this.locationService.addOrUpdateLocationToLocalStorage(trackedLocation);
      });
  }

  private registerTimer(zip: string): void {
    const timerId = window.setInterval(() => {
      this.createOrUpdateLocation(zip);
    }, 5000);

    this.timers.push({
      zip,
      timerId,
    });
  }

  private clearTimer(zip: string): void {
    const timerIndex = this.timers.findIndex((timer) => timer.zip === zip);
    clearInterval(this.timers[timerIndex].timerId);
    this.timers.splice(timerIndex, 1);
  }

  ngOnDestroy(): void {
    this.timers.forEach((timer) => {
      clearInterval(timer.timerId);
    })
    this.timers = [];
  }
}
