import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from './tab/tab.component';
import { DataService } from 'app/data.service';

@Component({
  selector: 'app-tabs',
  template: `
    <ul class="nav nav-tabs">
      <li
        *ngFor="let tab of tabs"
        (click)="selectTab(tab)"
        class="nav-item"
        [class.active]="tab.activated"
      >
        <a
          href="#"
          class="nav-link"
          >{{ tab.title }}<span
            class="close"
            (click)="closeLocation(1001)"
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

  constructor(private dataService: DataService) {

  }

  ngAfterContentInit(): void {
    if (this.tabs.length > 0) {
      let activatedTabs = this.tabs.filter((tab) => tab.activated);

      if (activatedTabs.length === 0) {
        this.selectTab(this.tabs.toArray()[0]);
      }
    }
  }

  selectTab(tab: TabComponent): void {
    this.tabs.forEach((tab) => (tab.activated = false));
    tab.activated = true;
  }

  closeLocation(zipcode: string) {
    this.dataService.removeLocation(zipcode);
  }
}
