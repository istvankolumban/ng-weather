import { Component, ContentChildren, EventEmitter, Output, QueryList } from '@angular/core';
import { TabComponent } from './tab/tab.component';

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
            (click)="closeTab(tab.index)"
            >&times;</span
          ></a
        >
      </li>
    </ul>
    <ng-content></ng-content>
  `,
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent {
  @Output() removeEvent = new EventEmitter<number>();
  @Output() selectEvent = new EventEmitter<number>();

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  selectTab(tab: TabComponent): void {
    this.selectEvent.emit(tab.index);
  }

  closeTab(index: number) {
    this.removeEvent.emit(index);
  }
}
