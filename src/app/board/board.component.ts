import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  rows = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  columns = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  constructor() { }

  ngOnInit() {
    console.log('rows', this.rows);
  }

}
