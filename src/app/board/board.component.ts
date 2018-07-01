import { Component, OnInit } from '@angular/core';

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
    if (event.target.value !== '' && event.key >= 1 && event.key <= 9) {
      event.target.value = event.key;
    } else if (event.key === 'e') {
      event.target.value = '';
    }
  }

}
