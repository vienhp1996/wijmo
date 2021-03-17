import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { formatDataPipe } from './pipe/formatdata.pipe';
import { ListCheckBoxComponent } from './components/list-check-box/list-check-box.component';
import { FlexBoxComponent } from './components/flex-box/flex-box.component';
import { GridComponent } from './components/grid/grid.component';
import { NewGridComponent } from './components/new-grid/new-grid.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HighlightPipe } from './pipe/highlight.pipe';
// import Wijmo modules
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjChartModule } from '@grapecity/wijmo.angular2.chart';
import { WjGridSearchModule } from '@grapecity/wijmo.angular2.grid.search';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { HttpClientModule } from '@angular/common/http';
import { NorthwindComponent } from './components/northwind/northwind.component';
import { TriningComponent } from './components/trining/trining.component';
import { NorthwindTestComponent } from './components/northwind-test/northwind-test.component';
import { MyGrid } from './components/extend/extend.component';
@NgModule({
  declarations: [
    AppComponent,
    formatDataPipe,
    ListCheckBoxComponent,
    FlexBoxComponent,
    GridComponent,
    NewGridComponent,
    HighlightPipe,
    NorthwindComponent,
    TriningComponent,
    NorthwindTestComponent,
    MyGrid
  ],
  imports: [BrowserModule, ReactiveFormsModule, WjGridModule, WjChartModule, WjGridSearchModule, HttpClientModule, WjInputModule],
  providers: [HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule { }
