import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import * as $ from 'jquery';
import { HtmlParser } from '@angular/compiler';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit {

  grid = [];
  rows = new Array(9);
  columns = new Array(9);
  row;
  col;
  count;
  stopped;
  backtrack;
  subscription;

  constructor(private data: DataService) {
    this.subscription = this.data.cellValue.subscribe(
      params => {
        this.updateCell(params);
      });
  }

  ngOnInit() {
    // this.setupBoard();
  }

  ngAfterViewInit() {
    this.setupBoard();
    this.printBoard();
    this.cleanCell();
  }

  // Dev
  printBoard() {
    $('.board-row').each(function () {
      let data = '';
      $('.board-cell', this).each(function () {
        data += $(this).html();
      });
      console.log(data);
    });
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
    // tslint:disable-next-line:max-line-length
    const target = $('[data-row=' + (this.grid[count] - this.grid[count] % 10) / 10 + '][data-col=' + this.grid[count] % 10 + ']');
    const values = this.getAllowedValues(target);
    const value = values[this.getRndInteger(0, values.length - 1)];
    if (values.length === 0) {
      if (stopped !== count) {
        // console.log('break point', count);
        stopped = count;
        backtrack = 0;
      }
      backtrack++;
      // console.log('backtracking', backtrack);
      for (let i = 0; i < backtrack; i++) {
        // tslint:disable-next-line:max-line-length
        $('[data-row=' + (this.grid[count - i - 1] - this.grid[count - i - 1] % 10) / 10 + '][data-col=' + this.grid[count - i - 1] % 10 + '] .board-cell').html('');
      }
      count -= backtrack;
    } else {
      // target.val(value);
      $('.board-cell', target).html(value);
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
    $('.board-cell', target).html('');
    target.removeClass('disabled');
    if (this.grid.length > 32) {
      this.cleanCell();
    }
  }

  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
    return temp;
  }

  repeating(array) {
    for (let i = 0; i < array.length; i++) {
      for (let j = i + 1; j < array.length; j++) {
        if ($('.board-cell', array[i]).html() === $('.board-cell', array[j]).html() && $('.board-cell', array[i]).html() !== '') {
          array.addClass('error');
          return;
        }
      }
    }
  }

  removingErrors() {
    $('.board-cell-container.error').each(function () {
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

  validating(value, array) {
    for (let i = 0; i < array.length; i++) {
      if (value === Number($('.board-cell', array[i]).html())) {
        if (Number($(array[i]).attr('data-row')) === this.row && Number($(array[i]).attr('data-col')) === this.col) {
          return true;
        } else {
          return false;
        }
      }
    }
    return true;
  }

  isFull() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // tslint:disable-next-line:max-line-length
        if ($('[data-row=' + i + '][data-col=' + j + '] .board-cell').html() === '' || $('[data-row=' + i + '][data-col=' + j + ']').hasClass('error')) {
          return;
        }
      }
    }
    $('.board-cell-container').each(function () {
      $(this).addClass('disabled completed');
    });
  }

  // Click Functions
  onClick(event: any) {
    $('.board-cell-container.selected').removeClass('selected');
    $(event.target).parent().addClass('selected');
    this.row = Number($(event.target).parent().attr('data-row'));
    this.col = Number($(event.target).parent().attr('data-col'));
    // this.data.setAllowedValues(this.getAllowedValues($(event.target).parent()));
  }

  onKeyDown(event: any) {
    // $(event.target).html('');
    // $('.board-cell:focus').hide();
  }

  onKeyUp(event: any) {
    if (!$(event.target).parent().hasClass('disabled')) {
      if (event.keyCode >= 49 && event.keyCode <= 57) {
        $(event.target).html(event.key);
        this.checkBoard();
      }
      if (event.keyCode === 8 || event.keyCode === 46) {
        $(event.target).html('');
        this.checkBoard();
      }
    }
  }

  // Service Functions
  updateCell(value) {
    if (!$('[data-row=' + this.row + '][data-col=' + this.col + ']').hasClass('disabled')) {
      if (value === 'eraser') {
        value = '';
      }
      $('[data-row=' + this.row + '][data-col=' + this.col + '] .board-cell').html(value).focus();
      this.checkBoard();
    }
  }

}
