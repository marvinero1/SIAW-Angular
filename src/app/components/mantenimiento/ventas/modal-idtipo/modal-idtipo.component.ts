import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { veNumeracion } from '@services/modelos/objetos';
import { TipoidService } from '../serviciotipoid/tipoid.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-modal-idtipo',
  templateUrl: './modal-idtipo.component.html',
  styleUrls: ['./modal-idtipo.component.scss']
})

export class ModalIdtipoComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler() {
    console.log("Hola Lola ENTER");

    this.mandarTipoId();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarTipoId();
  };

  id_tipo!: veNumeracion[];
  seletedid_tipo: veNumeracion[];
  searchValue: string | undefined;

  public codigo: string = '';
  public tipo_view: any = [];
  public numero_id: string;

  userConn: any;
  user: any;

  @ViewChild('dt1') dt1: Table;

  constructor(public dialogRef: MatDialogRef<ModalIdtipoComponent>, private api: ApiService,
    public servicioTipoID: TipoidService) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.user = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
  }

  ngOnInit() {
    this.getIdTipo();
  }

  getIdTipo() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/venumeracion/catalogoNumProfxUsuario/' + this.userConn + "/" + this.user)
      .subscribe({
        next: (datav) => {
          this.id_tipo = datav;

          console.log('data', datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getIdTipoView(element) {
    console.log(element)
    this.tipo_view = element.data;
  }

  // private debounceTimer: any;
  // onSearchChange(searchValue: string) {
  //   console.log(searchValue);
  //   clearTimeout(this.debounceTimer);
  //   this.debounceTimer = setTimeout(() => {
  //     this.dt1.filterGlobal(searchValue, 'contains');
  //   }, 750); // 750 ms de retardo
  // }

  mandarTipoId() {
    this.servicioTipoID.disparadorDeIDTipo.emit({
      id_tipo: this.tipo_view,
      // numero_id:
    });

    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
