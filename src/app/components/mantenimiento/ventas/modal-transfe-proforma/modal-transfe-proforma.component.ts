import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CatalogoProformasComponent } from '../transacciones/proforma/catalogo-proformas/catalogo-proformas.component';
import { CatalogoCotizacionComponent } from '../transacciones/cotizacion/catalogo-cotizacion/catalogo-cotizacion.component';
import { ServicioCatalogoProformasService } from '../transacciones/proforma/sevicio-catalogo-proformas/servicio-catalogo-proformas.service';
import { ServicioTransfeAProformaService } from './servicio-transfe-a-proforma/servicio-transfe-a-proforma.service';
@Component({
  selector: 'app-modal-transfe-proforma',
  templateUrl: './modal-transfe-proforma.component.html',
  styleUrls: ['./modal-transfe-proforma.component.scss']
})
export class ModalTransfeProformaComponent implements OnInit {

  transferir_get: any = [];
  id_numero_id_proforma: any = [];
  cotizaciones: any = [];

  id_proformas: any;
  numero_id_proformas: any;
  id_cotizaciones: any;
  numero_id_cotizaciones: any;
  userConn: any;

  isCheckedProformas: boolean = true;
  isCheckedCotizaciones: boolean = false;

  constructor(public dialog: MatDialog, private api: ApiService,
    public dialogRef: MatDialogRef<ModalTransfeProformaComponent>,
    private spinner: NgxSpinnerService, private toastr: ToastrService,
    public servicioCatalogoProformas: ServicioCatalogoProformasService,
    public servicioTransfeProformaCotizacion: ServicioTransfeAProformaService) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
  }

  ngOnInit() {
    //CatalogoProforma
    this.servicioCatalogoProformas.disparadorDeIDProforma.subscribe(data => {
      console.log("Recibiendo Proforma: ", data);
      this.id_numero_id_proforma = data;
      this.id_proformas = data.proforma.id;
    });
    //

    //CatalogoCotizacion
    this.servicioCatalogoProformas.disparadorDeIDCotizacion.subscribe(data => {
      console.log("Recibiendo Cotizacion: ", data);
      this.cotizaciones = data;
      this.id_cotizaciones = data.cotizacion.id;
    });
    //
  }

  transferirProforma() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --vedescuento/catalogo";

    return this.api.getAll('/venta/transac/veproforma/transfDatosProforma/' + this.userConn + "/" + this.id_proformas + "/" + this.numero_id_proformas)
      .subscribe({
        next: (datav) => {
          this.transferir_get = datav;
          console.log(this.transferir_get);
          this.toastr.success('! TRANSFERENCIA EN PROGESO ! ✅');

          this.transferirProformaAProforma(this.transferir_get);
          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
          this.close();
        },
        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! TRANSFERENCIA FALLO ! ❌');
        },
        complete: () => {
          this.close();
        }
      })
  }

  transferirCotizaciones() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --vedescuento/catalogo";

    return this.api.getAll('/venta/transac/veproforma/transfDatosCotizacion/' + this.userConn + "/" + this.id_cotizaciones + "/" + this.numero_id_cotizaciones)
      .subscribe({
        next: (datav) => {
          this.transferir_get = datav;
          console.log(this.transferir_get);
          this.toastr.success('! TRANSFERENCIA EN PROGESO ! ✅');

          this.transferirACotizacion(this.transferir_get);
          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
          this.close();
        },
        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! TRANSFERENCIA FALLO ! ❌');
        },
        complete: () => { }
      })
  }

  proformaHabilitar() {
    console.log(this.isCheckedCotizaciones);

    if (!this.isCheckedCotizaciones) {
      this.isCheckedProformas = true;
    } else {
      this.isCheckedProformas = false;
      this.id_proformas = "";
    }
  }

  cotizacionHabilitar() {
    console.log(this.isCheckedProformas);

    if (!this.isCheckedProformas) {
      this.isCheckedCotizaciones = true;
    } else {
      this.isCheckedCotizaciones = false;
      this.id_cotizaciones = "";
    }
  }

  transferirProformaAProforma(proforma_get) {
    this.servicioTransfeProformaCotizacion.disparadorDeProformaTransferir.emit({
      proforma_transferir: proforma_get,
    });
  }

  transferirACotizacion(cotizacion_get) {
    this.servicioTransfeProformaCotizacion.disparadorDeCotizacionTransferir.emit({
      cotizacion_transferir: cotizacion_get,
    });
  }

  modalCatalogoProformas(): void {
    this.dialog.open(CatalogoProformasComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalCatalogoCotizaciones(): void {
    this.dialog.open(CatalogoCotizacionComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  close() {
    this.dialogRef.close();
  }
}
