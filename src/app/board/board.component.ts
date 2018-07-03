import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit {

  rows = new Array(9);
  columns = new Array(9);
  grid = [];
  count;
  stopped;
  backtrack;

  constructor() { }

  ngOnInit() {
    // this.setupBoard();
  }

  ngAfterViewInit() {
    this.setupBoard();
    this.cleanCell();
  }

  setupBoard() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        this.grid.push(i * 10 + j);
      }
    }
    this.count = 0;
    this.stopped = 0;
    this.backtrack = 0;
    this.fillCell(this.count, this.stopped, this.backtrack);
  }

  fillCell(count, stopped, backtrack) {
    const target = $('[data-row=' + (this.grid[count] - this.grid[count] % 10) / 10 + '][data-col=' + this.grid[count] % 10 + ']');
    const values = this.getAllowedValues(target);
    const value = values[this.getRndInteger(0, values.length - 1)];

    if (values.length === 0) {
      // target.prop('disabled', true);
      if (stopped !== count) {
        console.log('break point', count);
        stopped = count;
        backtrack = 0;
      }
      backtrack++;
      console.log('backtracking', backtrack);
      for (let i = 0; i < backtrack; i++) {
        // tslint:disable-next-line:max-line-length
        $('[data-row=' + (this.grid[count - i - 1] - this.grid[count - i - 1] % 10) / 10 + '][data-col=' + this.grid[count - i - 1] % 10 + ']').val('');
      }
      count -= backtrack;
    } else {
      target.val(value);
      count++;
    }
    if (count < 81) {
      this.fillCell(count, stopped, backtrack);
    }
  }

  cleanCell() {
    const count = this.getRndInteger(0, this.grid.length);
    const target = $('[data-row=' + (this.grid[count] - this.grid[count] % 10) / 10 + '][data-col=' + this.grid[count] % 10 + ']');
    this.grid.splice(count, 1);
    target.val('');
    if (this.grid.length > 35) {
      this.cleanCell();
    }
  }

  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getSuffleArray() {
    const list: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const limit = Math.floor(Math.random() * 3 + 3);
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list.slice(0, limit).sort();
  }

  getAllowedValues(target) {
    const sector = Number(target.attr('data-sector'));
    const col = Number(target.attr('data-col'));
    const row = Number(target.attr('data-row'));

    const temp = [];
    for (let value = 1; value <= 9; value++) {
      if (this.validating(value, $('[data-row=' + row + ']'))
        && this.validating(value, $('[data-col=' + col + ']'))
        && this.validating(value, $('[data-sector=' + sector + ']'))) {
        temp.push(value);
      }
    }
    // console.log('getAllowedValues', temp);
    return temp;
  }

  onClick(event: any) {
    console.log(this.getAllowedValues($(event.target)));
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

  getValidValue(value, row, col, sector) {
    // const value = Math.floor(Math.random() * 9 + 1);
    console.warn(value, row, col, sector);
    if (this.validating(value, $('[data-row=' + row + ']'))
      && this.validating(value, $('[data-col=' + col + ']'))
      && this.validating(value, $('[data-sector=' + sector + ']'))) {
      return true;
    } else {
      return false;
    }
  }

  validating(value, array) {
    for (let i = 0; i < array.length; i++) {
      if (value === Number(array[i].value)) {
        return false;
      }
    }
    return true;
  }

  isFull() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if ($('[data-row=' + i + '][data-col=' + j + ']').val() === '' || $('[data-row=' + i + '][data-col=' + j + ']').hasClass('error')) {
          // console.log('incomplete');
          return;
        }
      }
    }
    // console.log('complete');
    $('input').each(function () {
      $(this).addClass('completed');
    });
  }

}
