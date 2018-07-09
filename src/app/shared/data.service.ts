import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // private sharedData = new Subject<any>();
  // private allowedValuesSource = new Subject<any>();
  private cellValueSource = new Subject<any>();

  // allowedValues = this.allowedValuesSource.asObservable();
  cellValue = this.cellValueSource.asObservable();

  constructor() { }

  // setAllowedValues(values) {
  //   // console.log('data service', values);
  //   this.allowedValuesSource.next(values);
  // }

  setCellValue(value) {
    // console.log('data service', value);
    this.cellValueSource.next(value);
  }

}
