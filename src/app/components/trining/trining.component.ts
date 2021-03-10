import { Component, OnInit, ViewChild } from '@angular/core';
import { item, column } from '../../interface/list';
import { HttpClient } from '@angular/common/http';
import { ListCheckBoxComponent } from '../../components/list-check-box/list-check-box.component';
import { FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { AllowSorting } from '@grapecity/wijmo.grid';
import { FlexGridSearch } from '@grapecity/wijmo.grid.search';
import { formatDataPipe } from '../../pipe/formatdata.pipe';
import { CustomCellFactory } from '../../CustomCellFactory';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trining',
  templateUrl: './trining.component.html',
  styleUrls: ['./trining.component.scss'],
  providers: [formatDataPipe]
})
export class TriningComponent implements OnInit {
  @ViewChild(ListCheckBoxComponent) child;
  @ViewChild('flex', { static: false }) flex: wjcGrid.FlexGrid;
  @ViewChild('searchElement', { static: false }) searchElement: FlexGridSearch;
  @ViewChild('popup', { static: true }) popup: wjcInput.Popup;
  @ViewChild('docNo', { static: true }) docNo: wjcInput.ComboBox;
  @ViewChild('docDate', { static: true }) docDate: wjcInput.InputDate;
  @ViewChild('description', { static: true }) description: wjcInput.ComboBox;
  @ViewChild('customerName', { static: true }) customerName: wjcInput.ComboBox;
  @ViewChild('totalOriginalAmount', { static: true }) totalOriginalAmount: wjcInput.InputNumber;
  data: wjcCore.CollectionView;
  subscriptions: Subscription[] = []
  listColumns: Array<column> = [
    {
      title: 'Số',
      value: 'DocNo',
      type: 'string',
      sort: 0,
      isSorted: false,
      sortType: '',
      size: 150,
    },
    {
      title: 'Ngày',
      value: 'DocDate',
      type: 'date',
      sort: 1,
      isSorted: true,
      sortType: 'desc',
      size: 150,
      class: 'blue'
    },
    {
      title: 'Mô tả',
      value: 'Description',
      type: 'string',
      sort: 0,
      isSorted: false,
      sortType: '',
      size: '*'
    },
    {
      title: 'Nhà Cung Cấp',
      value: 'CustomerName',
      type: 'string',
      sort: 0,
      isSorted: false,
      sortType: '',
      size: '*'
    },
    {
      title: 'Tiền Hàng',
      value: 'TotalOriginalAmount',
      type: 'number',
      sort: 1,
      isSorted: false,
      sortType: 'acs',
      size: 150,
      hasSum: true
    }
  ];
  listCheckbox = [
    {
      id: 1,
      title: 'Loại 1',
      checked: false,
      valueFilter: 1,
      name: 'type1',
    },
    {
      id: 2,
      title: 'Loại 2',
      checked: false,
      valueFilter: 2,
      name: 'type2',
    },
    {
      id: 3,
      title: 'Loại 3',
      checked: false,
      valueFilter: 3,
      name: 'type3',
    },
    {
      id: 4,
      title: 'Loại 4',
      checked: false,
      valueFilter: 4,
      name: 'type4',
    },
  ];
  zCurentTypeSort = 'desc';
  rfFilter: FormGroup;
  zSearchTerm: string;
  allowSorting = AllowSorting.SingleColumn;
  currentItem: item;
  zJsonURL = 'assets/data.json';
  listPageSize = [5, 10, 15, 20];
  nTotalMoney: number = 0

  constructor(private _fb: FormBuilder, private _http: HttpClient) {
    this.data = new wjcCore.CollectionView([], { trackChanges: true });

    this.subscriptions.push(this._http.get(this.zJsonURL).subscribe(data => {
      const list: any = data;
      for (let i = 0; i < list.length; i++) {
        list[i].DocDate = new Date(list[i].DocDate);
      }
      this.data.sourceCollection = list;
      // this.data.pageSize = 10;

      this.flex.columns.clear();
      for (let i = 0; i < this.listColumns.length; i++) {
        const column = new wjcGrid.Column();
        column.header = this.listColumns[i].title;
        column.binding = this.listColumns[i].value;
        column.width = this.listColumns[i].size;
        if (this.listColumns[i]?.class) { column.cssClass = this.listColumns[i].class; }
        this.flex.columns.push(column);
      }
    }));
  }

  ngOnInit(): void {
    this.rfFilter = this._fb.group({
      types: new FormControl([]),
      description: '',
      totalmoney: ['', [this.validateMoney]]
    },
    );
  }

