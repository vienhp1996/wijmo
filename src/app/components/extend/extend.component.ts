import { ChangeDetectorRef, Component, ElementRef, forwardRef, Inject, Injectable, Injector, Optional, SkipSelf } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { WjFlexGrid, wjFlexGridMeta } from '@grapecity/wijmo.angular2.grid';
import { Customer, Order, OrderDetail, Grid, dataType } from '../../interface/northwind'
import { NorthwindService } from '../../services/northwind.service';

@Component({
  selector: 'app-extend',
  templateUrl: './extend.component.html',
  styleUrls: ['./extend.component.scss'],
  providers: [
    { provide: 'WjComponent', useExisting: forwardRef(() => MyGrid) },
    ...wjFlexGridMeta.providers
  ]
})
@Injectable()
export class MyGrid extends WjFlexGrid {
  grid = {
    title: dataType.Customer,
    column: [
      {
        header: 'Id',
        binding: 'id',
        width: 100
      },
      {
        header: 'Tên liên lạc',
        binding: 'contactName',
        width: '*'
      },
      {
        header: 'Thông tin liên lạc',
        binding: 'contactTitle',
      },
      {
        header: 'Tên công ty',
        binding: 'companyName',
      },
      {
        header: 'Thành phố',
        binding: 'city',
      },
      {
        header: 'Địa chỉ',
        binding: 'address',
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
        this.autoGenerateColumns = false;
        this.initialize({ columns: this.grid.column })
        this.itemsSource = respon;
        this.isReadOnly = true;
        console.log(this);
      }
    );
  }

  ngOnInit() {
  }

}
