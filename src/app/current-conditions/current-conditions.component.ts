import { Component, effect, EffectRef, OnDestroy, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { TrackedLocation } from '../tracked-location.type';
import { DataService } from 'app/data.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
})
export class CurrentConditionsComponent implements OnDestroy {
  protected trackedLocations: Signal<TrackedLocation[]> = this.dataService.getLocations();
  protected activatedTabIndex = -1;
  private effectRef: EffectRef;

  constructor(private dataService: DataService, private router: Router) {
    let zipFormRouter = this.getZipFromRouter();
    this.initActivatedTabIndex(zipFormRouter);
  }

  getWeatherIcon(id: string): string {
    return this.dataService.getWeatherIcon(id);
  }

  onRemoved(index: number): void {
    const locationZipToRemove = this.trackedLocations()[index]?.zip;
    if (locationZipToRemove) {
      this.dataService.removeLocation(locationZipToRemove);
    }
  }

  onSelected(index: number): void {
    this.activatedTabIndex = index;
  }

  private getZipFromRouter(): string {
    let zipFormRouter = '';
    const state = this.router.getCurrentNavigation().extras.state;
    if (state && state.data) {
      zipFormRouter = state.data.zip;
    }
    return zipFormRouter;
  }

  private initActivatedTabIndex(zipFormRouter: string): void {
    this.effectRef = effect(() => {
      if (this.trackedLocations().length > 0) {
        if (zipFormRouter) {
          this.activatedTabIndex = this.trackedLocations().findIndex((loc) => loc.zip === zipFormRouter);
        }
        if (this.activatedTabIndex === -1) {
          this.activatedTabIndex = 0;
        }
        this.effectRef.destroy();
      }
    });
  }

  ngOnDestroy(): void {
    this.effectRef.destroy();
  }
}