  ngAfterViewInit(): void {
    // setTimeout(() => {
    this.child.listCheckbox = this.listCheckbox;
    // }, 0);
    if (this.flex) {
      this.flex.columnFooters.rows.push(new wjcGrid.Row);
    }
  }

  validateMoney(pControl: AbstractControl): { [key: string]: any } | null {
    const errorMessage = 'Only Number';
    if (pControl.value.length === 0) { return null; }

    const regexPattern = /\-?\d*\.?\d/;
    const valid = regexPattern.test(pControl.value);
    return valid ? null : { invalidPassword: true, message: errorMessage };
  }

  // handleClickIcon(pColumn: column) {
  //   for (let i = 0; i < this.listColumns.length; i++) {
  //     if (this.listColumns[i].value === pColumn.value) {
  //       this.listColumns[i].isSorted = true;
  //       this.zCurentTypeSort = this.zCurentTypeSort === 'desc' ? 'asc' : 'desc';
  //       this.listColumns[i].sortType = this.zCurentTypeSort;
  //       let sortType = `${this.zCurentTypeSort}`;
  //       this.handleSort(this.data, pColumn.value, sortType);
  //     } else {
  //       this.listColumns[i].isSorted = false;
  //       this.listColumns[i].sortType = 'asc';
  //     }
  //   }
  // }

  // handleSort(pList: Array<any>, pColumn: string, pType: string) {
  //   return pList.sort(this.doSort.bind(pList, pColumn, pType));
  // }

  // doSort(pColumn: string, pType: string, pA, pB) {
  //   switch (pColumn) {
  //     case 'DocDate':
  //       return pType === 'asc'
  //         ? String(pA.DocDate).localeCompare(pB.DocDate)
  //         : String(pB.DocDate).localeCompare(pA.DocDate);
  //     case 'TotalOriginalAmount':
  //       return pType === 'asc'
  //         ? pA.TotalOriginalAmount - pB.TotalOriginalAmount
  //         : pB.TotalOriginalAmount - pA.TotalOriginalAmount;
  //   }
  // }

  onSubmit() {
    const filterTypes = this.rfFilter.get('types')?.value;
    const filterDescription = this.rfFilter.get('description')?.value?.toLocaleLowerCase();
    const filterMoney = this.rfFilter.get('totalmoney')?.value;

    const zFilterFormulaDescription = `item.Description.toLocaleLowerCase().includes(filterDescription)`;
    const zFilterFormulaMoney = `item.TotalOriginalAmount == filterMoney`;
    const zFilterFormulaTypes = `filterTypes.includes(item.DocStatus)`;
    let arrayFormula = [];
    this.zSearchTerm = filterDescription;

    if (filterTypes.length) { arrayFormula.push(zFilterFormulaTypes); }

    if (filterDescription) { arrayFormula.push(zFilterFormulaDescription); }

    if (filterMoney) { arrayFormula.push(zFilterFormulaMoney); }

    if (arrayFormula.length === 0) { return this.flex.collectionView.filter = (item: any) => item; }

    const zArrayString: any = arrayFormula.toString();
    const zFilterFormula: string = zArrayString.replaceAll(/,/ig, ' && ');

    this.flex.collectionView.filter = (item: item) => eval(zFilterFormula);
  }


  initializeGrid(pGrid: wjcGrid.FlexGrid) {
    this.data.currentChanged.addHandler((pGrid: any, pEvent: any) => {
      this.handleCurrentChanged(pGrid, pEvent);
    });

    this.data.collectionChanged.addHandler((pGrid: any, pEvent: any) => {
      this.handleCollectionChanged(pGrid, pEvent);
    });

    this.data.pageChanging.addHandler((pGrid: any, pEvent: any) => {
      this.handlePageChanging(pGrid, pEvent);
    });

    pGrid.formatItem.addHandler((grid: wjcGrid.FlexGrid, pEvent: wjcGrid.FormatItemEventArgs) => {
      if (pEvent.panel === grid.cells) {
        const col = grid.columns[pEvent.col];
        const item = grid.rows[pEvent.row].dataItem;

        // const binding = col.binding;
        // if (binding === 'TotalOriginalAmount') {
        //   const value: number = grid.getCellData(e.row, e.col, false)
        //   if (value > 350000000) {
        //     wjcCore.addClass(e.cell, 'blue');
        //   }
        // }
        this.formatCell(pEvent.cell, item, col);
      }
    });
    this.flex.cellFactory = new CustomCellFactory();
  }

