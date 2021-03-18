import { ChangeDetectorRef, Component, ElementRef, forwardRef, Inject, Injector, Optional, SkipSelf } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as input from '@grapecity/wijmo.input';
import { WjFlexGrid, wjFlexGridMeta } from '@grapecity/wijmo.angular2.grid';
import { Customer, dataType } from '../../interface/northwind'
import { NorthwindService } from '../../services/northwind.service';

@Component({
  selector: 'app-extend',
  templateUrl: './extend.component.html',
  styleUrls: ['./extend.component.scss'],
  providers: [
    { provide: 'WjComponent', useExisting: forwardRef(() => MyGrid) }
  ]
})

export class MyGrid extends wjcGrid.FlexGrid {
  grid = {
    title: dataType.Customer,
    column: [
      {
        header: 'Id',
        binding: 'id',
        width: 150
      },
      {
        header: 'Tên liên lạc',
        binding: 'contactName',
        width: 250
      },
      {
        header: 'Thông tin liên lạc',
        binding: 'contactTitle',
        width: 250
      },
      {
        header: 'Tên công ty',
        binding: 'companyName',
        width: '*'
      },
      {
        header: 'Thành phố',
        binding: 'city',
        width: 150
      },
      {
        header: 'Địa chỉ',
        binding: 'address',
        width: 150
      },
      {
        header: 'Số ĐT',
        binding: 'phone',
        width: 150
      }
    ],
    class: 'class-customer',
    properties: {
      allowResizing: 0,
      isReadOnly: true,
      headersVisibility: 1,
      autoGenerateColumns: false,
      allowSorting: 0
    }
  }
  callingApi;

  constructor(element: HTMLElement) {
    super(element);

    // this.callingApi = this._northwindService.getListCities().subscribe(
    //   data => {
    //     this.callingApi = null;
    //     let response: Array<Customer> = data['results'];
    //     this.initialize({ columns: this.grid.column })
    //     if (this.grid.properties) {
    //       this.autoGenerateColumns = this.grid.properties.autoGenerateColumns;
    //       this.isReadOnly = this.grid.properties.isReadOnly;
    //       this.headersVisibility = this.grid.properties.headersVisibility;
    //     }
    //     this.itemsSource = response;
    //     this.formatItem.addHandler(this.centerCell.bind(null));
    //   }
    // );
    // initialize control options
  }

  onResizingColumn(pEvent: wjcGrid.CellRangeEventArgs): boolean {
    super.onResizingColumn(pEvent);
    if (pEvent.col === 1) {
      pEvent.cancel = true;
      return false;
    }
    return true;
  }

  onResizedColumn(pEvent: wjcGrid.CellRangeEventArgs) {
    console.log('resized');
  }

  getMergedRange(panel: wjcGrid.GridPanel, r: number, c: number, clip = true): wjcGrid.CellRange {
    // create basic cell range
    var rg = new wjcGrid.CellRange(r, c);

    // expand left/right
    for (var i = rg.col; i < panel.columns.length - 1; i++) {
      if (panel.getCellData(rg.row, i, true) != panel.getCellData(rg.row, i + 1, true)) break;
      rg.col2 = i + 1;
    }
    for (var i = rg.col; i > 0; i--) {
      if (panel.getCellData(rg.row, i, true) != panel.getCellData(rg.row, i - 1, true)) break;
      rg.col = i - 1;
    }

    // expand up/down
    for (var i = rg.row; i < panel.rows.length - 1; i++) {
      if (panel.getCellData(i, rg.col, true) != panel.getCellData(i + 1, rg.col, true)) break;
      rg.row2 = i + 1;
    }
    for (var i = rg.row; i > 0; i--) {
      if (panel.getCellData(i, rg.col, true) != panel.getCellData(i - 1, rg.col, true)) break;
      rg.row = i - 1;
    }
    return rg;
  }

  centerCell(pGrid: wjcGrid.FlexGrid, pEvent: wjcGrid.FormatItemEventArgs) {
    if (!pEvent.range.isSingleCell) {
      pEvent.cell.innerHTML = '<div>' + pEvent.cell.innerHTML + '</div>';
      wjcCore.setCss(pEvent.cell, { display: 'table' });
      wjcCore.setCss(pEvent.cell.children[0], {
        display: 'table-cell',
        textAlign: 'center',
        verticalAlign: 'middle'
      });
    }
  }
}


