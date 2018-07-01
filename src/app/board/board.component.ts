import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  rows = new Array(9);
  columns = new Array(9);

  constructor() { }

  ngOnInit() {
    // console.log('rows', this.rows);
  }

  onKeyDown(event: any) {
    event.target.value = '';
  }

  onKeyUp(event: any) {
    if (event.key === 'e' || event.key === '0') {
      event.target.value = '';
    } else {
      event.target.value = event.key;
      this.checkBoard();
    }
  }

  repeating(array) {
    for (let i = 0; i < array.length; i++) {
      for (let j = i + 1; j < array.length; j++) {
        if (array[i].value === array[j].value && array[i].value !== '') {
          array.addClass('error');
          return;
        }
      }
    }
  }

  removingErrors() {
    $('.board-cell').each(function () {
      $(this).removeClass('error');
    });
  }

  checkBoard() {
    this.removingErrors();
    for (let index = 0; index < 9; index++) {
      this.repeating($('[data-row=' + index + ']'));
      this.repeating($('[data-col=' + index + ']'));
      this.repeating($('[data-sector=' + index + ']'));
    }
    this.isFull();
  }

  isFull() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if ($('[data-row=' + i + '][data-col=' + j + ']').val() === '' || $('[data-row=' + i + '][data-col=' + j + ']').hasClass('error')) {
          console.log('incomplete');
          return;
        } else {
          console.log('complete');
        }
      }
    }
  }

}
