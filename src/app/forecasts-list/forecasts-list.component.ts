import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Forecast } from './forecast.type';
import { DataService } from 'app/data.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
})
export class ForecastsListComponent {
  forecast: Forecast;

  constructor(route: ActivatedRoute, private dataService: DataService) {
    route.params
      .pipe(
        switchMap((params) => {
          const zipcode = params['zipcode'];
          return this.dataService.getForecast(zipcode);
        })
      )
      .subscribe((forecast: Forecast) => {
        this.forecast = forecast;
      });
  }
}
