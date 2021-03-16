import { Component } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { NorthwindService } from '../../services/northwind.service';
import { Customer, Order, OrderDetail, Grid, dataType } from '../../interface/northwind'

@Component({
  selector: 'app-northwind-test',
  templateUrl: './northwind-test.component.html',
  styleUrls: ['./northwind-test.component.scss']
})

export class NorthwindTestComponent {
  callingApi;
  listGrid: Array<Grid> = [
    {
      title: dataType.City,
      column: [
        {
          header: 'Thành phố',
          binding: 'id',
          width: '*'
        }
      ],
      class: 'class-city',
      properties: {
        allowResizing: 0,
        isReadOnly: true,
        headersVisibility: 1,
        autoGenerateColumns: false,
        allowSorting: 0
      },
      child: dataType.Customer
    },
    {
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
      },
      child: dataType.Order
    },
    {
      title: dataType.Order,
      column: [
        {
          header: 'Id',
          binding: 'id',
          width: 125,
          format: 'd'
        },
        {
          header: 'Mã KH',
          binding: 'customerId',
          width: 125
        },
        {
          header: 'Ngày đặt',
          binding: 'orderDate',
        },
        {
          header: 'Hàng hóa',
          binding: 'freight',
          width: '*',
          format: 'n1'
        },
      ],
      class: 'class-order',
      properties: {
        allowResizing: 0,
        isReadOnly: true,
        headersVisibility: 1,
        autoGenerateColumns: false,
        allowSorting: 0
      },
      child: dataType.OrderDetail
    },
    {
      title: dataType.OrderDetail,
      column: [
        {
          header: 'Id',
          binding: 'orderId',
          width: 125,
        },
        {
          header: 'Mã SP',
          binding: 'productId',
          width: '*',
        },
        {
          header: 'Số lượng',
          binding: 'quantity',
          width: 125
        },
        {
          header: 'Giá bán',
          binding: 'unitPrice',
          width: 125
        }
      ],
      class: 'class-detail',
      properties: {
        allowResizing: 0,
        isReadOnly: true,
        headersVisibility: 1,
        autoGenerateColumns: false,
        allowSorting: 0
      }
    }
  ]

  constructor(private _northwindService: NorthwindService) { }

  initialized(pGrid: wjcGrid.FlexGrid, pTitle: string) {
    let grid = this.listGrid.find(grid => grid.title === pTitle);
    if (grid) {
      pGrid.initialize({ columns: grid.column })
      if (grid?.properties) {
        pGrid.allowResizing = grid.properties.allowResizing;
        pGrid.allowSorting = grid.properties.allowSorting;
        pGrid.isReadOnly = grid.properties.isReadOnly;
        pGrid.headersVisibility = grid.properties.headersVisibility;
        pGrid.autoGenerateColumns = grid.properties.autoGenerateColumns;
      }

      if (pTitle === dataType.City) {
        this.callingApi = this._northwindService.getListCities().subscribe(
          data => {
            this.callingApi = null;
            let respon: Array<Customer> = data['results'];
            let list = [{ id: '' }];
            for (let i = 0; i < respon.length; i++) {
              if (!list.find(item => item.id === respon[i].city)) { list.push({ id: respon[i].city }) }
            }
            pGrid.itemsSource = list;
          }
        );
      }

      pGrid.itemsSourceChanged.addHandler((pGrid: wjcGrid.FlexGrid, pEvent: wjcCore.EventArgs) => {
        let currentItem = pGrid.collectionView.currentItem;
        if (currentItem && grid.child) { this.getDataFromServer(grid.child, currentItem.id) }
        pGrid.collectionView.currentChanged.addHandler(this.handleCurrentChaned.bind(this, grid.child), this)
      }, this)
    }
  }

  handleCurrentChaned(pChild: string, pGrid: wjcCore.CollectionView, pEvent: wjcCore.EventArgs) {
    if (this.callingApi) { this.callingApi.unsubscribe(); }
    if (pGrid.currentItem) { this.getDataFromServer(pChild, pGrid.currentItem.id) }
  }

  getDataFromServer(pType: string, pId: any) {
    let orderId;
    if (pType === dataType.OrderDetail) {
      let parentGrid: any = wjcCore.Control.getControl(`#${dataType.Order}`);
      if (parentGrid) {
        pId = parentGrid.collectionView.currentItem.customerId;
        orderId = parentGrid.collectionView.currentItem.id;
      }
    }

    this.callingApi = this._northwindService.getDataByType(pType, pId).subscribe((resp) => {
      this.callingApi = null;
      let data: Array<any> = resp['results'];
      let index = this.listGrid.findIndex(grid => grid.title === pType);
      if (index > -1) {
        let grid: any = wjcCore.Control.getControl(`#${pType}`);
        if (grid) {
          if (pType === dataType.Customer) {
            grid.itemsSource = data;
            return;
          }

          if (pType === dataType.Order) {
            let listOrders: Array<Order> = [];
            for (let i = 0; i < data.length; i++) {
              data[i].order.orderDate = this.formatDateFromServer(data[i].order.orderDate);
              listOrders.push(data[i].order);
            }
            grid.itemsSource = listOrders;
            if (!listOrders.length) {
              let childGrid: any = wjcCore.Control.getControl(`#${dataType.OrderDetail}`);
              if (childGrid) { childGrid.itemsSource = []; }
            }
            return;
          }

          if (pType === dataType.OrderDetail) {
            let listOrderDetail: Array<OrderDetail> = []
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < data[i].orderDetails.length; j++) {
                listOrderDetail.push(data[i].orderDetails[j]);
              }
            }
            let listDetail = listOrderDetail.filter((item: OrderDetail) => item.orderId === orderId);
            grid.itemsSource = listDetail;
            return;
          }
        }
      }
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
    this.callingApi.unsubscribe();
    for (let i = 0; i < this.listGrid.length; i++) {
      let grid: any = wjcCore.Control.getControl(`#${this.listGrid[i].title}`);
      grid.itemsSourceChanged.removeHandler(null, this);
      grid.collectionView.currentChanged.removeHandler(null, this);
    }
  }
}
