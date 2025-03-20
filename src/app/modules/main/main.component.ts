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

	public ui: Observable<UiState>;

	private proformaPdfRoutes = ['proformaPDF',
		'etiquetasItemsProforma',
		'etiquetaImpresionProforma',
		'etiquetaTuercasProforma',
		'Facturacion Mostrador FEL',
		'Modificar Factura Mostrador FEL'];
	
	nombre_ventana: string;
	isProformaPdfPage = false;
	isProformPage = false;

	constructor(private renderer: Renderer2, private store: Store<AppState>, private router: Router,
		public nombre_ventana_service: NombreVentanaService) {

		this.nombre_ventana_service.disparadorDeNombreVentana.subscribe(data => {
			console.log("Recibiendo Ventana: ", data.nombre_vent);
			this.nombre_ventana = data.nombre_vent;
			this.isProformaPdfPage = this.proformaPdfRoutes.includes(this.nombre_ventana);
		});
	}

	ngOnInit() {
		this.ui = this.store.select('ui');
		if (document.querySelector('app-root')) {
			this.renderer.removeClass(
				document.querySelector('app-root'),
				'login-page'
			);
		};
		if (document.querySelector('app-root')) {
			this.renderer.removeClass(
				document.querySelector('app-root'),
				'register-page'
			);
		};
		if (document.querySelector('app-root')) {
			this.renderer.addClass(
				document.querySelector('app-root'),
				'layout-fixed'
			);
		};

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