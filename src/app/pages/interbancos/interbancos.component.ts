import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-interbancos',
  templateUrl: './interbancos.component.html',
  styleUrls: ['./interbancos.component.scss']
})
export class InterbancosComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  
  constructor() { }

  ngOnInit() {
  }

}
