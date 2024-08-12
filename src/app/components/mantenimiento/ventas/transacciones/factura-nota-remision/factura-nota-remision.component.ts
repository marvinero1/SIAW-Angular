import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
export interface PeriodicElement {
  numero: number;
  subtotal: number;
  recargos: number;
  montoiva: number;
  total: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { numero: 1, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 1, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 1, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 1, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 1, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 1, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 1, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 1, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 1, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 1, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 1, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
];

@Component({
  selector: 'app-factura-nota-remision',
  templateUrl: './factura-nota-remision.component.html',
  styleUrls: ['./factura-nota-remision.component.scss']
})
export class FacturaNotaRemisionComponent implements OnInit {

  nombre_ventana: string = "prgfacturarNR_cufd.vb";
  almacn_parame_usuario: any = [];

  displayedColumns: string[] = ['numero', 'subtotal', 'recargos', 'montoiva', 'total'];
  dataSource = ELEMENT_DATA;

  // dataSource = new MatTableDataSource();
  // dataSourceWithPageSize = new MatTableDataSource();

  constructor(public dialog: MatDialog) {
    /*let usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;*/
  }

  ngOnInit() {

  }

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      data: { almacen: "almacen" }
    });
  }

}
