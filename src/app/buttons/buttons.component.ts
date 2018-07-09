import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit, AfterViewInit {

  // subscription;
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor(private data: DataService) {
    // this.subscription = this.data.allowedValues.subscribe(
    //   params => {
    //     this.updateButtons(params);
    //   });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  onClick(num) {
    this.data.setCellValue(num);
  }

  onClickEraser() {
    this.data.setCellValue('eraser');
  }
  onClickPencil() {
    this.data.setCellValue('pencil');
  }

  // Service Functions
  // updateButtons(values) {
  // $('button.button').prop('disabled', true);
  // for (const x of values) {
  // $('button#btn-' + x).prop('disabled', false);
  // }
  // }

}
