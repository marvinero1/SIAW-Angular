import { Component, HostListener, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { veNumeracion } from '@services/modelos/objetos';
import { Table } from 'primeng/table';
import { AnticiposService } from './servicio-mandar-anticipos/anticipos.service';

@Component({
  selector: 'app-modal-anticipos',
  templateUrl: './modal-anticipos.component.html',
  styleUrls: ['./modal-anticipos.component.scss']
})
export class ModalAnticiposComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler() {
    this.mandarTipoId();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarTipoId();
  };

  id_tipo!: veNumeracion[];
  seletedid_tipo: veNumeracion[];
  searchValue: string;

  public codigo: string = '';
  public tipo_view: any = [];
  public numero_id: string;
  

  userConn: any;
  user: any;

  private debounceTimer: any;

  @ViewChild('dt1') dt1: Table;
  @ViewChildren('para') paras: QueryList<ElementRef>;

  constructor(public dialogRef: MatDialogRef<ModalAnticiposComponent>, private api: ApiService,
    public servicioAnticipos: AnticiposService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.user = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
  }

  ngOnInit() {
    this.getIdTipo();
  }

  getIdTipo() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -ctsxcob/mant/cotipoanticipo/catalogo/";
    return this.api.getAll('/ctsxcob/mant/cotipoanticipo/catalogo/' + this.userConn)
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

  onSearchChange(searchValue: string) {
    console.log(searchValue);

    // Debounce logic
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.dt1.filterGlobal(searchValue, 'contains');

      // Focus logic
      const elements = this.paras.toArray();
      let focused = false;
      for (const element of elements) {
        if (element.nativeElement.textContent.includes(searchValue)) {
          element.nativeElement.focus();
          focused = true;
          break;
        }
      }

      if (!focused) {
        console.warn('No se encontró ningún elemento para hacer focus');
      }
    }, 750); // 750 ms de retardo
  }

  mandarTipoId() {
    this.servicioAnticipos.disparadorDeCatalagoAnticipo.emit({
      id_anticipo: this.tipo_view,
      // numero_id:
    });
    this.close();
  }

  close(){
    this.dialogRef.close();
  }
}
