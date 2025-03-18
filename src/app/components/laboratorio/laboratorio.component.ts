import { Component, OnInit } from '@angular/core';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from './product.service';

@Component({
  selector: 'app-laboratorio',
  templateUrl: './laboratorio.component.html',
  styleUrls: ['./laboratorio.component.scss']
})

export class LaboratorioComponent implements OnInit {

  constructor(private api: ApiService, public dialog: MatDialog, private productService: ProductService) { }

  ngOnInit() {

  }
}