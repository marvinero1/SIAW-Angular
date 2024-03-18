import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ServicioprecioventaService } from '@components/mantenimiento/ventas/servicioprecioventa/servicioprecioventa.service';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DeudoresCatalogoComponent } from '../../deudores/deudores-catalogo/deudores-catalogo.component';
import { DeudorCatalogoService } from '../../deudores/deudor-servicio/deudor-catalogo.service';

@Component({
  selector: 'app-deudores-integrantes',
  templateUrl: './deudores-integrantes.component.html',
  styleUrls: ['./deudores-integrantes.component.scss']
})
export class DeudoresIntegrantesComponent implements OnInit {

  FormularioData: FormGroup;  
  fecha_actual = new Date();
  hora_actual = new Date();
  userConn: string; 
  usuario: string; 
  usuario_logueado: string;
  cod_precio_venta_modal_codigo: string;

  dataform: any = '';
  deudores_cat: any = [];
  deudores: any = [];
  deudor_edit: any = [];
  miembro_save: any = [];
  deudor_catalogo: any = [];
  deudor_catalogo_id: any;
  deudor_edit_codigo: any;
  inputValue: number | null = null;

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  displayedColumns = ['iddeudor_compuesto', 'porcentaje', 'accion'];

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  constructor(public dialog: MatDialog, private api: ApiService, private spinner: NgxSpinnerService, private toastr: ToastrService,
    public nombre_ventana_service: NombreVentanaService, public log_module: LogService, public router: Router,
    @Inject(MAT_DIALOG_DATA) public dataIntegrantes: any, private _formBuilder: FormBuilder, private datePipe: DatePipe,
    private servicioDeudor: DeudorCatalogoService, public dialogRef: MatDialogRef<DeudoresIntegrantesComponent>) {
    this.FormularioData = this.createForm();

    this.deudor_edit = dataIntegrantes.dataIntegrantes;
    this.deudor_edit_codigo = dataIntegrantes.dataIntegrantes.id;
    console.log(this.deudor_edit);
    

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuario = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.getDeudorCatalogo();
    this.cargarTablaMiembrosDeudor();    
  }

  ngOnInit() {
    // precio_venta
    this.servicioDeudor.disparadorDeDeudor.subscribe(data => {
      console.log("Recibiendo Deudor: ", data);
      this.deudor_catalogo = data.deudor;
      this.deudor_catalogo_id = data.deudor.id;
    });
    // fin_precio_venta
  }

  cargarTablaMiembrosDeudor() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/fondos/mant/fndeudor_compuesto1/"
    return this.api.getAll('/fondos/mant/fndeudor_compuesto1/'+this.userConn+"/"+this.deudor_edit_codigo)
      .subscribe({
        next: (datav) => {
          this.deudores = datav;
          console.log(this.deudores);

          this.dataSource = new MatTableDataSource(this.deudores);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getDeudorCatalogo(){
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/seg_adm/mant/admoneda/";
    return this.api.getAll('/fondos/mant/fndeudor/catalogo/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.deudores_cat = datav;
        },
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      iddeudor: [this.dataform.iddeudor],
      iddeudor_compuesto: [this.dataform.iddeudor_compuesto],
      porcentaje: [this.dataform.porcentaje, Validators.pattern(/^-?\d+$/)],
    });
  }

  submitData(){
    let data = this.FormularioData.value;    
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:-- /fondos/mant/fndeudor_compuesto1/";
    return this.api.create("/fondos/mant/fndeudor_compuesto1/"+this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.miembro_save = datav;
          console.log(this.miembro_save);

          this.toastr.success('Guardado con Exito! 🎉');
          this.cargarTablaMiembrosDeudor();
        },
    
        error: (err) => { 
          console.log(err, errorMessage);
          // this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }
  
  onLeaveDeudor(event: any){
    const inputValue = event.target.value;
      
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.deudores_cat.some(objeto => objeto.id === inputValue);

    if(!encontrado){
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO INPUT");
    } else {
      event.target.value = inputValue;
    }

    // Puedes realizar otras acciones según tus necesidades
    console.log('Input perdió el foco', inputValue);
  }

  modalDeudores() { 
    this.dialog.open(DeudoresCatalogoComponent, {
      width: 'auto',
      height:'auto',
    });
  }

  onInputChange(value: string) {
    // Validar y formatear el valor ingresado
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
      this.inputValue = parsedValue;
    } else {
      this.inputValue = null;
    }
  }

  eliminar(element) {
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:-- /venta/mant/insolurgente_parametros/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/fondos/mant/fndeudor_compuesto1/'+this.userConn+"/"+this.deudor_edit_codigo+"/"+element.iddeudor)
        .subscribe({
          next: () => {
            // this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
            
            this.toastr.success('!ELIMINADO EXITOSAMENTE!');
            this.cargarTablaMiembrosDeudor();
            // location.reload();
          },
          error: (err: any) => { 
            console.log(err, errorMessage);
            this.toastr.error('! NO ELIMINADO !');
          },
          complete: () => { }
        })
      }else{
        this.toastr.error('! CANCELADO !');
      }
    });
  }

  close(){
    this.dialogRef.close();
  }
}
