import { Component, OnInit } from '@angular/core';
import { ApiService } from '@services/api.service';
import { AppService } from '@services/app.service';
@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

    public user;
    public session:any;
    public userConn:any;
    public usuario_logueado:any;
    rol:any=[];
    

    constructor(private appService: AppService, private api:ApiService){
    }

    ngOnInit(): void {  
        this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

        this.usuario_logueado =  this.api.dato_local_storage;
        this.session = JSON.parse(this.usuario_logueado);

        this.getRolUser(this.userConn, this.session);
    }

    logout() {
        this.api.logout();
    } 

    getRolUser(userConn, user){
        let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET, en la ruta /seg_adm/logs/selog/getselogfecha/  --Vista LOG/Angular";
        return this.api.getAll('/seg_adm/mant/adusuario/'+userConn+"/"+user)     
          .subscribe({
            next: (datav) => {
                this.rol = datav.codrol;       
                console.log(this.rol);         
            },
        
            error: (err: any) => { 
              console.log(err, errorMessage);
            },
            complete: () => { }
          })
    }
}