  private formatCell(pCell: HTMLElement, pItem: any, pCol: any) {
    switch (pCol.binding) {
      case 'Description':
        this.formatDynamicCell(pCell, pItem, pCol);
        break;
    }
  }

  private formatDynamicCell(pCell: HTMLElement, pItem: any, pCol: any) {
    let html;
    const value = wjcCore.Globalize.format(pItem[pCol.binding], pCol.format)

    if (!!this.zSearchTerm) {
      const left = this.leftTextBeforeCh(value, this.zSearchTerm);
      const right = this.substringAfter(value, this.zSearchTerm);
      const mark = value.substring(left.index, right.index);
      html = `<div><span>${left.text}</span><span class="wj-state-match">${mark}</span><span>${right.text}</span></div>`;
      pCell.innerHTML = html;
      return;
    }

    html = `<div>${value}</div>`;
    pCell.innerHTML = html;
  }

  handleCurrentChanged(pGrid: wjcCore.CollectionView, pEvent: wjcCore.EventArgs) {
    this.currentItem = this.flex.collectionView.currentItem;
  }

  handleCollectionChanged(pGrid: wjcCore.CollectionView, pEvent: wjcCore.NotifyCollectionChangedEventArgs) {
    this.calculatorTotal();
  }

  handlePageChanging(pGrid: wjcCore.CollectionView, pEvent: wjcCore.PageChangingEventArgs) {
    if (pGrid.pageIndex + 1 === 3) pEvent.cancel = true
  }

  displayItem(pColumn) {
    if (!this.currentItem) {
      switch (pColumn) {
        case 'DocDate': return new Date()
        case 'TotalOriginalAmount':
          return 0;
        default: return null;
      }
    }
    return this.currentItem[pColumn]
  }

  showHistory() {
    console.log('removed item', this.data.itemsRemoved);
    console.log('edited item', this.data.itemsEdited);
    console.log('added item', this.data.itemsAdded);
  }

  editItem(pEvent, pColumn: string) {
    let value;
    switch (pColumn) {
      case 'TotalOriginalAmount':
        value = pEvent.value;
        break;
      case 'DocDate':
        value = pEvent.value;
        break;
      default:
        value = pEvent.text;
        break;
    }
    this.data.editItem(this.currentItem);
    this.currentItem[pColumn] = value;
    this.data.commitEdit();
  }

  openPopup() {
    this.resetForm();
    this.popup.show(true, (popup: wjcInput.Popup) => {
      if (popup.dialogResult === 'wj-hide-ok') {
        let item: item = this.data.addNew()
        item.DocNo = this.docNo.text;
        item.DocDate = this.docDate.value;
        item.Description = this.description.text;
        item.CustomerName = this.customerName.text;
        item.TotalOriginalAmount = this.totalOriginalAmount.value
        this.data.commitNew()
      }
      this.flex.focus();
    });
  }

  resetForm() {
    this.docNo.text = null;
    this.docDate.value = new Date();
    this.description.text = null;
    this.customerName.text = null;
    this.totalOriginalAmount.value = 0;
  }

  calculatorTotal() {
    this.nTotalMoney = 0;
    for (let i = 0; i < this.flex.collectionView.items.length; i++) {
      this.nTotalMoney += this.flex.collectionView.items[i].TotalOriginalAmount;
    }
  }

  changePageItem(pValue): void { this.data.pageSize = parseInt(pValue); }

  goPreviousItem() { this.data.moveCurrentToPrevious(); }

  goNextItem() { this.data.moveCurrentToNext(); }

  goPreviousPage() { this.data.moveToPreviousPage(); }

  goNextPage() { this.data.moveToNextPage(); }

  leftTextBeforeCh(pString: string, pMarkStr: string) {
    let zResult = '';
    const length = pString.toLowerCase().indexOf(pMarkStr.toLowerCase());
    if (length > -1) { zResult = pString.substr(0, length); }
    const result = {
      text: zResult,
      index: length
    };
    return result;
  }

  substringAfter(pString: string, pMarkStr: string) {
    let zResult = '';
    const num = pString.toLowerCase().indexOf(pMarkStr.toLowerCase());
    if (num > -1) { zResult = pString.substr(num + pMarkStr.length); }
    const result = {
      text: zResult,
      index: num + pMarkStr.length
    };
    return result;
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
    this.flex.removeEventListener();
    this.flex.formatItem.removeAllHandlers();
    this.data.currentChanged.removeAllHandlers();
    this.data.collectionChanged.removeAllHandlers();
    this.data.pageChanging.removeAllHandlers();
  }
}
