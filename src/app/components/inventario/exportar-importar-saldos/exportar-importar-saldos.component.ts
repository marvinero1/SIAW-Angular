import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { ServicioInventarioService } from '../servicio-inventario/servicio-inventario.service';
import { ServicePersonaService } from '@components/mantenimiento/persona-catalogo/service-persona/service-persona.service';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';

@Component({
  selector: 'app-exportar-importar-saldos',
  templateUrl: './exportar-importar-saldos.component.html',
  styleUrls: ['./exportar-importar-saldos.component.scss']
})
export class ExportarImportarSaldosComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  almacen_get: any = [];
  inventario_save: any = [];
  dataform: any = '';
  userConn: any;

  nombre_ventana: string = "prgeximsaldo.vb";

  public ventana = "ExportarStock"
  public detalle = "ExportarStock-create";
  public tipo = "ExportarStock-CREATE";

  constructor(private api: ApiService, public dialog: MatDialog, public servicioInventario: ServicioInventarioService,
    public servicioPersona: ServicePersonaService, public servicioAlmacen: ServicioalmacenService, private toastr: ToastrService,
    public log_module: LogService) {

    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.servicioAlmacen.disparadorDeAlmacenes.subscribe(data => {
      console.log("Recibiendo Persona: ", data);
      this.almacen_get = data.almacen;
    });
  }

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

}
