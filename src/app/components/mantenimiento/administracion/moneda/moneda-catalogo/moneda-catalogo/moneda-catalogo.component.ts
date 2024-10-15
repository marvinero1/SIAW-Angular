import { Component, HostListener, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { moneda } from '@services/modelos/objetos';
import { MonedaServicioService } from '../../servicio-moneda/moneda-servicio.service';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-moneda-catalogo',
  templateUrl: './moneda-catalogo.component.html',
  styleUrls: ['./moneda-catalogo.component.scss']
})
export class MonedaCatalogoComponent implements OnInit, AfterViewInit {

  @HostListener('dblclick') onDoubleClicked2() {
    if(!this.moneda_view.codigo){
      this.toastr.warning("SELECCIONE UNA MONEDA BOBO!!!")
    }else{
      this.mandarMoneda();
    }
  };

  @HostListener("document:keydown.enter", []) unloadHandler0(event: KeyboardEvent) {
    if(!this.moneda_view.codigo){
      this.toastr.warning("SELECCIONE UNA MONEDA BOBO!!!")
    }else{
      this.mandarMoneda();
    }
  };

  public moneda_view: any = [];
  public codigo: string = '';
  public nombre: string = '';

  moneda: any = [];
  tipo_cambio_moneda: any = [];
  monedaBase: any = [];
  fecha_actual = new Date();

  private debounceTimer: any;
  BD_storage: any;
  userConn: string;

  @ViewChild('dt1') dt1: Table;
  @ViewChildren('para') paras: QueryList<ElementRef>;

  monedas!: moneda[];
  selectemonedas: moneda[];
  searchValue: string;

  constructor(private api: ApiService, public dialogRef: MatDialogRef<MonedaCatalogoComponent>,
    private serviciMoneda: MonedaServicioService, private datePipe: DatePipe,
    private toastr: ToastrService) {

    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
  }

  ngOnInit() {
    this.getMonedaBase();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.getAllmoneda();
  }

  getAllmoneda() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/seg_adm/mant/admoneda/'";
    return this.api.getAll('/seg_adm/mant/admoneda/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda = datav;
          this.monedas = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getMonedaBase() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /seg_adm/mant/adempresa/getcodMon/";
    return this.api.getAll('/seg_adm/mant/adempresa/getcodMon/' + this.userConn + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          this.monedaBase = datav;
          console.log(this.monedaBase);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getMonedaTipoCambio(moneda) {
    let fechareg = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/seg_adm/mant/adtipocambio/getmonedaValor/";
    return this.api.getAll('/seg_adm/mant/adtipocambio/getmonedaValor/' + this.userConn + "/" + this.monedaBase.moneda + "/" + moneda + "/" + fechareg)
      .subscribe({
        next: (datav) => {
          this.tipo_cambio_moneda = datav;
          console.log(this.tipo_cambio_moneda);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { 
          
        }
      })
  }

  getMonedabyId(moneda) {
    this.moneda_view = moneda.data;
    console.log(this.moneda_view);
    this.getMonedaTipoCambio(this.moneda_view.codigo);
  }

  onSearchChange(searchValue: string) {
    console.log(searchValue);

    // // Debounce logic
    // clearTimeout(this.debounceTimer);
    // this.debounceTimer = setTimeout(() => {
    //   this.dt1.filterGlobal(searchValue, 'contains');

    //   // Focus logic
    //   const elements = this.paras.toArray();
    //   let focused = false;
    //   for (const element of elements) {
    //     if (element.nativeElement.textContent.includes(searchValue)) {
    //       element.nativeElement.focus();
    //       focused = true;
    //       break;
    //     }
    //   }

    //   if (!focused) {
    //     console.warn('No se encontró ningún elemento para hacer focus');
    //   }
    // }, 550); // 750 ms de retardo
  }

  mandarMoneda() {
    this.serviciMoneda.disparadorDeMonedas.emit({
      moneda: this.moneda_view,
      tipo_cambio: this.tipo_cambio_moneda.valor,
    });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
