import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { NorthwindService } from '../../services/northwind.service';
import { Customer, Order, OrderDetail, Grid, dataType } from '../../interface/northwind'

@Component({
  selector: 'app-northwind-test',
  templateUrl: './northwind-test.component.html',
  styleUrls: ['./northwind-test.component.scss']
})

export class NorthwindTestComponent implements OnInit {
  @ViewChild('dgrid', { static: false }) dgrid: wjcGrid.FlexGrid;
  callingApi;
  listGrid: Array<Grid> = [
    {
      title: dataType.City,
      source: [],
      column: [
        {
          header: 'Thành phố',
          binding: 'city',
          width: '*'
        }
      ],
      class: 'class-city'
    },
    {
      title: dataType.Customer,
      source: [],
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
      class: 'class-customer'
    },
    {
      title: dataType.Order,
      source: [],
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
          format: 'n0'
        },
      ],
      class: 'class-order'
    },
    {
      title: 'detail',
      source: [],
      column: [
        {
          header: 'Id',
          binding: 'orderId',
          width: 125,
          format: 'd'
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
      class: 'class-detail'
    }
  ]

  constructor(private _northwindService: NorthwindService) { }

  ngOnInit() { }

  initialized(pGrid: wjcGrid.FlexGrid, title: string) {
    pGrid.columnHeaders.rows.defaultSize = 20;
    let grid = this.listGrid.find(grid => grid.title === title);
    if (grid) {
      if (title === dataType.City) {
        this.callingApi = this._northwindService.getListCities().subscribe(
          data => {
            this.callingApi = null;
            let respon: Array<Customer> = data['results'];
            let unique = [...new Set(respon.map((item: Customer) => item.city))];
            let list = [{ city: '' }];
            for (let i = 0; i < unique.length; i++) {
              list.push({ city: unique[i] })
            }
            grid.source = list;
          }
        );
      }

      pGrid.itemsSourceChanged.addHandler((pGrid: wjcGrid.FlexGrid, pEvent: wjcCore.EventArgs) => {
        let currentItem = pGrid.collectionView.currentItem;
        if (currentItem) {
          if (title === dataType.City) { this.getDataFromServer(dataType.Customer, currentItem.city) }
          if (title === dataType.Customer) { this.getDataFromServer(dataType.Order, currentItem.id) }
          if (title === dataType.Order) { this.getDataFromServer(dataType.OrderDetail, currentItem.customerId, currentItem.id) }
        }

        pGrid.collectionView.currentChanged.addHandler((pGrid: wjcCore.CollectionView, pEvent: wjcCore.EventArgs) => {
          this.handleCurrentChaned(pGrid, pEvent, title);
        })
      })
    }
  }

  handleCurrentChaned(pGrid: wjcCore.CollectionView, pEvent: wjcCore.EventArgs, pType: string) {
    if (this.callingApi) { this.callingApi.unsubscribe(); }
    if (pGrid.currentItem) {
      switch (pType) {
        case dataType.City:
          this.getDataFromServer(dataType.Customer, pGrid.currentItem.city);
          break;

        case dataType.Customer:
          this.getDataFromServer(dataType.Order, pGrid.currentItem.id);
          break;

        case dataType.Order:
          this.getDataFromServer(dataType.OrderDetail, pGrid.currentItem.customerId, pGrid.currentItem.id);
          break;
      }
    }
  }

  getDataFromServer(pType: string, pId: any, pAnotherId?: string) {
    this.callingApi = this._northwindService.getDataByType(pType, pId).subscribe((resp) => {
      this.callingApi = null;
      let data: Array<any> = resp['results'];
      let index = this.listGrid.findIndex(grid => grid.title === pType);
      if (index > -1) {
        if (pType === dataType.Customer) {
          this.listGrid[index].source = data;
          return;
        }

        if (pType === dataType.Order) {
          let listOrders: Array<Order> = [];
          for (let i = 0; i < data.length; i++) {
            data[i].order.orderDate = this.formatDateFromServer(data[i].order.orderDate);
            listOrders.push(data[i].order);
          }
          this.listGrid[index].source = listOrders;
          if (!listOrders.length) {
            let indexDetail = this.listGrid.findIndex(grid => grid.title === dataType.OrderDetail);
            this.listGrid[indexDetail].source = [];
            return;
          }
        }

        if (pType === dataType.OrderDetail) {
          let listOrderDetail: Array<OrderDetail> = []
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].orderDetails.length; j++) {
              listOrderDetail.push(data[i].orderDetails[j]);
            }
          }
          let listDetail = listOrderDetail.filter((item: OrderDetail) => item.orderId === pAnotherId);
          this.listGrid[index].source = listDetail;
          return;
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
    this.dgrid.removeEventListener();
  }

}
