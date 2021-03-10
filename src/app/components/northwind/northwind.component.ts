import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { NorthwindService } from '../../services/northwind.service';
import { Customer, Order, OrderDetail, Column } from '../../interface/northwind'
import { Subject, Subscription } from 'rxjs';
import { switchMap, filter, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-northwind',
  templateUrl: './northwind.component.html',
  styleUrls: ['./northwind.component.scss']
})

export class NorthwindComponent implements OnInit {
  @ViewChild('gridCusomter', { static: false }) gridCusomter: wjcGrid.FlexGrid;
  @ViewChild('gridOrders', { static: false }) gridOrders: wjcGrid.FlexGrid;
  @ViewChild('gridOrderDetail', { static: false }) gridOrderDetail: wjcGrid.FlexGrid;
  @ViewChild('gridCity', { static: false }) gridCity: wjcGrid.FlexGrid;

  customersData: wjcCore.CollectionView<Customer>;
  ordersData: wjcCore.CollectionView<Order>;
  orderDetailData: wjcCore.CollectionView<OrderDetail>;
  citiesData: wjcCore.CollectionView<any>;

  callingApi;
  listColumnsCities: Array<Column> = [
    {
      header: 'Thành phố',
      binding: 'city',
      width: '*'
    }
  ]
  listColumnsCustomer: Array<Column> = [
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
  ]
  listColumnsOrder: Array<Column> = [
    {
      header: 'Id',
      binding: 'id',
      width: 75
    },
    {
      header: 'Mã KH',
      binding: 'customerId',
      width: 75
    },
    {
      header: 'Ngày đặt',
      binding: 'orderDate',
    },
    {
      header: 'Hàng hóa',
      binding: 'freight',
      width: '*'
    },
  ]
  listColumnsOrderDetail: Array<Column> = [
    {
      header: 'Id',
      binding: 'orderId',
      width: 75
    },
    {
      header: 'Mã SP',
      binding: 'productId',
      width: '*',
    },
    {
      header: 'Số lượng',
      binding: 'quantity',
      width: 75
    },
    {
      header: 'Giá bán',
      binding: 'unitPrice',
    }
  ]
  subscriptions: Subscription[] = []
  columnOrderLayout;
  columnOrderDetailLayout;
  columnCustomerLayout;
  componentDestroyed$: Subject<boolean> = new Subject()

  constructor(private _northwindService: NorthwindService) {
    this.customersData = new wjcCore.CollectionView([]);
    this.ordersData = new wjcCore.CollectionView([]);
    this.orderDetailData = new wjcCore.CollectionView([]);
    this.citiesData = new wjcCore.CollectionView([]);

    this._northwindService.getListCities().pipe(takeUntil(this.componentDestroyed$)).subscribe(
      data => {
        let respon: Array<Customer> = data['results'];
        let unique = [...new Set(respon.map((item: Customer) => item.city))];
        unique.unshift('');
        let list = [];
        for (let i = 0; i < unique.length; i++) {
          list.push({ city: unique[i] })
        }
        this.citiesData.sourceCollection = list;
        this.getColumnLayout();
      }
    );
  }

  getColumnLayout() {
    this.columnCustomerLayout = this.gridCusomter.columnLayout;
    this.columnOrderLayout = this.gridOrders.columnLayout;
    this.columnOrderDetailLayout = this.gridOrderDetail.columnLayout;
  }

  ngOnInit() { }

  initialized(type: string) {
    switch (type) {
      case 'city':
        this.gridCity.initialize({ columns: this.listColumnsCities })
        // this.gridCity.cells[0].visible = false;
        this.gridCity.collectionView.currentChanged.addHandler((pGrid: wjcCore.CollectionView, pEvent: wjcCore.EventArgs) => {
          this.handleCurrentChaned.call(this, pGrid, pEvent, type);
        })
        this.gridCity.beginningEdit.addHandler((pGrid: wjcGrid.FlexGrid, pEvent: wjcGrid.CellRangeEventArgs) => {
          pEvent.cancel = true;
        });
        break;

      case 'customer':
        this.gridCusomter.initialize({ columns: this.listColumnsCustomer })
        this.gridCusomter.collectionView.currentChanged.addHandler((pGrid: wjcCore.CollectionView, pEvent: wjcCore.EventArgs) => {
          this.handleCurrentChaned.call(this, pGrid, pEvent, type);
        })
        this.gridCusomter.beginningEdit.addHandler((pGrid: wjcGrid.FlexGrid, pEvent: wjcGrid.CellRangeEventArgs) => {
          pEvent.cancel = true;
        });
        break;

      case 'order':
        this.gridOrders.initialize({ columns: this.listColumnsOrder })
        this.gridOrders.beginningEdit.addHandler((pGrid: wjcGrid.FlexGrid, pEvent: wjcGrid.CellRangeEventArgs) => {
          pEvent.cancel = true;
        });
        break;

      case 'detail':
        this.gridOrderDetail.initialize({ columns: this.listColumnsOrderDetail })
        break;
    }
  }

