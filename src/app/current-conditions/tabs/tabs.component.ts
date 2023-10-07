import { Component, ContentChildren, EventEmitter, Output, QueryList } from '@angular/core';
import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
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
