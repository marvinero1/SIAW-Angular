import {Injectable} from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router
} from '@angular/router';
import {Observable} from 'rxjs';
import {AppService} from '@services/app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private router: Router, private appService: AppService, private toastr: ToastrService) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        
        // console.log(sessionStorage.length);

        if(sessionStorage.length == 0){
            this.router.navigate(['/login']);
            this.toastr.info('Tiene que Iniciar Sesion, AuthGuard Activo 🛡️');
            console.log("No hay Session, no puede ingresar al sistema.");

            return false; 
        }else{
            return true;
        }
    }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.canActivate(next, state);
    }
}