  handleCurrentChaned(pGrid: wjcCore.CollectionView, pEvent: wjcCore.EventArgs, type: string) {
    if (this.callingApi) { this.callingApi.unsubscribe(); }
    switch (type) {
      case 'city':
        // this.componentDestroyed$.next(true)
        // this.componentDestroyed$.complete()
        // console.log(this.componentDestroyed$);
        this.getCustomerData.call(this, pGrid.currentItem.city);
        break;

      case 'customer':
        if (pGrid.currentItem) { this.getOrdersData.call(this, pGrid.currentItem.id); }
        break;

      case 'order':
        if (pGrid.currentItem) { this.getOrderDetailData.call(this, pGrid.currentItem.id, pGrid.currentItem.customerId); }
        break;
    }
  }

  getCustomerData(pCity: string) {
    this.callingApi = this._northwindService.getListCusomtersByCity(pCity).subscribe((resp) => {
      this.callingApi = null;
      let data: Array<any> = resp['results'];
      this.customersData.sourceCollection = data;
      this.gridCusomter.columnLayout = this.columnCustomerLayout;
    });
  }

  getOrdersData(pCustomerId: string) {
    this.callingApi = this._northwindService.getListOrdersByCustomer(pCustomerId).subscribe((resp) => {
      this.callingApi = null;
      let data: Array<any> = resp['results'];
      let listOrders: Array<Order> = [];

      for (let i = 0; i < data.length; i++) {
        data[i].order.orderDate = this.formatDateFromServer(data[i].order.orderDate);
        listOrders.push(data[i].order);
      }

      if (listOrders.length) {
        this.gridOrders.itemsSource = listOrders;
        this.gridOrders.columnLayout = this.columnOrderLayout;
        this.getOrderDetailData.call(this, this.gridOrders.collectionView.currentItem.id, this.gridOrders.collectionView.currentItem.customerId);
        this.gridOrders.collectionView.currentChanged.addHandler((pGrid: wjcCore.CollectionView, pEvent: wjcCore.EventArgs) => {
          this.handleCurrentChaned.call(this, pGrid, pEvent, 'order');
        })
        return
      }

      this.gridOrders.itemsSource = [];
      this.gridOrderDetail.itemsSource = [];
    })
  }

  getOrderDetailData(pOrderDetailId: number, pCustomerId) {
    this.callingApi = this._northwindService.getListOrdersByCustomer(pCustomerId).subscribe((resp) => {
      this.callingApi = null;
      let data: Array<any> = resp['results'];
      let listOrderDetail: Array<OrderDetail> = []
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].orderDetails.length; j++) {
          listOrderDetail.push(data[i].orderDetails[j]);
        }
      }
      let listDetail = listOrderDetail.filter((item: OrderDetail) => item.orderId === pOrderDetailId);
      this.gridOrderDetail.itemsSource = listDetail;
      this.gridOrderDetail.columnLayout = this.columnOrderDetailLayout;
    })
  }

  formatDateFromServer(pString: String): Date {
    if (pString) {
      let zStringDate = pString.substring(pString.lastIndexOf("(") + 1, pString.lastIndexOf("-"))
      return new Date(parseInt(zStringDate));
    }
    return null
  }

  ngOnDestroy(): void {
    // for (let i = 0; i < this.subscriptions.length; i++) {
    //   this.subscriptions[i].unsubscribe();
    // }
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
    this.callingApi.unsubscribe();
    this.gridCity.removeEventListener();
    this.gridCusomter.removeEventListener();
    this.gridOrders.removeEventListener();
    this.customersData.currentChanged.removeAllHandlers();
    this.ordersData.currentChanged.removeAllHandlers();
    this.citiesData.currentChanged.removeAllHandlers();
  }
}
