import { Injectable } from '@angular/core';
import { WeatherService } from './weather.service';
import { TrackedLocation } from './conditions-and-zip.type';

export const LOCATIONS: string = 'locations';
export const TRACKEDLOCATIONS: string = 'trackedLocations';

@Injectable()
export class LocationService {
  locations: string[] = [];

  constructor(private weatherService: WeatherService) {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) this.locations = JSON.parse(locString);
    for (let loc of this.locations) this.weatherService.addCurrentConditions(loc);
  }

  addLocation(zipcode: string) {
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    this.weatherService.addCurrentConditions(zipcode);
  }

  removeLocation(zipcode: string) {
    let index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.weatherService.removeCurrentConditions(zipcode);
    }
  }

  addLocationToLocalStorage(trackedLocation: TrackedLocation): void {
    const savedLocations: TrackedLocation[] = JSON.parse(localStorage.getItem(TRACKEDLOCATIONS));
    if (savedLocations?.length == 0 || savedLocations?.find((location) => location.zip === trackedLocation.zip) === undefined) {
      const stringified = JSON.stringify([trackedLocation]);
      localStorage.setItem(TRACKEDLOCATIONS, stringified);
    }
  }

  getLocationsFromLocalStorage(): TrackedLocation[] {
    const savedLocations: TrackedLocation[] = JSON.parse(localStorage.getItem(TRACKEDLOCATIONS));
    return savedLocations ?? [];
  }

  removeLocationFromLocalSotage(zipcode: string): void {
    const savedLocations: TrackedLocation[] = JSON.parse(localStorage.getItem(TRACKEDLOCATIONS));
    const index = savedLocations?.findIndex((location) => location.zip === zipcode);
    if (index !== -1) {
      savedLocations.splice(index, 1);
      localStorage.setItem(TRACKEDLOCATIONS, JSON.stringify(savedLocations));
    }
  }
}
