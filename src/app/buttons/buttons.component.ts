import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit {

  subscription;

  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor(private data: DataService) {
    this.subscription = this.data.allowedValues.subscribe(
      params => {
        this.updateButtons(params);
      });
  }

  ngOnInit() {
    // console.log(this.numbers);
  }

  onClick(num) {
    this.data.setCellValue(num);
  }

  // Service Functions
  updateButtons(values) {
    $('button.button').prop('disabled', true);
    // console.log(values);
    for (const x of values) {
      $('button#btn-' + x).prop('disabled', false);
    }
  }

}
