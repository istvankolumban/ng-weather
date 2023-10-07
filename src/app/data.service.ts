import { Injectable, OnDestroy, Signal, signal } from '@angular/core';
import { TrackedLocation } from './conditions-and-zip.type';
import { LocationService } from './location.service';
import { WeatherService } from './weather.service';
import { Forecast } from './forecasts-list/forecast.type';
import { Observable, Subscription, combineLatest, interval, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService implements OnDestroy {
  private static REFRESH_TIME: number = 10000; //2*60*60*1000;
  private locations = signal<TrackedLocation[]>([]);

  private trackedSubscriptions: Array<{
    zip: string;
    subscription: Subscription
  }> = [];

  constructor(private locationService: LocationService, private weatherService: WeatherService) {
    const locationsFromStorage = this.locationService.getLocationsFromLocalStorage();
    locationsFromStorage.forEach((loc: TrackedLocation) => {
      this.createOrUpdateLocation(loc.zip);
    });
  }

  addLocation(zip: string): void {
    if (!this.locationIsTracked(zip)) {
      this.createOrUpdateLocation(zip);
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
    this.unsubscribeFromSubscription(zip);
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
    const subscription = interval(DataService.REFRESH_TIME).pipe(
      startWith(0),
      switchMap(() =>
        combineLatest([this.weatherService.getCurrentCondition(zip), this.weatherService.getForecast(zip)])
      )
    ).subscribe(([currentConditions, forecast]) => {
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

    this.trackedSubscriptions.push({
      zip,
      subscription
    });
  }

  private unsubscribeFromSubscription(zip: string): void {
    const subscriptionIndex = this.trackedSubscriptions.findIndex((subscription) => subscription.zip === zip);
    this.trackedSubscriptions[subscriptionIndex].subscription.unsubscribe();
    this.trackedSubscriptions.splice(subscriptionIndex, 1);
  }

  ngOnDestroy(): void {
    this.trackedSubscriptions.forEach((subscription) => {
      this.unsubscribeFromSubscription(subscription.zip)
    })
    this.trackedSubscriptions = [];
  }
}
