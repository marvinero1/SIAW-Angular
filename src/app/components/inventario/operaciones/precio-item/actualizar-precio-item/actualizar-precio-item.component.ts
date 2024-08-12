import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalPrecioVentaComponent } from '@components/mantenimiento/ventas/modal-precio-venta/modal-precio-venta.component';
import { ServicioprecioventaService } from '@components/mantenimiento/ventas/servicioprecioventa/servicioprecioventa.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-actualizar-precio-item',
  templateUrl: './actualizar-precio-item.component.html',
  styleUrls: ['./actualizar-precio-item.component.scss']
})
export class ActualizarPrecioItemComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  userConn: any;

  tarifa_save: any = [];
  codigo_item_catalogo: any = [];
  cod_precio_venta_modal: any = [];
  codigo_item_catalogo_get: any = [];

  nombre_ventana: string = "prgindefinir_precioitem.vb";

  public ventana = "PrecioItem"
  public detalle = "PrecioItem-UPDATE";
  public tipo = "PrecioItem-UPDATE";

  constructor(private api: ApiService, public dialog: MatDialog, private _formBuilder: FormBuilder, private toastr: ToastrService,
    public log_module: LogService, public servicioPrecioVenta: ServicioprecioventaService) {

    this.api.getRolUserParaVentana(this.nombre_ventana);

    this.FormularioData = this.createForm();
  }

  ngOnInit() {

    this.servicioPrecioVenta.disparadorDePrecioVenta.subscribe(data => {
      console.log("Recibiendo Precio Venta: ", data);
      this.cod_precio_venta_modal = data.precio_venta;
    });
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      item: [this.dataform.item],
      codtarifa: [this.dataform.codtarifa],
      precio: [this.dataform.precio],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /inventario/oper/prgcrearinv/";
    console.log(data);

    return this.api.update("/inventario/oper/prgindefinir_precioitem/updateTarifa1/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.tarifa_save = datav;

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.toastr.success('Guardado con Exito! 🎉');

          location.reload();
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }

  modalPrecioTipo(): void {
    this.dialog.open(ModalPrecioVentaComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

}
