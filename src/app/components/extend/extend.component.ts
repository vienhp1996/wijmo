import { ChangeDetectorRef, Component, ElementRef, forwardRef, Inject, Injector, Optional, SkipSelf } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { WjFlexGrid, wjFlexGridMeta } from '@grapecity/wijmo.angular2.grid';
import { Customer, dataType } from '../../interface/northwind'
import { NorthwindService } from '../../services/northwind.service';
import { CustomMergeManager } from './CustomMergeManager';

@Component({
  selector: 'app-extend',
  templateUrl: './extend.component.html',
  styleUrls: ['./extend.component.scss'],
  providers: [
    { provide: 'WjComponent', useExisting: forwardRef(() => MyGrid) },
    ...wjFlexGridMeta.providers
  ]
})
export class MyGrid extends WjFlexGrid {
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

  constructor(@Inject(ElementRef) elRef: ElementRef,
    @Inject(Injector) injector: Injector,
    @Inject('WjComponent') @SkipSelf() @Optional() parentCmp: any,
    @Inject(ChangeDetectorRef) cdRef: ChangeDetectorRef, private _northwindService: NorthwindService) {
    super(elRef, injector, parentCmp, cdRef);
    this.callingApi = this._northwindService.getListCities().subscribe(
      data => {
        this.callingApi = null;
        let respon: Array<Customer> = data['results'];
        this.initialize({ columns: this.grid.column })
        this.autoGenerateColumns = this.grid.properties.autoGenerateColumns;
        this.itemsSource = respon;
        this.isReadOnly = this.grid.properties.isReadOnly;
        this.headersVisibility = this.grid.properties.headersVisibility;
        // console.log(this);
        this.mergeManager = new CustomMergeManager(this)
      }
    );
  }

  onResizingColumn(pEvent: wjcGrid.CellRangeEventArgs): boolean {
    if (pEvent.col === 1) {
      pEvent.cancel = true;
      return false;
    }
    return true;
  }

  onResizedColumn(pEvent: wjcGrid.CellRangeEventArgs) {
    console.log('resized');
  }
}
