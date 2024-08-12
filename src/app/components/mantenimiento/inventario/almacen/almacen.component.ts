import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlmacenCreateComponent } from './almacen-create/almacen-create.component';
import { StockAlmacenesComponent } from './stock-almacenes/stock-almacenes.component';
import { UrgentesAlmacenesComponent } from './urgentes-almacenes/urgentes-almacenes.component';
import { ReservaAlmacenesComponent } from './reserva-almacenes/reserva-almacenes.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalAlmacenComponent } from './modal-almacen/modal-almacen.component';
import { ServicioalmacenService } from './servicioalmacen/servicioalmacen.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrls: ['./almacen.component.scss']
})
export class AlmacenComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  isLinear = true;

  dataform: any = '';
  userConn: any;
  usuarioLogueado: any;
  almacen: any = [];
  planporcen: any = [];
  adarea: any = [];
  moneda: any = [];
  fncuenta: any = [];
  data: any = [];

  almacen_catalogo: any = [];
  almacen_catalogo_id: string;
  data_almacen: any = [];

  nombre_ventana: string = "abminalmacen.vb";
  public ventana = "Almacen"
  public detalle = "almacen-detalle";
  public tipo = "transaccion-almacen-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, private datePipe: DatePipe,
    public log_module: LogService, public nombre_ventana_service: NombreVentanaService, public _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder, public almacenservice: ServicioalmacenService, private toastr: ToastrService) {

    this.FormularioData = this.createForm();
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.getAlladArea();
    this.getAllplanporcen();
    this.getAllmoneda();
    this.getAllfncuenta();

    //Almacen
    this.almacenservice.disparadorDeAlmacenes.subscribe(data => {
      console.log("Recibiendo Almacen: ", data);
      this.almacen_catalogo = data.almacen
      this.almacen_catalogo_id = data.almacen.codigo;

      this.getAlmacenID(this.almacen_catalogo_id);
    });
    //
  }

  createForm(): FormGroup {
    let usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      direccion: [this.dataform.direccion, Validators.compose([Validators.required])],
      telefono: [this.dataform.telefono, Validators.compose([Validators.required])],
      email: [this.dataform.email, Validators.compose([Validators.required])],
      nropatronal: [this.dataform.nropatronal, Validators.compose([Validators.required])],
      codarea: [this.dataform.codarea],
      codplanporcen: [this.dataform.codplanporcen],
      tienda: [this.dataform.tienda],
      nropersonas: [this.dataform.nropersonas],
      lugar: [this.dataform.lugar],
      min_solurgente: [this.dataform.min_solurgente],
      codmoneda_min_solurgente: [this.dataform.moneda],
      latitud: [this.dataform.latitud],
      longitud: [this.dataform.longitud],
      actividad: [this.dataform.actividad],
      fax: ["0000-0000"],

      idcuenta_caja_mn: [this.dataform.idcuenta_caja_mn],
      idcuenta_caja_me: [this.dataform.idcuenta_caja_me],

      pesoest_rendi: [this.dataform.pesoest_rendi,],
      porcenmin_rendi: [this.dataform.porcenmin_rendi,],
      pesomin_rendi: [this.dataform.pesomin_rendi,],
      porcenmin: [this.dataform.porcenmin,],
      pesomin: [this.dataform.pesomin,],
      estandar: [this.dataform.estandar,],
      monestandar: [this.dataform.moneda,],
      minimo: [this.dataform.minimo,],
      moneda: [this.dataform.moneda,],
      pesoest: [this.dataform.pesoest,],
      graficar: [this.dataform.graficar,],
      analizar_rendimiento: [this.dataform.analizar_rendimiento,],

      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
    });
  }

  submitData() {
    const data = this.FormularioData.value;
    console.log(data);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:- /inventario/mant/inalmacen/";
    return this.api.create("/inventario/mant/inalmacen/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.almacen = datav;
          console.log('data', datav);

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.toastr.success('! SE GUARDO EXITOSAMENTE !');
          this._snackBar.open('! SE GUARDO EXITOSAMENTE !', 'Ok', {
            duration: 3000,
            panelClass: ['coorporativo-snackbar', 'login-snackbar'],
          });

          location.reload();
        },

        error: (err) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  submitDataEdit() {
    const data = this.FormularioData.value;
    console.log(data);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:- /inventario/mant/inalmacen/";
    return this.api.update("/inventario/mant/inalmacen/" + this.userConn + "/" + this.almacen_catalogo_id, data)
      .subscribe({
        next: (datav) => {
          this.almacen = datav;
          console.log('data', datav);

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.toastr.success('! SE EDITO EXITOSAMENTE !');
          this._snackBar.open('! SE EDITO EXITOSAMENTE !', 'Ok', {
            duration: 3000,
            panelClass: ['coorporativo-snackbar', 'login-snackbar'],
          });

          location.reload();
        },

        error: (err) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAlladArea() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/adarea/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.adarea = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllplanporcen() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/peplanporcen/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.planporcen = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllmoneda() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/admoneda/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllfncuenta() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/fondos/mant/fncuenta/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.fncuenta = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  stock(almacen) {
    this.dialog.open(StockAlmacenesComponent, {
      width: 'auto',
      height: 'auto',
      data: { cod_almacen_stock: almacen },
    });
  }

  solicitudesUrgentes(almacen) {
    this.dialog.open(UrgentesAlmacenesComponent, {
      width: 'auto',
      height: 'auto',
      data: { cod_almacen_solurgente: almacen },
    });
  }

  reservas(almacen) {
    this.dialog.open(ReservaAlmacenesComponent, {
      width: 'auto',
      height: 'auto',
      data: { cod_almacen_reserva: almacen },
    });
  }

  getAlmacenID(id: string) {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/"
    return this.api.getAll('/inventario/mant/inalmacen/' + this.userConn + "/" + id)
      .subscribe({
        next: (datav) => {
          this.data_almacen = datav;
          console.log(this.data_almacen);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  limpiar() {

  }

  eliminar(element): void {
    console.log(element);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta: /inventario/mant/inalmacen/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/inventario/mant/inalmacen/' + this.userConn + "/" + element.codigo)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
              this.spinner.show();
              setTimeout(() => {
                this.spinner.hide();
              }, 1500);

              location.reload();
            },
            error: (err: any) => {
              console.log(errorMessage);
            },
            complete: () => { }
          })
      } else {
        alert("¡No se elimino!");
      }
    });
  }

  openCreateRoute() {
    this.dialog.open(AlmacenCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      data: { almacen: "almacen" }
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
