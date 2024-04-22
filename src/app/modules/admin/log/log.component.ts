import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  private log=[];
  private errorMessage='';
  public fecha_actual = new Date();

  dataform:any='';
  userConn:any='';
  data='';

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['usuario','fecha','hora','entidad','ventana','detalle','tipo','codigo','id_doc','numeroid_doc'];
  dataSource = new MatTableDataSource();

  FormularioData:FormGroup;
  
  constructor(private api:ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, 
    private datePipe: DatePipe, private _formBuilder: FormBuilder){
      this.api.getRolUserParaVentana('DPD', '/logs');

      this.FormularioData = this.createForm();
  }

  ngOnInit(){
    this.getAllLogAtTheMoment();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  createForm(): FormGroup{ 
    return this._formBuilder.group({
      fecha: [this.datePipe.transform(this.dataform.fecha,"yyyy-MM-dd")],
    });
  }

  getAllLogAtTheMoment(){
    let errorMessage:string;
    let dataTransform = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET, en la ruta /seg_adm/logs/selog/getselogfecha/  --Vista LOG/Angular";
    return this.api.getAll('/seg_adm/logs/selog/getselogfecha/'+this.userConn+"/"+dataTransform)     
      .subscribe({
        next: (datav) => {
          this.log = datav;       
          console.log(this.log);
          this.spinner.show();

          this.dataSource = new MatTableDataSource(this.log.sort((a, b) => a.id - b.id));

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  buscadorFechaLog(){
    this.data = this.FormularioData.value.fecha;
    let dataTransform = this.datePipe.transform(this.FormularioData.value.fecha, "yyyy-MM-dd")
    
    this.errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /seg_adm/logs/selog/getselogfecha/";
    return this.api.getAll('/seg_adm/logs/selog/getselogfecha/'+this.userConn+"/"+dataTransform)    
      .subscribe({
        next: (datav) => {
          this.log = datav; 
          // console.log(this.tipo_cambio);
          
          this.spinner.show();
          this.dataSource = new MatTableDataSource(this.log);

          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },
    
        error: (err: any) => { 
          console.log(err, this.errorMessage);
        },
        complete: () => { }
      })
  }

  
}
