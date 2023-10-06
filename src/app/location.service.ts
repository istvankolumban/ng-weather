import { Injectable } from '@angular/core';
import { TrackedLocation } from './conditions-and-zip.type';

export const LOCATIONS: string = 'locations';
export const TRACKEDLOCATIONS: string = 'trackedLocations';

@Injectable()
export class LocationService {
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
