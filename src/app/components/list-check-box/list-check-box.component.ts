import {
  Component,
  Output,
  Input,
  EventEmitter,
  Provider,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

const provider: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ListCheckBoxComponent),
  multi: true,
};

@Component({
  selector: 'app-list-check-box',
  templateUrl: './list-check-box.component.html',
  styleUrls: ['./list-check-box.component.scss'],
  providers: [provider],
})
export class ListCheckBoxComponent implements ControlValueAccessor {
  @Output() handleChange = new EventEmitter();
  @Input() form: FormGroup;
  listCheckbox = [];
  onChange: (pValue: Array<number>) => void;
  onTouched: () => void;

  onChanged(pId: number, pEvent: any) {
    let result = pEvent.currentTarget.checked;
    let index = this.listCheckbox.findIndex((item) => item.id === pId);
    this.listCheckbox[index].checked = result;
    let filterArray: Array<number> = [];
    for (let i = 0; i < this.listCheckbox.length; i++) {
      if (this.listCheckbox[i].checked) {
        filterArray.push(this.listCheckbox[i].valueFilter);
      }
    }
    this.onChange(filterArray);
  }

  writeValue(pValue: any) { }

  registerOnChange(pFn: any) {
    this.onChange = pFn;
  }

  registerOnTouched(pFn: any) {
    this.onTouched = pFn;
  }

  setDisabledState(pIsDisable: boolean) { }
}
