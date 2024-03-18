import { AppState } from '@/store/state';
import { ToggleControlSidebar, ToggleSidebarMenu } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api.service';
import { Observable, filter } from 'rxjs';
import { DatePipe, Location } from '@angular/common';
import { LogService } from '@services/log-service.service';

const BASE_CLASSES = 'main-header navbar navbar-expand navbar-warning';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit{

    private log:any=[];
    
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public searchForm: UntypedFormGroup;
    public tipo_cambio_dolar:any;
    public fecha_actual = new Date();
    public log_ruta=[];
    userConn:any='';
    data:any="";
    
    public ventana="login"
    public detalle="login-user";

    @Input() usuario: string;
    @Input() servidor: string;
    @Input() agencia: string;
    location: any;
    log_rutax:any;

    constructor(private store: Store<AppState>,private api:ApiService, public router:Router,public log_module:LogService,
        private _location: Location, private datePipe: DatePipe){
        this.onToggleMenuSidebar();
    }

    ngOnInit(){
        // IMPRIMIR DATOS DE CABECERA
        this.api.obtenerUsuarioLogueado();
        
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.navbarVariant}`;
        });
        this.searchForm = new UntypedFormGroup({
            search: new UntypedFormControl(null)
        });

        this.getAllLogHistorialRutas();
    }

    goBack(): void {
        this._location.back();
      }

    guardarRutaLOG(nombre, ruta){
        this.log_module.guardarVentana(nombre,'/');
        this.router.navigate([ruta]);
    }

    onToggleMenuSidebar() {
        this.store.dispatch(new ToggleSidebarMenu());
    }

    onToggleControlSidebar() {
        this.store.dispatch(new ToggleControlSidebar());
    }

    getAllLogHistorialRutas(){
        let errorMessage:string;
        let dataTransform = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    
        this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    
        errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET, en la ruta /seg_adm/logs/selog/getselogfecha/  --Vista LOG/Angular";
        return this.api.getAll('/seg_adm/logs/selog/getselogfecha/'+this.userConn+"/"+dataTransform)     
          .subscribe({
            next: (datav) => {
                this.log = datav;
                // console.log(this.log);
                this.log_ruta = this.log.filter((person) => person.tipo == 'ruta');          
            },
        
            error: (err: any) => { 
              console.log(err, errorMessage);
            },
            complete: () => { }
          })
    }

    rutaPATH(ruta){
    // console.log('http://localhost:4200'+ruta);
    
    this.router.navigate([ruta]);
    }
}
