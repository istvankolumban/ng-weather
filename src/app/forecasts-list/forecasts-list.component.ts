import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Forecast } from './forecast.type';
import { DataService } from 'app/data.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
})
export class ForecastsListComponent {
  zipcode: string;
  forecast: Forecast;

  constructor(route: ActivatedRoute, private dataService: DataService, private router: Router) {
    route.params
      .pipe(
        switchMap((params) => {
          this.zipcode = params['zipcode'];
          return this.dataService.getForecast(this.zipcode);
        })
      )
      .subscribe((forecast: Forecast) => {
        this.forecast = forecast;
      });
  }

  navigateBack() {
    const dataToSend = { zip: this.zipcode };
    this.router.navigate(['/'], { state: { data: dataToSend } });
  }
}
