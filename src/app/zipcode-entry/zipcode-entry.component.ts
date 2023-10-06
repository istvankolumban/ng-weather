import { Component } from '@angular/core';
import { LocationService } from '../location.service';
import { DataService } from 'app/data.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
})
export class ZipcodeEntryComponent {
  constructor(private service: LocationService, private dataService: DataService) {}

  addLocation(zipcode: string) {
    this.dataService.addLocation(zipcode);
  }
}
