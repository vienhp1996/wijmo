import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NorthwindComponent } from './northwind/northwind.component';
import { TriningComponent } from './trining/trining.component';
import { NorthwindTestComponent } from './northwind-test/northwind-test.component';
import { MyGrid } from './extend/extend.component';
import { ListCheckBoxComponent } from './list-check-box/list-check-box.component';
import { FlexBoxComponent } from './flex-box/flex-box.component';
import { GridComponent } from './grid/grid.component';
import { NewGridComponent } from './new-grid/new-grid.component';
import { ReactiveFormsModule } from '@angular/forms';
import { formatDataPipe } from '../pipe/formatdata.pipe';
import { HighlightPipe } from '../pipe/highlight.pipe';
import { WijmoModule } from '../wijmo/wijmo.module';

@NgModule({
  declarations: [
    ListCheckBoxComponent,
    FlexBoxComponent,
    GridComponent,
    NewGridComponent,
    NorthwindComponent,
    TriningComponent,
    NorthwindTestComponent,
    MyGrid,
    formatDataPipe,
    HighlightPipe,
  ],
  imports: [
    ReactiveFormsModule,
    WijmoModule,
    CommonModule
  ],
  exports: [
    ListCheckBoxComponent,
    FlexBoxComponent,
    GridComponent,
    NewGridComponent,
    NorthwindComponent,
    TriningComponent,
    NorthwindTestComponent,
    MyGrid
  ]
})
export class TrainingModule { }
