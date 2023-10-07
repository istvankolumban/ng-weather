import { Injectable } from '@angular/core';
import { TrackedLocation } from './tracked-location.type';

export const LOCATIONS: string = 'locations';

@Injectable()
export class LocalStorageService {
  addOrUpdateLocationToLocalStorage(location: TrackedLocation): void {
    const locations = this.getLocationsFromLocalStorage();
    if (locations.length == 0) {
      this.saveLocations([location]);
    } else {
      const locationIndex = this.getLocationIndex(locations, location.zip);
      if (locationIndex === -1) {
        locations.push(location);
      } else {
        locations[locationIndex] = location;
      }
      this.saveLocations(locations);
    }
  }

  removeLocationFromLocalSotage(zip: string): void {
    const locations = this.getLocationsFromLocalStorage();
    const index = this.getLocationIndex(locations, zip);
    if (index !== -1) {
      locations.splice(index, 1);
      this.saveLocations(locations);
    }
  }

  getLocationsFromLocalStorage(): TrackedLocation[] {
    const locations: TrackedLocation[] = JSON.parse(localStorage.getItem(LOCATIONS) ?? '[]');
    return locations;
  }

  private saveLocations(locations: TrackedLocation[]): void {
    localStorage.setItem(LOCATIONS, JSON.stringify(locations));
  }

  private getLocationIndex(locations: TrackedLocation[], zip: string): number {
    return locations.findIndex((loc) => loc.zip === zip);
  }
}
