import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, Order, dataType } from '../interface/northwind';

@Injectable({
  providedIn: 'root'
})
export class NorthwindService {
  cityUrl = 'https://northwind.netcore.io/query/customers.json';
  customersUrl = 'https://northwind.netcore.io/query/customers.json';
  orderByCusomerUrl = 'https://northwind.netcore.io/customers';

  constructor(private httpClient: HttpClient) { }

  getListCities(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.cityUrl);
  }

  getListCusomtersByCity(pCity): Observable<Customer[]> {
    let url = '';
    if (pCity) {
      url = `${this.customersUrl}?City=${pCity}`
      return this.httpClient.get<any[]>(url);
    }
    url = `${this.customersUrl}`;
    return this.httpClient.get<any[]>(url);
  }

  getListOrdersByCustomer(pCustomerId: string): Observable<Order[]> {
    let url = `${this.orderByCusomerUrl}/${pCustomerId}/orders.json`;
    return this.httpClient.get<any[]>(url);
  }

  getDataByType(pType: string, pId: string): Observable<any[]> {
    switch (pType) {
      case dataType.Customer:
        return this.getListCusomtersByCity(pId);
      case dataType.Order:
        return this.getListOrdersByCustomer(pId);
      case dataType.OrderDetail:
        return this.getListOrdersByCustomer(pId);
    }
  }
}
