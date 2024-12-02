import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { ServicioclienteService } from '@components/mantenimiento/ventas/serviciocliente/serviciocliente.service';
import { TipoidService } from '@components/mantenimiento/ventas/serviciotipoid/tipoid.service';
import { VendedorService } from '@components/mantenimiento/ventas/serviciovendedor/vendedor.service';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-buscador-avanzado-facturas',
  templateUrl: './buscador-avanzado-facturas.component.html',
  styleUrls: ['./buscador-avanzado-facturas.component.scss']
})
export class BuscadorAvanzadoFacturasComponent implements OnInit {

  constructor(private api: ApiService, 
    public dialogRef: MatDialogRef<BuscadorAvanzadoFacturasComponent>, private toastr: ToastrService,
    private almacenservice: ServicioalmacenService, private serviciovendedor: VendedorService,
    private _snackBar: MatSnackBar, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private dialog: MatDialog, private serviciotipoid: TipoidService, private servicioCliente: ServicioclienteService,
    @Inject(MAT_DIALOG_DATA) public ventana: any) {

   }

  ngOnInit() {

  }

  buscadorProformas(){

  }

  mandarAModificarProforma(){
    
  }

  close() {
    this.dialogRef.close();
  }
}
