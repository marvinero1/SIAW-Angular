import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ServicioInventarioService } from '@components/inventario/servicio-inventario/servicio-inventario.service';
import { ServicePersonaService } from '@components/mantenimiento/persona-catalogo/service-persona/service-persona.service';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';

@Component({
  selector: 'app-actualizar-stock-actual',
  templateUrl: './actualizar-stock-actual.component.html',
  styleUrls: ['./actualizar-stock-actual.component.scss']
})
export class ActualizarStockActualComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  almacen_get: any = [];
  inventario_save: any = [];
  dataform: any = '';
  userConn: any;
  usuario_logueado: any;

  nombre_ventana: string = "prgactstoactual.vb";

  public ventana = "Actualizar Stock Actual"
  public detalle = "ActualizarStock-create";
  public tipo = "ActualizarStock-CREATE";

  constructor(private api: ApiService, public dialog: MatDialog, public servicioInventario: ServicioInventarioService,
    public servicioPersona: ServicePersonaService, public servicioAlmacen: ServicioalmacenService, private _formBuilder: FormBuilder,
    private datePipe: DatePipe, private toastr: ToastrService, public log_module: LogService, public nombre_ventana_service: NombreVentanaService) {

    this.api.getRolUserParaVentana(this.nombre_ventana);
    this.usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
  }

  ngOnInit() {
    this.mandarNombre();

    this.servicioAlmacen.disparadorDeAlmacenes.subscribe(data => {
      console.log("Recibiendo Persona: ", data);
      this.almacen_get = data.almacen;
    });
  }

  createForm(): FormGroup {

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      id: [this.dataform.id],
      fecha: [this.datePipe.transform(this.dataform.fecha, "yyyy-MM-dd")],
      codalmacen: [this.dataform.codalmacen],
      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      usuarioreg: [this.usuario_logueado],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /inventario/oper/prgcrearinv/";
    console.log(data);

    return this.api.create("/inventario/oper/prgcrearinv/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.inventario_save = datav;

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

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
