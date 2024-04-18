import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DescuentoService } from '../serviciodescuento/descuento.service';
@Component({
  selector: 'app-modal-desct-extras',
  templateUrl: './modal-desct-extras.component.html',
  styleUrls: ['./modal-desct-extras.component.scss']
})
export class ModalDesctExtrasComponent implements OnInit {

  tarifaPrincipal: any = [];
  descuento_segun_tarifa: any = [];
  BD_storage: any = [];

  validacion_bool_descuento: any = [];
  validarBtnAnadir: any = false;
  agenciaLogueado: any;
  userConn: any;

  items_de_proforma: any = [];
  cabecera_proforma: any = [];
  info_descuento: any = [];
  array_de_descuentos: any = [];
  contra_entrega_get: any;
  array_de_descuentos_con_descuentos: any = [];

  displayedColumns = ['codigo', 'descripcion', 'porcen', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  constructor(private api: ApiService, public dialog: MatDialog, public log_module: LogService,
    public dialogRef: MatDialogRef<ModalDesctExtrasComponent>, private toastr: ToastrService,
    public descuento_services: DescuentoService, private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public items: any,
    @Inject(MAT_DIALOG_DATA) public cabecera: any,
    @Inject(MAT_DIALOG_DATA) public desct: any,
    @Inject(MAT_DIALOG_DATA) public contra_entrega: any) {

    this.items_de_proforma = items.items;
    this.cabecera_proforma = cabecera.cabecera;
    this.contra_entrega_get = contra_entrega.contra_entrega === undefined ? false : true;

    this.array_de_descuentos = desct.desct.map((element) => {
      return {
        codigo: element.coddesextra,
        porcentaje: element.porcen,
        descripcion: element.descripcion,
      }
    });

    this.dataSource = new MatTableDataSource(this.array_de_descuentos);

    console.log(this.contra_entrega_get);
    console.log("Cabecera de Proforma: " + JSON.stringify(this.cabecera_proforma),
      "Array de descuentos que ya estaban: " + JSON.stringify(this.array_de_descuentos));

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    this.agenciaLogueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
  }

  ngOnInit() {
    this.getPrecioInicial();
  }

  getPrecioInicial() {
    let array_post = {
      tabladetalle: this.items_de_proforma,
      dvta: this.cabecera_proforma,
    };

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getTarifaPrincipal/"
    return this.api.create('/venta/transac/veproforma/getTarifaPrincipal/' + this.userConn, array_post)
      .subscribe({
        next: (datav) => {
          this.tarifaPrincipal = datav;
          console.log(this.tarifaPrincipal);

          this.descuentoExtraSegunTarifa(this.tarifaPrincipal.codTarifa);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },

        complete: () => { }
      })
  }

  descuentoExtraSegunTarifa(cod_tarifa) {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/mant/vedesextra/getvedesextrafromTarifa/"
    return this.api.getAll('/venta/mant/vedesextra/getvedesextrafromTarifa/' + this.userConn + "/" + cod_tarifa)
      .subscribe({
        next: (datav) => {
          this.descuento_segun_tarifa = datav;
          //console.log(this.descuento_segun_tarifa);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },

        complete: () => { }
      })
  }

  infoDescuento(descuento) {
    console.log(descuento);
    this.spinner.show();

    if (!descuento) {
      // Evitar hacer la petición si no se seleccionó ninguna opción
      return;
    }

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/mant/vedesextra/"
    this.api.getAll('/venta/mant/vedesextra/' + this.userConn + "/" + descuento)
      .subscribe({
        next: (datav) => {
          this.info_descuento = datav;
          console.log(this.info_descuento);
          this.validarDescuento(this.info_descuento.codigo, this.info_descuento);

          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },
        error: (err: any) => {
          console.log(err, errorMessage);

          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },
        complete: () => { }
      });
  }

  validarDescuento(codigo, descuento) {
    //codproforma: this.cabecera_proforma.numeroid,
    //codanticipo: this.cabecera_proforma.idanticipo == "" ? 0 : this.cabecera_proforma.idanticipo,
    let a = [{
      codproforma: 0,
      coddesextra: 0,
      porcen: 0,
      montodoc: 0,
      codcobranza: 0,
      codcobranza_contado: 0,
      codanticipo: 0,
      id: 0,
    }];
    console.log(a);

    let ucr;

    if (this.cabecera_proforma.tipopago === 0) {
      ucr = "CREDITO";
    } else {
      // this.cabecera_proforma.tipopago = "CONTADO";
      ucr = "CONTADO";
    }

    //si es true anadir a tabla temporal
    //ESTO EN EL BOTON DE ANADIR
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/validaAddRecargo/"
    return this.api.create('/venta/transac/veproforma/validaAddDescExtraProf/' + this.userConn + "/" + descuento.codigo + "/" + descuento.descorta + "/" + this.cabecera_proforma.codcliente + "/" + this.cabecera_proforma.codcliente_real + "/" + this.BD_storage.bd + "/" + ucr + "/" + this.contra_entrega_get, a)
      .subscribe({
        next: (datav) => {
          this.validacion_bool_descuento = datav;
          console.log(this.validacion_bool_descuento, this.validacion_bool_descuento.resp);

          if (this.validacion_bool_descuento.resp != "") {
            this.toastr.error(this.validacion_bool_descuento.resp);
            this.validarBtnAnadir = true;
            return;
          }

          if (this.validacion_bool_descuento.status === true) {
            //this.toastr.error(this.validacion_bool_descuento.resp);
            this.validarBtnAnadir = false;
            return;
          }
        },
        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error("NO SE PUEDE AGREGAR EL DESCUENTO");
        },
        complete: () => { }
      })
  }

  anadirArray() {
    let tamanio = this.array_de_descuentos_con_descuentos.length;

    const existe_en_array = this.array_de_descuentos.some(item => item.codigo === this.info_descuento.codigo);
    console.log(existe_en_array);

    if (this.info_descuento) {
      if (existe_en_array) {
        this.toastr.warning("EL DESCUENTO YA ESTA AGREGADO")
      } else {
        if (tamanio > 0) {
          console.log("HAY DESCUENTO EN EL ARRAY LA CARGA SE CONCATENA");
          // Usar concat para agregar el nuevo descuento al array existente
          if (this.validacion_bool_descuento === true) {
            // Concatenar el nuevo descuento con los descuentos existentes
            this.array_de_descuentos = this.array_de_descuentos.concat([this.info_descuento]);
          } else {
            this.toastr.error("NO VALIDO PARA SER AGREGADO");
          }
        } else {
          console.log("NO HAY DESCUENTO EN EL ARRAY LA CARGA NO SE CONCATENA");
          // Usar push para agregar el elemento directamente al array
          this.array_de_descuentos.push(this.info_descuento);
        }
      }
    }
    this.dataSource = new MatTableDataSource(this.array_de_descuentos);

    console.log(this.info_descuento, tamanio);
  }

  sendArrayDescuentos() {
    let a = this.array_de_descuentos.length;
    let b = this.array_de_descuentos_con_descuentos.length;

    if (a > 0 || b > 0) {
      this.descuento_services.disparadorDeDescuentosDelModalTotalDescuentos.emit({
        desct_proforma: this.array_de_descuentos,
      });
      this.toastr.success("¡ RECARGOS AGREGADOS EXITOSAMENTE !");
      this.close();
    } else {
      this.toastr.warning("¡ NO HAY RECARGO AGREGADOS !");
      //this.close();
    }
  }

  eliminarDesct(codigo) {
    console.log(codigo);
    this.array_de_descuentos = this.array_de_descuentos.filter(item => item.codigo !== codigo);
    console.log(this.array_de_descuentos);

    this.dataSource = new MatTableDataSource(this.array_de_descuentos);
  }

  close() {
    this.dialogRef.close();
  }
}
