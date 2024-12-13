import { AppState } from '@/store/state';
import { ToggleSidebarMenu } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { AfterViewInit, Component, HostBinding, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NombreVentanaService } from './footer/servicio-nombre-ventana/nombre-ventana.service';
@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
	@HostBinding('class') class = 'wrapper';

	public titulo_agencia: any;
	public ui: Observable<UiState>;

	private proformaPdfRoutes = ['proformaPDF', 'etiquetasItemsProforma', 'etiquetaImpresionProforma', 'etiquetaTuercasProforma',
		'Proforma', 'Facturacion Mostrador FEL', 'Modificar Proforma', 'Modificar Factura Mostrador FEL'];

	nombre_ventana: string;
	isProformaPdfPage = false;
	isProformPage = false;

	constructor(private renderer: Renderer2, private store: Store<AppState>, private router: Router,
		public nombre_ventana_service: NombreVentanaService) {

		this.titulo_agencia = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
		
		// if (this.titulo_agencia === 'Loc') {
		// 	this.titulo_agencia = 'Maq. Rodri'
		// }

		this.nombre_ventana_service.disparadorDeNombreVentana.subscribe(data => {
			console.log("Recibiendo Ventana: ", data.nombre_vent);
			this.nombre_ventana = data.nombre_vent;
			this.isProformaPdfPage = this.proformaPdfRoutes.includes(this.nombre_ventana);
		});
	}

	ngOnInit() {
		this.titulo_agencia = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;

		this.ui = this.store.select('ui');
		this.renderer.removeClass(
			document.querySelector('app-root'),
			'login-page'
		);
		this.renderer.removeClass(
			document.querySelector('app-root'),
			'register-page'
		);
		this.renderer.addClass(
			document.querySelector('app-root'),
			'layout-fixed'
		);

		this.ui.subscribe(
			({
				menuSidebarCollapsed,
				controlSidebarCollapsed,
				darkMode
			}) => {
				if (menuSidebarCollapsed) {
					this.renderer.removeClass(
						document.querySelector('app-root'),
						'sidebar-open'
					);
					this.renderer.addClass(
						document.querySelector('app-root'),
						'sidebar-collapse'
					);
				} else {
					this.renderer.removeClass(
						document.querySelector('app-root'),
						'sidebar-collapse'
					);
					this.renderer.addClass(
						document.querySelector('app-root'),
						'sidebar-open'
					);
				}

				if (controlSidebarCollapsed) {
					this.renderer.removeClass(
						document.querySelector('app-root'),
						'control-sidebar-slide-open'
					);
				} else {
					this.renderer.addClass(
						document.querySelector('app-root'),
						'control-sidebar-slide-open'
					);
				}

				if (darkMode) {
					this.renderer.addClass(
						document.querySelector('app-root'),
						'dark-mode'
					);
				} else {
					this.renderer.removeClass(
						document.querySelector('app-root'),
						'dark-mode'
					);
				}
			}
		);
	}


	onToggleMenuSidebar() {
		this.store.dispatch(new ToggleSidebarMenu());
	}
}