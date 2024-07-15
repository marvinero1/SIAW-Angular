import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ModalCatalogoNumeracionProformaComponent } from './modal-catalogo-numeracion-proforma/modal-catalogo-numeracion-proforma.component';
import { ServicioidproformaService } from './servicioidproforma.service';
import { ModalUsuarioComponent } from '@components/mantenimiento/usuario/modal-usuario/modal-usuario.component';
import { ServicioUsuarioService } from '@components/mantenimiento/usuario/service-usuario/servicio-usuario.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-id-proforma-usuario',
  templateUrl: './id-proforma-usuario.component.html',
  styleUrls: ['./id-proforma-usuario.component.scss']
})
export class IdProformaUsuarioComponent implements OnInit {

  idproforma: any = [];
  id_proforma_service: any;
  cod_usuario: any;
  guardar_proforma: any = [];
  usuario_get: any = [];
  usuarioLogueado: any;
  data: [];
  userConn: any;

  displayedColumns = ['id', 'usuario', 'idproforma', 'grupo', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "prgadusuario_idproforma.vb";
  public ventana = "ID de Proformas Por Usuario"
  public detalle = "id-proforma-detalle";
  public tipo = "transaccion-id-proforma-POST";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, public log_module: LogService,
    private toastr: ToastrService, private servicioIDProforma: ServicioidproformaService, public nombre_ventana_service: NombreVentanaService,
    public usuarioservice: ServicioUsuarioService) {

    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.getAllIdProformaUsuario();
    this.getUsuario();
    this.api.getRolUserParaVentana(this.nombre_ventana);
    this.mandarNombre();
  }

  ngOnInit(): void {
    this.usuarioservice.disparadorDeUsuarios.subscribe(data => {
      console.log("Recibiendo Usuario: ", data);
      this.cod_usuario = data.usuario;
    });

    this.servicioIDProforma.disparadorDeIDProformas.subscribe(data => {
      console.log("Recibiendo ID Proforma: ", data);
      this.id_proforma_service = data.id_proforma;
    });
  }

  getAllIdProformaUsuario() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/adusuario_idproforma/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.idproforma = datav;
          console.log(this.idproforma);

          this.dataSource = new MatTableDataSource(this.idproforma);
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

  getUsuario() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/adusuario/catalogo/"
    return this.api.getAll('/seg_adm/mant/adusuario/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.usuario_get = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  submitData() {
    let data = {
      usuario: this.cod_usuario,
      idproforma: this.id_proforma_service,
      grupo: "",
    };

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-- /seg_adm/mant/adusuario_idproforma/";
    return this.api.create("/seg_adm/mant/adusuario_idproforma/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.guardar_proforma = datav;
          console.log(this.guardar_proforma);

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.spinner.show();
          this.toastr.success(this.guardar_proforma.usuario_idasignado);
          this.getAllIdProformaUsuario();
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');
          this.toastr.error(this.guardar_proforma.usuario_idasignado);
        },
        complete: () => { }
      })
  }

  eliminar(element): void {
    let ventana = "idproforma"
    let detalle = "idproforma-delete";
    let tipo = "idproforma-DELETE";

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  seg_adm/mant/adarea/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/seg_adm/mant/adusuario_idproforma/' + this.userConn + "/" + element.id)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(ventana, detalle, tipo, "", "");

              this.toastr.success('!ELIMINADO EXITOSAMENTE!');
              location.reload();
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

  onLeaveUsuario(event: any) {
    const inputValue = event.target.value;
    let mayus = inputValue.toUpperCase();

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.usuario_get.some(objeto => objeto.login === mayus);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO INPUT");
    } else {
      this.cod_usuario == mayus;
    }

    // Puedes realizar otras acciones según tus necesidades
    console.log('Input perdió el foco', mayus);
  }

  modalUsuario(): void {
    this.dialog.open(ModalUsuarioComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalTipoIDProforma(): void {
    this.dialog.open(ModalCatalogoNumeracionProformaComponent, {
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
