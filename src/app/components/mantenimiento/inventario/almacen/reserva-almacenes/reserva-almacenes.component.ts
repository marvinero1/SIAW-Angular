import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ModalAlmacenComponent } from '../modal-almacen/modal-almacen.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ServicioalmacenService } from '../servicioalmacen/servicioalmacen.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reserva-almacenes',
  templateUrl: './reserva-almacenes.component.html',
  styleUrls: ['./reserva-almacenes.component.scss']
})
export class ReservaAlmacenesComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  userConn: string;
  usuario: string;
  usuario_logueado: string;
  dataform: any = "";

  almacen: any = [];
  reservas: any = [];
  agencia_get: any = [];
  almacn_parame_usuario: any = [];
  agencia_get_id: any = [];
  almacen_codigo: any;
  almacen_codigo_catalogo: any;
  almacen_descripcion_catalogo: string;

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  displayedColumns = ['codigo', 'descripcion', 'accion'];

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "abminalmacen_reserva.vb";
  public ventana = "Almacen Reserva"
  public detalle = "almacen-reserva";
  public tipo = "transaccion-reserva-POST";

  constructor(public dialog: MatDialog, private api: ApiService, private spinner: NgxSpinnerService, private toastr: ToastrService,
    public nombre_ventana_service: NombreVentanaService, public log_module: LogService, private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public cod_almacen_reserva: any, private _formBuilder: FormBuilder, public almacenservice: ServicioalmacenService,
    public dialogRef: MatDialogRef<ReservaAlmacenesComponent>) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuario = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
    this.almacen = cod_almacen_reserva.cod_almacen_reserva;
    this.almacen_codigo = cod_almacen_reserva.cod_almacen_reserva.codigo;

    this.getAllReservas();
    this.getAlmacen();
  }

  ngOnInit() {
    //Almacen
    this.almacenservice.disparadorDeAlmacenes.subscribe(data => {
      console.log("Recibiendo Almacen: ", data);
      this.almacen_codigo_catalogo = data.almacen.codigo;
      this.almacen_descripcion_catalogo = data.almacen.descripcion;
      this.getAlmacenID(this.almacen_codigo_catalogo);
      console.log(this.almacen_descripcion_catalogo);
    });
    //
  }

  createForm(): FormGroup {
    let a = Number(this.almacen_codigo);
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codalmacen: [this.dataform.codalmacen],
      codalmacen_reserva: [this.dataform.codalmacen_reserva, Validators.compose([Validators.required])],

      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      usuarioreg: [this.usuario],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    console.log(data);

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /inventario/mant/inalmacen_reserva/";
    return this.api.create("/inventario/mant/inalmacen_reserva/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.almacen = datav;
          console.log('data', datav);
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.getAllReservas();
        },

        error: (err) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllReservas() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen_reserva/"
    return this.api.getAll('/inventario/mant/inalmacen_reserva/' + this.userConn + "/" + this.almacen_codigo)
      .subscribe({
        next: (datav) => {
          this.reservas = datav;
          console.log(this.reservas);

          this.dataSource = new MatTableDataSource(this.reservas);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

          this.spinner.show();

          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAlmacen() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo2/"
    return this.api.getAll('/inventario/mant/inalmacen/catalogo2/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.agencia_get = datav;
          console.log(this.agencia_get);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAlmacenID(id) {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/"
    return this.api.getAll('/inventario/mant/inalmacen/' + this.userConn + "/" + id)
      .subscribe({
        next: (datav) => {
          this.agencia_get_id = datav;
          console.log(this.agencia_get_id);
          this.almacen_descripcion_catalogo = this.agencia_get_id.decripcion;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeave(event: any) {
    const inputValue = event.target.value;
    let numero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.agencia_get.some(objeto => objeto.codigo === numero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO INPUT");
    } else {
      event.target.value = numero;
    }

    // Puedes realizar otras acciones según tus necesidades
    console.log('Input perdió el foco', numero);
  }

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      data: { almacen: "almacen" }
    });
  }

  eliminar(element) {
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /venta/mant/insolurgente_parametros/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/inventario/mant/inalmacen_reserva/' + this.userConn + "/" + this.almacen_codigo + "/" + element.codigo)
          .subscribe({
            next: () => {
              this.toastr.success('!ELIMINADO EXITOSAMENTE!');
              this.getAllReservas();
            },
            error: (err: any) => {
              console.log(err, errorMessage);
              this.toastr.error('! NO ELIMINADO !');
            },
            complete: () => { }
          })
      } else {
        this.toastr.error('! CANCELADO !');
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
