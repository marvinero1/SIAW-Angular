import { Component, OnInit } from '@angular/core';
import { BuscadorAvanzadoService } from '../servicio-buscador-general/buscador-avanzado.service';
import { ApiService } from '@services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalIdtipoComponent } from '@components/mantenimiento/ventas/modal-idtipo/modal-idtipo.component';

@Component({
  selector: 'app-buscador-avanzado',
  templateUrl: './buscador-avanzado.component.html',
  styleUrls: ['./buscador-avanzado.component.scss']
})

export class BuscadorAvanzadoComponent implements OnInit {

  public id_tipo_view_get_codigo: string;


  todas: boolean = true;


  id_bool: boolean = false;





  id_tipo_view_get_array: any = [];



  fecha_desde_input: any;
  fecha_hasta_input: any;

  userConn: any;
  BD_storage: any;
  usuarioLogueado: any;
  agencia_logueado: any;

  constructor(private api: ApiService, public servicioBuscadorAvanzado: BuscadorAvanzadoService,
    public dialogRef: MatDialogRef<BuscadorAvanzadoComponent>, private toastr: ToastrService,
    private _snackBar: MatSnackBar, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private dialog: MatDialog) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;

  }

  ngOnInit() {
    this.getIdTipo();

  }

  habilitarTodo() {
    this.todas = true;

    this.id_bool = false;
  }

  habilitarID() {
    if (this.todas) {
      this.todas = false;
    } else {
      this.id_bool = true
    }
  }

  habilitarFecha() {

  }


  getIdTipo() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/mant/venumeracion/catalogoNumProfxUsuario/";
    return this.api.getAll('/venta/mant/venumeracion/catalogoNumProfxUsuario/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.id_tipo_view_get_array = datav;
          // console.log(this.id_tipo_view_get_array);
          // this.id_tipo_view_get_array_copied = this.id_tipo_view_get_array.slice();
          // this.id_tipo_view_get_first = this.id_tipo_view_get_array_copied.shift();
          // this.id_tipo_view_get_codigo = this.id_tipo_view_get_first.id;
          console.log(this.id_tipo_view_get_codigo);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }



  onLeaveIDTipo(event: any) {
    console.log(this.id_tipo_view_get_array);
    const inputValue = event.target.value;

    let cadena = inputValue.toString();
    console.log(cadena);
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.id_tipo_view_get_array.some(objeto => objeto.id === cadena.toUpperCase());

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = cadena;
    }
  }

  modalTipoID(): void {
    this.dialog.open(ModalIdtipoComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  close() {
    this.dialogRef.close();
  }
}
