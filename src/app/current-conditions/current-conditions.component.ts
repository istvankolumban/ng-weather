import { Component, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { TrackedLocation } from '../conditions-and-zip.type';
import { DataService } from 'app/data.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
})
export class CurrentConditionsComponent {
  private router = inject(Router);
  protected trackedLocations: Signal<TrackedLocation[]> = this.dataService.getLocations();

  constructor(private dataService: DataService) {}

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode]);
  }

  getWeatherIcon(id): string {
    return this.dataService.getLocationImage(id);
  }
}
