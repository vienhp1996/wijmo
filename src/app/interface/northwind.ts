export interface Customer {
    address: string,
    city: string,
    companyName: string,
    contactName: string,
    contactTitle: string,
    country: string,
    fax: string,
    id: string,
    phone: string,
    postalCode: string,
}

export interface Order {
    customerId: string,
    employeeId: number,
    freight: number,
    id: number,
    orderDate: any,
    requiredDate: any,
    shipAddress: string,
    shipCity: string,
    shipCountry: string,
    shipName: string,
    shipPostalCode: string,
    shipVia: 3
    shippedDate: any,
}

export interface OrderDetail {
    discount: number,
    orderId: any,
    productId: number,
    quantity: number,
    unitPrice: number,
}

export interface Column {
    header: string,
    binding: string,
    width?: any,
    format?: string
}

export interface Grid {
    title: string,
    column: Array<Column>,
    class?: string,
    properties?: {
        allowResizing: number,
        isReadOnly: boolean,
        headersVisibility: number,
        autoGenerateColumns: boolean,
        allowSorting: number
    }
    child?: string
}

export enum dataType {
    City = 'city',
    Customer = 'customer',
    Order = 'order',
    OrderDetail = 'detail'
}