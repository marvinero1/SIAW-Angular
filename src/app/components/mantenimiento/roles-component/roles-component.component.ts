import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RolesCreateComponent } from './roles-create/roles-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { Roles } from '@services/modelos/objetos';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { RolesEditComponent } from './roles-edit/roles-edit.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
@Component({
  selector: 'app-roles-component',
  templateUrl: './roles-component.component.html',
  styleUrls: ['./roles-component.component.scss']
})
export class RolesComponent implements OnInit {

  roles: any = [];
  semodulo: any = [];
  data_accesos: any = [];
  seclasificacion: any = [];
  cheked: any = [];

  array_ventanas_permiso_true: any = [{
    codprograma: 0,
    codrol: "",
    codigo: 0,
  }];

  array_ventanas_permiso_false: any = [{
    codprograma: 0,
    codrol: "",
    codigo: 0,
  }];

  userConn: string;
  visible: boolean = false;
  rol_select: any;

  displayedColumns = ['codigo', 'descripcion', 'dias_cambio', 'fechareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild("dialogD") dialogD: ElementRef;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | Roles>('');
  options: Roles[] = [];
  filteredOptions: Observable<Roles[]>;

  nombre_ventana: string = "abmserol.vb";
  public ventana = "Roles Usuarios"

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, public nombre_ventana_service: NombreVentanaService) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.getAllRoles();
    this.getAllModulos();
    this.getAllClasificacion();
  }

  private _filter(name: string): Roles[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(roles: Roles): string {
    return roles && roles.codigo ? roles.codigo : '';
  }

  pasarCheked(element_check, modulo) {
    let fal: boolean = false;
    let ved: boolean = true;

    console.log(element_check);
    let check = element_check.activo;

    if (check === true) {
      element_check.activo = fal;
      this.array_ventanas_permiso_true.push({
        codprograma: element_check.codigo,
        codrol: this.rol_select,
        codigo: modulo
      });

    } if (check === false) {
      element_check.activo = ved;
      this.array_ventanas_permiso_false.push({
        codprograma: element_check.codigo,
        codrol: this.rol_select,
        codigo: modulo
      });
    }

    console.log("Array de ventanas a guardar con check TRUE" + JSON.stringify(this.array_ventanas_permiso_true));
    console.log("Array de ventanas a guardar con check FALSE" + JSON.stringify(this.array_ventanas_permiso_false));

  }

  submitData() {
  }

  getAllRoles() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/serol/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.roles = datav;
          console.log(this.roles);

          this.spinner.show();

          setTimeout(() => {
            this.spinner.hide();
          }, 1500);

          this.dataSource = new MatTableDataSource(this.roles);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllModulos() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/oper/prgaccesosrol/semodulo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.semodulo = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllClasificacion() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/oper/prgaccesosrol/seclasificacion/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.seclasificacion = datav;
          console.log(this.seclasificacion);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  verOpciones(modulo, clasificacion) {
    console.log(modulo, clasificacion, this.rol_select);

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/seg_adm/oper/prgaccesorol/seprograma/";
    return this.api.getById('/seg_adm/oper/prgaccesosrol/serolprogs/rolGetCheck/' + this.userConn + "/" + this.rol_select + "/" + clasificacion + '/' + modulo)
      .subscribe({
        next: (datav) => {
          this.cheked = datav;
          console.log(this.cheked);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  verAcceso(codigo) {
    this.rol_select = codigo;
    if (this.visible == false) {
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

  eliminar(element): void {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /moneda Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/seg_adm/mant/serol/' + this.userConn + "/" + element.codigo)
          .subscribe({
            next: () => {

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

  openDialogCreateRol(): void {
    this.dialog.open(RolesCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  openDialogEditar(dataRolEdit): void {
    this.data_accesos = dataRolEdit;
    //console.log(this.data);
    const dialogRef = this.dialog.open(RolesEditComponent, {
      data: { dataRolEdit: dataRolEdit },
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
