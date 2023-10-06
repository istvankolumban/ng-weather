import { Injectable } from '@angular/core';
import { TrackedLocation } from './conditions-and-zip.type';

export const LOCATIONS: string = 'locations';

@Injectable()
export class LocationService {
  addOrUpdateLocationToLocalStorage(location: TrackedLocation): void {
    const locations = this.getLocationsFromLocalStorage();
    if (locations.length == 0) {
      // create locations and add
      this.saveLocations([location]);
    } else {
      const locationIndex = locations.findIndex((loc) => loc.zip === location.zip);
      if (locationIndex === -1) {
        locations.push(location);
      } else {
        locations[locationIndex] = location;
      }
      this.saveLocations(locations);
    }
  }

  removeLocationFromLocalSotage(zipcode: string): void {
    const locations = this.getLocationsFromLocalStorage();
    const index = locations.findIndex((loc) => loc.zip === zipcode);
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
}
