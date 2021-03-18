import { NgModule } from '@angular/core';
// import Wijmo modules
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjChartModule } from '@grapecity/wijmo.angular2.chart';
import { WjGridSearchModule } from '@grapecity/wijmo.angular2.grid.search';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';

@NgModule({
  declarations: [],
  imports: [
    WjGridModule,
    WjChartModule,
    WjGridSearchModule,
    WjInputModule
  ],
  exports: [
    WjGridModule,
    WjChartModule,
    WjGridSearchModule,
    WjInputModule
  ]
})
export class WijmoModule { }
