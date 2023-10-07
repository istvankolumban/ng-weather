import { Component } from '@angular/core';
import { DataService } from 'app/data.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
})
export class ZipcodeEntryComponent {
  constructor(private dataService: DataService) {}

  addLocation(zipcode: string) {
    if (zipcode) {
      this.dataService.addLocation(zipcode);
    }
  }
}
