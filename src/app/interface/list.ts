export interface item {
  Id: string;
  BizDocId: string;
  ParentId: number;
  DocNo: string;
  BranchCode: string;
  DocDate: string | Date;
  Description: string;
  CustomerName: string;
  TotalOriginalAmount0: number;
  TotalOriginalAmount3: number;
  TotalOriginalAmount: number;
  CurrencyCode: string;
  ExchangeRate: number;
  PortOfLoading: string;
  PaymentTerms: string;
  EmployeeName: string;
  DocStatus: number;
  CustomerId: number;
  DocCode: string;
  ParentBizDocId: string;
  IsActive: boolean;
  _SelectKey__c4z66h: boolean;
  _RowNumber__c0936a: string;
}

export interface column {
  title: string;
  value: string;
  type: string;
  sort: number;
  isSorted: boolean;
  sortType: string;
  size?: any;
  class?: string;
  hasSum?: boolean;
}

export interface filter {
  checked: boolean;
  valueFilter: number;
}
