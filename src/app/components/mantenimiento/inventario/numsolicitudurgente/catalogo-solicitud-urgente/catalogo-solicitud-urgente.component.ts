import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { veNumeracion } from '@services/modelos/objetos';
import { Table } from 'primeng/table';
import { CatalogoSolUrgenteService } from './servicio-catalogo-sol-urgente/catalogo-sol-urgente.service';

@Component({
  selector: 'app-catalogo-solicitud-urgente',
  templateUrl: './catalogo-solicitud-urgente.component.html',
  styleUrls: ['./catalogo-solicitud-urgente.component.scss']
})
export class CatalogoSolicitudUrgenteComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler() {
    console.log("Hola Lola ENTER");

    this.mandarTipoId();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarTipoId();
  };

  id_tipo_sol_urgente!: veNumeracion[];
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

  constructor(public dialogRef: MatDialogRef<CatalogoSolicitudUrgenteComponent>, private api: ApiService,
    public servicioCatalogoSolicitudesUrgentes: CatalogoSolUrgenteService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.user = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
  }

  ngOnInit() {
    this.getIdTipoSolUrgente();
  }

  getIdTipoSolUrgente() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /inventario/mant/intiposolurgente/catalogo/";
    return this.api.getAll('/inventario/mant/intiposolurgente/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.id_tipo_sol_urgente = datav;

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
    this.servicioCatalogoSolicitudesUrgentes.disparadorDeCatalogoDeSolicitudesUrgentes.emit({
      id_sol_urgente: this.tipo_view.id,
      nro_actual: this.tipo_view.nroactual,
    });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

}
