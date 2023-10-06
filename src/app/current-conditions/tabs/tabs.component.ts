import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from './tab/tab.component';
import { LocationService } from 'app/location.service';

@Component({
  selector: 'app-tabs',
  template: `
    <ul class="nav nav-tabs">
      <li
        *ngFor="let tab of tabs"
        (click)="selectTab(tab)"
        class="nav-item"
        [class.active]="tab.active"
      >
        <a
          href="#"
          class="nav-link"
          >{{ tab.title }} ({{ tab.zipcode }})<span
            class="close"
            (click)="closeLocation(tab.zipcode)"
            >&times;</span
          ></a
        >
      </li>
    </ul>
    <ng-content></ng-content>
  `,
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  constructor(private locationService: LocationService) {}

  ngAfterContentInit(): void {
    // This have to be refactored later. The goal is to remove the setTimeout
    setTimeout(() => { 
      if (this.tabs.length > 0) {
        let activatedTabs = this.tabs.filter((tab) => tab.activated);

        if (activatedTabs.length === 0) {
          this.selectTab(this.tabs.toArray()[0]);
        }
      }
    }, 500);
  }

  selectTab(tab: TabComponent): void {
    this.tabs.forEach((tab) => (tab.activated = false));
    tab.activated = true;
  }

  closeLocation(zipcode: string) {
    this.locationService.removeLocation(zipcode);
  }
}
