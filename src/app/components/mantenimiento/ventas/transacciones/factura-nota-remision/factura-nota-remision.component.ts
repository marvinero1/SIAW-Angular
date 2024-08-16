import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
export interface PeriodicElement {
  numero: number;
  descuento: number;
  subtotal: number;
  recargos: number;
  montoiva: number;
  total: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { numero: 1, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 2, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 3, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 4, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 5, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 6, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 7, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 8, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 9, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 10, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 11, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
];

@Component({
  selector: 'app-factura-nota-remision',
  templateUrl: './factura-nota-remision.component.html',
  styleUrls: ['./factura-nota-remision.component.scss']
})
export class FacturaNotaRemisionComponent implements OnInit {

  nombre_ventana: string = "prgfacturarNR_cufd.vb";
  almacn_parame_usuario: any = [];
  selectedItems!: any[];

  fecha_actual: Date;

  displayedColumns: string[] = ['numero', 'subtotal', 'recargos', 'montoiva', 'total'];
  dataSource = ELEMENT_DATA;

  items = Array.from({ length: 100000 }, (_, i) => ({
    label: `20240812 #${i}`, value: i + `VALOR CRECIENTE`
  }))


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
