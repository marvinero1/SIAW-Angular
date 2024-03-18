import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ServicePersonaService } from '@components/mantenimiento/persona-catalogo/service-persona/service-persona.service';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CatalogoPersonaComponent } from '../../catalogo-persona/catalogo-persona.component';

@Component({
  selector: 'app-grupos-inventarios',
  templateUrl: './grupos-inventarios.component.html',
  styleUrls: ['./grupos-inventarios.component.scss']
})
export class GruposInventariosComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();

  array: any = [];
  array_new: any = [];
  grupo_inventario: any = [];
  persona_get: any = [];
  grupo: any = [];
  integrantes_grupo: any = [];
  data_inventario: any = [];
  grupo_create: any = [];
  data: [];
  panelOpenState = false; 
  userConn: any;
  dataform:any='';

  displayedColumns = ['codigo','nombre'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "abmingrupoper.vb";
   
  public ventana="grupo-inventario"
  public detalle="grupo-inventario-create";
  public tipo = "grupo-inventario-CREATE";

  constructor(public dialog: MatDialog, public servicioPersona: ServicePersonaService, public dialogRef: MatDialogRef<GruposInventariosComponent>,
    private api: ApiService, @Inject(MAT_DIALOG_DATA) public dataInventario: any, public log_module: LogService,private _formBuilder: FormBuilder,
    private toastr: ToastrService, private datePipe: DatePipe,private spinner: NgxSpinnerService) {
    
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.data_inventario = this.dataInventario.dataInventario;
    console.log(this.data_inventario);

    this.cargarGrupos();
    this.FormularioData = this.createForm();
  }

  ngOnInit(){
    this.servicioPersona.disparadorDePersonas.subscribe(data =>{
      // console.log("Recibiendo Persona: " , data);
      this.persona_get = data;

      this.array.push(this.persona_get);
      this.dataSource = new MatTableDataSource(this.array);
      this.dataSource.paginator = this.paginator;
      this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
    });

  }

  createForm(): FormGroup{
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    console.log(usuario_logueado);

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      // codigo: [this.dataform.codigo],
      codinvconsol: [this.data_inventario.codigo],
      nro: [this.dataform.nro, Validators.compose([Validators.required])],
      obs: [this.dataform.obs],
      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [usuario_logueado],
    });
  }

  submitData(){
  let data = this.FormularioData.value;
  let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:-- /inventario/mant/ingrupoper/";
  
  return this.api.create("/inventario/mant/ingrupoper/"+this.userConn, data)
    .subscribe({
      next: (datav) => {
        this.grupo_create = datav;
        
          this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
          this.onNoClick();
          this.spinner.show();
            setTimeout(() => {
            this.spinner.hide();
          }, 1500);
          this.toastr.success('Guardado con Exito! 🎉');      
      },
  
      error: (err) => { 
        console.log(err, errorMessage);
        this.toastr.error('! NO SE GUARDO !');

      },
      complete: () => { }
    })
  }

  agregarPersonas(){
    // console.log(this.array);

    // {
    //   "codgrupoper": 0,
    //   "codpersona": 0
    // }

    // mapeo que cambia un valor de un array
    this.array_new.map(function (dato) {
      console.log(dato);
      
      dato.codgrupoper = "store";
      dato.codpersona = "store";

    })
  }

  cargarGrupos(){ 
    let code = this.data_inventario.codigo;
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/inventario/mant/ingrupoper/"

    return this.api.getAll('/inventario/mant/ingrupoper/'+this.userConn+"/"+code)
      .subscribe({
        next: (datav) => {
          this.grupo = datav;
          console.log(this.grupo);
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  cargarIntegrantesGrupo(codigo_grupo){ 
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/inventario/mant/ingrupoper1/"

    return this.api.getAll('/inventario/mant/ingrupoper1/'+this.userConn+"/"+codigo_grupo)
      .subscribe({
        next: (datav) => {
          this.integrantes_grupo = datav;
          console.log(this.integrantes_grupo);
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  catalogoPepersona(codigo_grupo) { 
    this.dialog.open(CatalogoPersonaComponent, {
      width: 'auto',
      height: 'auto',
      data:{codigo_grupo:codigo_grupo},
    });
  }

  eliminar(){ 
    this.array.pop();
    console.log(this.array);

    this.dataSource = new MatTableDataSource(this.array);
    this.dataSource.paginator = this.paginator;
    this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
  }

  eliminarGrupo(element){
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:- /inventario/mant/ingrupoper/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result){
        return this.api.delete('/inventario/mant/ingrupoper/'+this.userConn+"/"+element)
        .subscribe({
          next: () => {
            this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
            
            this.toastr.success('!ELIMINADO EXITOSAMENTE!');
            this.cargarGrupos();
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

  eliminarGrupoPersona(integrante_codigo) {
    console.log(integrante_codigo.codgrupoper, integrante_codigo.codpersona);
    
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:- /inventario/mant/ingrupoper1/ Delete";

    let ventana="grupo-inventario"
    let detalle="grupo-inventario-delete";
    let tipo = "grupo-inventario-DELETE";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height:'auto',
      data:{dataUsuarioEdit:integrante_codigo},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/inventario/mant/ingrupoper1/'+this.userConn+"/"+integrante_codigo.codgrupoper+"/"+integrante_codigo.codpersona)
        .subscribe({
          next: () => {
            this.log_module.guardarLog(ventana, detalle, tipo);
            
            this.toastr.success('!ELIMINADO EXITOSAMENTE!');
            this.cargarGrupos();
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  close(){ 
    this.dialogRef.close();
  }
}
