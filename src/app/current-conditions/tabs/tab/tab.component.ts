import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab',
  template: `
    <div *ngIf="activated">
      <ng-content></ng-content>
    </div>
  `,
})
export class TabComponent {
  @Input() title = '';
  @Input() zipcode = '';
  activated = false;
}
