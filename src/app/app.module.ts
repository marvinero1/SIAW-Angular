import { LOCALE_ID, NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER, isDevMode } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DatePipe, PathLocationStrategy } from '@angular/common';
import { LocationStrategy, DecimalPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { AppRoutingModule } from '@/app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from '@modules/main/main.component';
import { LoginComponent } from '@modules/login/login.component';
import { HeaderComponent } from '@modules/main/header/header.component';
import { FooterComponent } from '@modules/main/footer/footer.component';
import { MenuSidebarComponent } from '@modules/main/menu-sidebar/menu-sidebar.component';
import { BlankComponent } from '@pages/blank/blank.component';
import { ProfileComponent } from '@pages/profile/profile.component';
import { RegisterComponent } from '@modules/register/register.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { ToastrModule } from 'ngx-toastr';
import { MessagesComponent } from '@modules/main/header/messages/messages.component';
import { NotificationsComponent } from '@modules/main/header/notifications/notifications.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { registerLocaleData } from '@angular/common';
import { UserComponent } from '@modules/main/header/user/user.component';
import { ForgotPasswordComponent } from '@modules/forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from '@modules/recover-password/recover-password.component';
import { LanguageComponent } from '@modules/main/header/language/language.component';
import { MainMenuComponent } from './pages/main-menu/main-menu.component';
import { SubMenuComponent } from './pages/main-menu/sub-menu/sub-menu.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { ControlSidebarComponent } from './modules/main/control-sidebar/control-sidebar.component';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './store/auth/reducer';
import { uiReducer } from './store/ui/reducer';
import { defineCustomElements } from '@profabric/web-components/loader';
import { SidebarSearchComponent } from './components/sidebar-search/sidebar-search.component';
import { MenuImportacionesComponent } from './modules/menu-importaciones/menu-importaciones.component';
import { UsuarioComponent } from '@components/mantenimiento/usuario/usuario.component';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UsuarioCreateComponent } from './components/mantenimiento/usuario/usuario-create/usuario-create.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UsuarioEditComponent } from './components/mantenimiento/usuario/usuario-edit/usuario-edit.component';
import { UsuarioDeleteComponent } from '@components/mantenimiento/usuario/usuario-delete/usuario-delete.component';
import { LaboratorioComponent } from './components/laboratorio/laboratorio.component';
import { DialogDeleteComponent } from './modules/dialog-delete/dialog-delete.component';
import { MaterialExampleModule } from 'material.module';
import { DptopaisComponent } from '@components/mantenimiento/administracion/dptopais/dptopais.component';
import { ProvinciadptopaisComponent } from '@components/mantenimiento/administracion/provinciadptopais/provinciadptopais.component';
import { DptopaisCreateComponent } from '@components/mantenimiento/administracion/dptopais/dptopais-create/dptopais-create.component';
import { DptopaisEditComponent } from '@components/mantenimiento/administracion/dptopais/dptopais-edit/dptopais-edit.component';
import { ProvinciadptopaisCreateComponent } from '@components/mantenimiento/administracion/provinciadptopais/provinciadptopais-create/provinciadptopais-create.component';
import { UnidadnegocioComponent } from '@components/mantenimiento/administracion/unidadnegocio/unidadnegocio.component';
import { UnidadnegocioCreateComponent } from '@components/mantenimiento/administracion/unidadnegocio/unidadnegocio-create/unidadnegocio-create.component';
import { TipocambioComponent } from '@components/mantenimiento/administracion/tipocambio/tipocambio.component';
import { TipocambioCreateComponent } from '@components/mantenimiento/administracion/tipocambio/tipocambio-create/tipocambio-create.component';
import { TipocambiovalidacionComponent } from '@components/seguridad/tipocambiovalidacion/tipocambiovalidacion.component';
import { TipocambiovalidacionCreateComponent } from '@components/seguridad/tipocambiovalidacion/tipocambiovalidacion-create/tipocambiovalidacion-create.component';
import { MenuVentasComponent } from '@modules/menu-ventas/menu-ventas.component';
import { LogComponent } from '@modules/admin/log/log.component';
import { ParamempresaComponent } from '@components/archivo/paramempresa/paramempresa.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSortModule } from '@angular/material/sort';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PortalModule } from '@angular/cdk/portal';
import { AuthGuard } from '@guards/auth.guard';
import { Interceptor } from '@services/interceptor';
import { NonAuthGuard } from '@guards/non-auth.guard';

import { RefreshPasswordComponent } from '@modules/refresh-password/refresh-password.component';
import { TransformacionDigitalComponent } from '@modules/transformacion-digital/transformacion-digital.component';
import { PageNotFoundComponent } from '@pages/errors/page-not-found/page-not-found.component';
import { HerramientasComponent } from '@modules/main/header/herramientas/herramientas.component';
import { ReportesComponent } from '@modules/main/header/reportes/reportes.component';
import { AyudaComponent } from '@modules/main/header/ayuda/ayuda.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { SesionExpiradaComponent } from '@pages/errors/sesion-expirada/sesion-expirada.component';
import { InterbancosComponent } from '@pages/interbancos/interbancos.component';
import { LogService } from '@services/log-service.service';
import { NgPipesModule } from 'ngx-pipes';
import { HotTableModule } from '@handsontable/angular';
import { registerAllModules } from 'handsontable/registry';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Ripple, RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';


import { ModalMinimoComplementariasComponent } from '@components/archivo/paramempresa/modales/modalMinimoComplementarias/modalMinimoComplementarias.component';
import { ModalCreditoAutorizacionComponent } from '@components/archivo/paramempresa/modales/modalCreditoAutorizacion/modalCreditoAutorizacion.component';
import { ModalPreciosFacturacionComponent } from '@components/archivo/paramempresa/modales/modalPreciosFacturacion/modalPreciosFacturacion.component';
import { NumnotasdemovimientoComponent } from '@components/mantenimiento/inventario/numnotasdemovimiento/numnotasdemovimiento.component';
import { NumnotasdemovimientoCreateComponent } from '@components/mantenimiento/inventario/numnotasdemovimiento/numnotasdemovimiento-create/numnotasdemovimiento-create.component';
import { NumnotasdemovimientoEditComponent } from '@components/mantenimiento/inventario/numnotasdemovimiento/numnotasdemovimiento-edit/numnotasdemovimiento-edit.component';
import { ItemComponent } from '@components/mantenimiento/inventario/item/item.component';
import { TipoconocimientocargaCreateComponent } from '@components/mantenimiento/inventario/tipoconocimientocarga/tipoconocimientocarga-create/tipoconocimientocarga-create.component';
import { TipoconocimientocargaComponent } from '@components/mantenimiento/inventario/tipoconocimientocarga/tipoconocimientocarga.component';
import { NumsolicitudurgenteComponent } from '@components/mantenimiento/inventario/numsolicitudurgente/numsolicitudurgente.component';
import { NumsolicitudurgenteCreateComponent } from '@components/mantenimiento/inventario/numsolicitudurgente/numsolicitudurgente-create/numsolicitudurgente-create.component';
import { TipoinventarioComponent } from '@components/mantenimiento/inventario/tipoinventario/tipoinventario.component';
import { TipoinventarioCreateComponent } from '@components/mantenimiento/inventario/tipoinventario/tipoinventario-create/tipoinventario-create.component';
import { AlmacenCreateComponent } from '@components/mantenimiento/inventario/almacen/almacen-create/almacen-create.component';
import { AlmacenComponent } from '@components/mantenimiento/inventario/almacen/almacen.component';
import { ItemCreateComponent } from '@components/mantenimiento/inventario/item/item-create/item-create.component';
import { RoscaComponent } from '@components/mantenimiento/inventario/rosca/rosca.component';
import { UnidadmedidaComponent } from '@components/mantenimiento/inventario/unidadmedida/unidadmedida.component';
import { TerminacionComponent } from '@components/mantenimiento/inventario/terminacion/terminacion.component';
import { ResistenciaComponent } from '@components/mantenimiento/inventario/resistencia/resistencia.component';
import { RoscaCreateComponent } from '@components/mantenimiento/inventario/rosca/rosca-create/rosca-create.component';
import { RoscaEditComponent } from '@components/mantenimiento/inventario/rosca/rosca-edit/rosca-edit.component';
import { ResistenciaCreateComponent } from '@components/mantenimiento/inventario/resistencia/resistencia-create/resistencia-create.component';
import { ResistenciaEditComponent } from '@components/mantenimiento/inventario/resistencia/resistencia-edit/resistencia-edit.component';
import { TerminacionCreateComponent } from '@components/mantenimiento/inventario/terminacion/terminacion-create/terminacion-create.component';
import { NumpedidomercaderiaComponent } from '@components/mantenimiento/inventario/numpedidomercaderia/numpedidomercaderia.component';
import { NumpedidomercaderiaCreateComponent } from '@components/mantenimiento/inventario/numpedidomercaderia/numpedidomercaderia-create/numpedidomercaderia-create.component';
import { GruposlineasComponent } from '@components/mantenimiento/inventario/gruposlineas/gruposlineas.component';
import { GruposlineasCreateComponent } from '@components/mantenimiento/inventario/gruposlineas/gruposlineas-create/gruposlineas-create.component';
import { GruposlineasdescuentosCreateComponent } from '@components/mantenimiento/inventario/gruposlineasdescuentos/gruposlineasdescuentos-create/gruposlineasdescuentos-create.component';
import { GruposlineasdescuentosComponent } from '@components/mantenimiento/inventario/gruposlineasdescuentos/gruposlineasdescuentos.component';
import { LineaproductoComponent } from '@components/mantenimiento/inventario/lineaproducto/lineaproducto.component';
import { LineaproductoCreateComponent } from '@components/mantenimiento/inventario/lineaproducto/lineaproducto-create/lineaproducto-create.component';
import { ConceptosmovimientosmercaderiaCreateComponent } from '@components/mantenimiento/inventario/conceptosmovimientosmercaderia/conceptosmovimientosmercaderia-create/conceptosmovimientosmercaderia-create.component';
import { ConceptosmovimientosmercaderiaComponent } from '@components/mantenimiento/inventario/conceptosmovimientosmercaderia/conceptosmovimientosmercaderia.component';
import { UnidadmedidaCreateComponent } from '@components/mantenimiento/inventario/unidadmedida/unidadmedida-create/unidadmedida-create.component';
import { RolesComponent } from './components/mantenimiento/roles-component/roles-component.component';
import { ModalSaldoCubrirComponent } from '@components/mantenimiento/inventario/item/modal-saldoCubrir/modal-saldoCubrir.component';
import { ModalComponenteskitComponent } from '@components/mantenimiento/inventario/item/modal-componenteskit/modal-componenteskit.component';
import { ModalMaximoVentasComponent } from '@components/mantenimiento/inventario/item/modal-maximoVentas/modal-maximoVentas.component';
import { ItemEditComponent } from '@components/mantenimiento/inventario/item/item-edit/item-edit.component';
import { ModalPrecioControlComponent } from '@components/mantenimiento/inventario/item/modal-precioControl/modal-precioControl.component';
import { ParametroUsuarioComponent } from '@pages/profile/parametroUsuario/parametroUsuario.component';
import { BancoComponent } from '@components/mantenimiento/fondos/banco/banco.component';
import { MenuFondosComponent } from '@modules/menu-fondos/menu-fondos.component';
import { BancoCreateComponent } from '@components/mantenimiento/fondos/banco/banco-create/banco-create.component';
import { NumpedidomercaderiaEditComponent } from '@components/mantenimiento/inventario/numpedidomercaderia/numpedidomercaderia-edit/numpedidomercaderia-edit.component';
import { RolesCreateComponent } from '@components/mantenimiento/roles-component/roles-create/roles-create.component';
import { RolesEditComponent } from '@components/mantenimiento/roles-component/roles-edit/roles-edit.component';
import { MantenimientoComponent } from '@modules/mantenimiento/mantenimiento.component';
import { ArchivoComponent } from '@modules/main/header/archivo/archivo.component';
import { MenuInventarioComponent } from '@modules/menu-inventario/menu-inventario.component';
import { MenuCuentasCobrarComponent } from '@modules/menu-cuentas-cobrar/menu-cuentas-cobrar.component';
import { MenuContabilidadComponent } from '@modules/menu-contabilidad/menu-contabilidad.component';
import { MenuActivosFijosComponent } from '@modules/menu-activos-fijos/menu-activos-fijos.component';
import { MenuPlanillasPersonalComponent } from '@modules/menu-planillas-personal/menu-planillas-personal.component';
import { MenuComprasComponent } from '@modules/menu-compras/menu-compras.component';
import { VehiculoComponent } from '@components/mantenimiento/administracion/vehiculo/vehiculo.component';
import { MonedaComponent } from '@components/mantenimiento/administracion/moneda/moneda.component';
import { AreaComponent } from '@components/mantenimiento/administracion/area/area.component';
import { EmpresaComponent } from '@components/mantenimiento/administracion/empresa/empresa.component';
import { LocalidadesComponent } from '@components/mantenimiento/administracion/localidades/localidades.component';
import { MonedaCreateComponent } from '@components/mantenimiento/administracion/moneda/moneda-create/moneda-create.component';
import { EmpresaCreateComponent } from '@components/mantenimiento/administracion/empresa/empresa-create/empresa-create.component';
import { AreaCreateComponent } from '@components/mantenimiento/administracion/area/area-create/area-create.component';
import { LocalidadesCreateComponent } from '@components/mantenimiento/administracion/localidades/localidades-create/localidades-create.component';
import { AreaEditComponent } from '@components/mantenimiento/administracion/area/area-edit/area-edit.component';
import { LocalidadesEditComponent } from '@components/mantenimiento/administracion/localidades/localidades-edit/localidades-edit.component';
import { IdProformaUsuarioComponent } from '@components/mantenimiento/administracion/id-proforma-usuario/id-proforma-usuario.component';
import { ModalCatalogoNumeracionProformaComponent } from '@components/mantenimiento/administracion/id-proforma-usuario/modal-catalogo-numeracion-proforma/modal-catalogo-numeracion-proforma.component';
import { ModalUsuarioComponent } from '@components/mantenimiento/usuario/modal-usuario/modal-usuario.component';
import { RubroComponent } from '@components/mantenimiento/rubro/rubro.component';
import { RubroCreateComponent } from '@components/mantenimiento/rubro/rubro-create/rubro-create.component';
import { ModalRubroComponent } from '@components/mantenimiento/rubro/modal-rubro/modal-rubro.component';
import { VehiculoCreateComponent } from '@components/mantenimiento/administracion/vehiculo/vehiculo-create/vehiculo-create.component';
import { VehiculoEditComponent } from '@components/mantenimiento/administracion/vehiculo/vehiculo-edit/vehiculo-edit.component';
import { PeriodosSistemaComponent } from '@components/mantenimiento/administracion/periodos-sistema/periodos-sistema.component';
import { TarifaPermitidasUsuarioComponent } from '@components/mantenimiento/administracion/tarifa-permitidas-usuario/tarifa-permitidas-usuario.component';
import { PermisosEspecialesComponent } from '@components/mantenimiento/seguridad/permisos-especiales/permisos-especiales.component';
import { PermisosEspecialesCreateComponent } from '@components/mantenimiento/seguridad/permisos-especiales/permisos-especiales-create/permisos-especiales-create.component';
import { PersonaCatalogoComponent } from '@components/mantenimiento/persona-catalogo/persona-catalogo.component';
import { PermisosEspecialesEditComponent } from '@components/mantenimiento/seguridad/permisos-especiales/permisos-especiales-edit/permisos-especiales-edit.component';
import { LogUsuarioComponent } from '@modules/admin/log-usuario/log-usuario.component';
import { ReservaAlmacenesComponent } from '@components/mantenimiento/inventario/almacen/reserva-almacenes/reserva-almacenes.component';
import { UrgentesAlmacenesComponent } from '@components/mantenimiento/inventario/almacen/urgentes-almacenes/urgentes-almacenes.component';
import { StockAlmacenesComponent } from '@components/mantenimiento/inventario/almacen/stock-almacenes/stock-almacenes.component';
import { ModificarParametroAComponent } from '@pages/profile/modificar-parametro-A/modificar-parametro-A.component';
import { ParametrosFacturacionSIATComponent } from '@components/mantenimiento/siat/parametros-facturacion-SIAT/parametros-facturacion-SIAT.component';
import { CrearTomaInventarioComponent } from '@components/inventario/crear-toma-inventario/crear-toma-inventario.component';
import { TomaInventarioConsolidadoComponent } from '@components/inventario/toma-inventario-consolidado/toma-inventario-consolidado.component';
import { CatalogoInventarioComponent } from '@components/inventario/catalogo-inventario/catalogo-inventario.component';
import { PrecioItemComponent } from '@components/inventario/operaciones/precio-item/precio-item.component';
import { ActualizarPrecioItemComponent } from '@components/inventario/operaciones/precio-item/actualizar-precio-item/actualizar-precio-item.component';
import { ActualizarStockActualComponent } from '@components/inventario/saldos-inventario/actualizar-stock-actual/actualizar-stock-actual.component';
import { ExportarImportarSaldosComponent } from '@components/inventario/exportar-importar-saldos/exportar-importar-saldos.component';
import { GruposInventariosComponent } from '@components/inventario/toma-inventario-consolidado/grupos-inventarios/grupos-inventarios/grupos-inventarios.component';
import { SaldosInventarioConsolidadoComponent } from '@components/inventario/toma-inventario-consolidado/saldos/saldos-inventario-consolidado/saldos-inventario-consolidado.component';
import { CatalogoPersonaComponent } from '@components/inventario/toma-inventario-consolidado/catalogo-persona/catalogo-persona.component';
import { CambiarPasswordComponent } from '@modules/cambiar-password/cambiar-password.component';
import { ConsolidarInventarioComponent } from '@components/inventario/toma-inventario-consolidado/consolidar-inventario/consolidar-inventario.component';
import { ValidarPrecioItemComponent } from '@components/inventario/operaciones/precio-item/validar-precio-item/validar-precio-item.component';
import { ValidarPermisoItemComponent } from '@components/inventario/operaciones/precio-item/validar-permiso-item/validar-permiso-item.component';
import { PermisoEspecialPasswordComponent } from '@components/seguridad/permiso-especial-password/permiso-especial-password.component';
import { NotasAjustesComponent } from '@components/inventario/toma-inventario-consolidado/notas-ajustes/notas-ajustes.component';
import { CatalogoNotasMovimientoComponent } from '@components/mantenimiento/inventario/numnotasdemovimiento/catalogo-notas-movimiento/catalogo-notas-movimiento.component';
import { CatalogoMovimientoMercaderiaComponent } from '@components/mantenimiento/inventario/conceptosmovimientosmercaderia/catalogo-movimiento-mercaderia/catalogo-movimiento-mercaderia.component';
import { ValidarComponent } from '@components/inventario/toma-inventario-consolidado/validar/validar.component';
import { RegistrarInventarioGrupoComponent } from '@components/inventario/registrar-inventario-grupo/registrar-inventario-grupo.component';
import { ConfirmacionNotasAjustesComponent } from '@components/inventario/toma-inventario-consolidado/notas-ajustes/confirmacion-notas-ajustes/confirmacion-notas-ajustes.component';
import { ProvinciasCatalogoComponent } from '@components/mantenimiento/administracion/provinciadptopais/provincias-catalogo/provincias-catalogo.component';
import { MatrizInventarioComponent } from '@components/inventario/matriz-inventario/matriz-inventario.component';
import { ProformaComponent } from '@components/mantenimiento/ventas/transacciones/proforma/proforma.component';
import { CatalogoClientesIgualesComponent } from '@components/mantenimiento/ventas/clientes-iguales/catalogo-clientes-iguales/catalogo-clientes-iguales.component';
import { ClientesIgualesComponent } from '@components/mantenimiento/ventas/clientes-iguales/clientes-iguales.component';
import { ClientesComponent } from '@components/mantenimiento/ventas/clientes/clientes.component';
import { DescuentosEspecialesComponent } from '@components/mantenimiento/ventas/descuentos-especiales/descuentos-especiales.component';
import { CatalogoLugarComponent } from '@components/mantenimiento/ventas/lugares/catalogo-lugar/catalogo-lugar.component';
import { LugaresComponent } from '@components/mantenimiento/ventas/lugares/lugares.component';
import { MatrizItemsComponent } from '@components/mantenimiento/ventas/matriz-items/matriz-items.component';
import { ModalClienteInfoComponent } from '@components/mantenimiento/ventas/modal-cliente-info/modal-cliente-info.component';
import { ModalClienteComponent } from '@components/mantenimiento/ventas/modal-cliente/modal-cliente.component';
import { ModalDescuentosComponent } from '@components/mantenimiento/ventas/descuentos-especiales/modal-descuentos/modal-descuentos.component';
import { ModalIdtipoComponent } from '@components/mantenimiento/ventas/modal-idtipo/modal-idtipo.component';
import { ModalItemsComponent } from '@components/mantenimiento/ventas/modal-items/modal-items.component';
import { ModalPrecioVentaComponent } from '@components/mantenimiento/ventas/modal-precio-venta/modal-precio-venta.component';
import { ModalSaldosComponent } from '@components/mantenimiento/ventas/matriz-items/modal-saldos/modal-saldos.component';
import { ModalVendedorComponent } from '@components/mantenimiento/ventas/modal-vendedor/modal-vendedor.component';
import { ModalZonaComponent } from '@components/mantenimiento/ventas/modal-zona/modal-zona.component';
import { ClasificacionClientesComponent } from '@components/mantenimiento/ventas/niveles-descuentos/clasificacion-clientes/clasificacion-clientes.component';
import { NivelesDescuentosComponent } from '@components/mantenimiento/ventas/niveles-descuentos/niveles-descuentos.component';
import { CatalogoPuntoVentaComponent } from '@components/mantenimiento/ventas/punto-venta/catalogo-punto-venta/catalogo-punto-venta.component';
import { PuntoVentaComponent } from '@components/mantenimiento/ventas/punto-venta/punto-venta.component';
import { FacturaNotaRemisionComponent } from '@components/mantenimiento/ventas/transacciones/factura-nota-remision/factura-nota-remision.component';
import { NotaRemisionComponent } from '@components/mantenimiento/ventas/transacciones/nota-remision/nota-remision.component';
import { DocumentationErrorsComponent } from '@pages/errors/documentation-errors/documentation-errors.component';
import { TiposCreditoComponent } from '@components/mantenimiento/ventas/tipos-credito/tipos-credito.component';
import { VendedoresComponent } from '@components/mantenimiento/ventas/vendedores/vendedores.component';
import { RecargoDocumentoComponent } from '@components/mantenimiento/ventas/recargo-documento/recargo-documento.component';
import { PlanPagoClientesComponent } from '@components/mantenimiento/ventas/plan-pago-clientes/plan-pago-clientes.component';
import { ObservacionesHojaRutaComponent } from '@components/mantenimiento/ventas/observaciones-hoja-ruta/observaciones-hoja-ruta.component';
import { TiposCreditoCreateComponent } from '@components/mantenimiento/ventas/tipos-credito/tipos-credito-create/tipos-credito-create.component';
import { ObservHojaRutaCreateComponent } from '@components/mantenimiento/ventas/observaciones-hoja-ruta/observ-hoja-ruta-create/observ-hoja-ruta-create.component';
import { RecargoDocumentoCreateComponent } from '@components/mantenimiento/ventas/recargo-documento/recargo-documento-create/recargo-documento-create.component';
import { TiposCreditoEditComponent } from '@components/mantenimiento/ventas/tipos-credito/tipos-credito-edit/tipos-credito-edit.component';
import { RecargoDocumentoEditComponent } from '@components/mantenimiento/ventas/recargo-documento/recargo-documento-edit/recargo-documento-edit.component';
import { PreciosPermitidoDesctComponent } from '@components/mantenimiento/ventas/descuentos-especiales/precios-permitido-desct/precios-permitido-desct.component';
import { LineasPorcentajeDesctComponent } from '@components/mantenimiento/ventas/descuentos-especiales/lineas-porcentaje-desct/lineas-porcentaje-desct.component';
import { LineaProductoCatalogoComponent } from '@components/mantenimiento/inventario/lineaproducto/linea-producto-catalogo/linea-producto-catalogo.component';
import { NivelesDescuentosCreateComponent } from '@components/mantenimiento/ventas/niveles-descuentos/niveles-descuentos-create/niveles-descuentos-create.component';
import { RubroEditComponent } from '@components/mantenimiento/rubro/rubro-edit/rubro-edit.component';
import { ServiceRefreshItemsService } from '@components/inventario/toma-inventario-consolidado/services-refresh-item/service-refresh-items.service';
import { VentanasComponent } from '@modules/main/header/ventanas/ventanas.component';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { CuentasEfectivoComponent } from '@components/mantenimiento/fondos/cuentas-efectivo/cuentas-efectivo.component';
import { CuentasEfectivoCreateComponent } from '@components/mantenimiento/fondos/cuentas-efectivo/cuentas-efectivo-create/cuentas-efectivo-create.component';
import { CuentasEfectivosEditComponent } from '@components/mantenimiento/fondos/cuentas-efectivo/cuentas-efectivos-edit/cuentas-efectivos-edit.component';
import { DeudoresComponent } from '@components/mantenimiento/fondos/deudores/deudores.component';
import { DeudoresEditComponent } from '@components/mantenimiento/fondos/deudores/deudores-edit/deudores-edit.component';
import { DeudoresCreateComponent } from '@components/mantenimiento/fondos/deudores/deudores-create/deudores-create.component';
import { PercepcionesretencionesComponent } from '@components/mantenimiento/compras/percepcionesretenciones/percepcionesretenciones.component';
import { PercepcionesretencionesCreateComponent } from '@components/mantenimiento/compras/percepcionesretenciones/percepcionesretenciones-create/percepcionesretenciones-create.component';
import { PercepcionesretencionesEditComponent } from '@components/mantenimiento/compras/percepcionesretenciones/percepcionesretenciones-edit/percepcionesretenciones-edit.component';
import { ObserHojaRutaEditComponent } from '@components/mantenimiento/ventas/observaciones-hoja-ruta/obser-hoja-ruta-edit/obser-hoja-ruta-edit.component';
import { DeudoresCompuestosComponent } from '@components/mantenimiento/fondos/deudores-compuestos/deudores-compuestos.component';
import { CuentasBancariasComponent } from '@components/mantenimiento/fondos/cuentas-bancarias/cuentas-bancarias.component';
import { NumeracionAnticipoComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-anticipo/numeracion-anticipo.component';
import { NumeracionAnticipoCreateComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-anticipo/numeracion-anticipo-create/numeracion-anticipo-create.component';
import { NumeracionAnticipoEditComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-anticipo/numeracion-anticipo-edit/numeracion-anticipo-edit.component';
import { NumeracionCobranzaComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-cobranza/numeracion-cobranza.component';
import { NumeracionCobranzaCreateComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-cobranza/numeracion-cobranza-create/numeracion-cobranza-create.component';
import { NumeracionCobranzaEditComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-cobranza/numeracion-cobranza-edit/numeracion-cobranza-edit.component';
import { NumeracionDevolucionAnticiposComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-devolucion-anticipos/numeracion-devolucion-anticipos.component';
import { NumeracionDevoclucionAnticipoCreateComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-devolucion-anticipos/numeracion-devoclucion-anticipo-create/numeracion-devoclucion-anticipo-create.component';
import { NumeracionDevoclucionAnticipoEditComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-devolucion-anticipos/numeracion-devoclucion-anticipo-edit/numeracion-devoclucion-anticipo-edit.component';
import { NumeracionPagosMoraComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-pagos-mora/numeracion-pagos-mora.component';
import { NumeracionPagosMoraCreateComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-pagos-mora/numeracion-pagos-mora-create/numeracion-pagos-mora-create.component';
import { NumeracionPagosMoraEditComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-pagos-mora/numeracion-pagos-mora-edit/numeracion-pagos-mora-edit.component';
import { NumeracionTipoAjusteComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-tipo-ajuste/numeracion-tipo-ajuste.component';
import { NumeracionTipoAjusteCreateComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-tipo-ajuste/numeracion-tipo-ajuste-create/numeracion-tipo-ajuste-create.component';
import { NumeracionTipoAjusteEditComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-tipo-ajuste/numeracion-tipo-ajuste-edit/numeracion-tipo-ajuste-edit.component';
import { NumeracionDescuentoPorMoraComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-descuento-por-mora/numeracion-descuento-por-mora.component';
import { NumeracionDescuentoPorMoraCreateComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-descuento-por-mora/numeracion-descuento-por-mora-create/numeracion-descuento-por-mora-create.component';
import { NumeracionDescuentoPorMoraEditComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-descuento-por-mora/numeracion-descuento-por-mora-edit/numeracion-descuento-por-mora-edit.component';
import { NumeracionDesctVariosDirectosComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-desct-varios-directos/numeracion-desct-varios-directos.component';
import { NumeracionDesctVariosDirectosCreateComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-desct-varios-directos/numeracion-desct-varios-directos-create/numeracion-desct-varios-directos-create.component';
import { NumeracionDesctVariosDirectosEditComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-desct-varios-directos/numeracion-desct-varios-directos-edit/numeracion-desct-varios-directos-edit.component';
import { NumeracionDePagoComponent } from '@components/mantenimiento/compras/numeracion-de-pago/numeracion-de-pago.component';
import { NumeracionDePagoCreateComponent } from '@components/mantenimiento/compras/numeracion-de-pago/numeracion-de-pago-create/numeracion-de-pago-create.component';
import { NumeracionDePagoEditComponent } from '@components/mantenimiento/compras/numeracion-de-pago/numeracion-de-pago-edit/numeracion-de-pago-edit.component';
import { NumcomprasmenoresComponent } from '@components/mantenimiento/compras/numcomprasmenores/numcomprasmenores.component';
import { NumcomprasmenoresCreateComponent } from '@components/mantenimiento/compras/numcomprasmenores/numcomprasmenores-create/numcomprasmenores-create.component';
import { NumcomprasmenoresEditComponent } from '@components/mantenimiento/compras/numcomprasmenores/numcomprasmenores-edit/numcomprasmenores-edit.component';
import { NumprovisioncompraEditComponent } from '@components/mantenimiento/compras/numprovisioncompra/numprovisioncompra-edit/numprovisioncompra-edit.component';
import { NumprovisioncompraCreateComponent } from '@components/mantenimiento/compras/numprovisioncompra/numprovisioncompra-create/numprovisioncompra-create.component';
import { NumprovisioncompraComponent } from '@components/mantenimiento/compras/numprovisioncompra/numprovisioncompra.component';
import { NumeraciontransferenciasComponent } from '@components/mantenimiento/fondos/numeraciontransferencias/numeraciontransferencias.component';
import { NumeraciontransferenciasCreateComponent } from '@components/mantenimiento/fondos/numeraciontransferencias/numeraciontransferencias-create/numeraciontransferencias-create.component';
import { NumeraciontransferenciasEditComponent } from '@components/mantenimiento/fondos/numeraciontransferencias/numeraciontransferencias-edit/numeraciontransferencias-edit.component';
import { NumretirobancarioComponent } from '@components/mantenimiento/fondos/numretirobancario/numretirobancario.component';
import { NumretirobancarioCreateComponent } from '@components/mantenimiento/fondos/numretirobancario/numretirobancario-create/numretirobancario-create.component';
import { NumretirobancarioEditComponent } from '@components/mantenimiento/fondos/numretirobancario/numretirobancario-edit/numretirobancario-edit.component';
import { NumreposicionComponent } from '@components/mantenimiento/fondos/numreposicion/numreposicion.component';
import { NumreposicionCreateComponent } from '@components/mantenimiento/fondos/numreposicion/numreposicion-create/numreposicion-create.component';
import { NumreposicionEditComponent } from '@components/mantenimiento/fondos/numreposicion/numreposicion-edit/numreposicion-edit.component';
import { NumpagodeudorComponent } from '@components/mantenimiento/fondos/numpagodeudor/numpagodeudor.component';
import { NumpagodeudorCreateComponent } from '@components/mantenimiento/fondos/numpagodeudor/numpagodeudor-create/numpagodeudor-create.component';
import { NumpagodeudorEditComponent } from '@components/mantenimiento/fondos/numpagodeudor/numpagodeudor-edit/numpagodeudor-edit.component';
import { NummovfondosComponent } from '@components/mantenimiento/fondos/nummovfondos/nummovfondos.component';
import { NummovfondosCreateComponent } from '@components/mantenimiento/fondos/nummovfondos/nummovfondos-create/nummovfondos-create.component';
import { NummovfondosEditComponent } from '@components/mantenimiento/fondos/nummovfondos/nummovfondos-edit/nummovfondos-edit.component';
import { NumentregascargoComponent } from '@components/mantenimiento/fondos/numentregascargo/numentregascargo.component';
import { NumentregascargoCreateComponent } from '@components/mantenimiento/fondos/numentregascargo/numentregascargo-create/numentregascargo-create.component';
import { NumentregascargoEditComponent } from '@components/mantenimiento/fondos/numentregascargo/numentregascargo-edit/numentregascargo-edit.component';
import { NumdevolucionesdeudorComponent } from '@components/mantenimiento/fondos/numdevolucionesdeudor/numdevolucionesdeudor.component';
import { NumdevolucionesdeudorCreateComponent } from '@components/mantenimiento/fondos/numdevolucionesdeudor/numdevolucionesdeudor-create/numdevolucionesdeudor-create.component';
import { NumdevolucionesdeudorEditComponent } from '@components/mantenimiento/fondos/numdevolucionesdeudor/numdevolucionesdeudor-edit/numdevolucionesdeudor-edit.component';
import { NumdepositosclienteComponent } from '@components/mantenimiento/fondos/numdepositoscliente/numdepositoscliente.component';
import { NumdepositosclienteCreateComponent } from '@components/mantenimiento/fondos/numdepositoscliente/numdepositoscliente-create/numdepositoscliente-create.component';
import { NumdepositosclienteEditComponent } from '@components/mantenimiento/fondos/numdepositoscliente/numdepositoscliente-edit/numdepositoscliente-edit.component';
import { NumdepositosbancariosEditComponent } from '@components/mantenimiento/fondos/numdepositosbancarios/numdepositosbancarios-edit/numdepositosbancarios-edit.component';
import { NumdepositosbancariosCreateComponent } from '@components/mantenimiento/fondos/numdepositosbancarios/numdepositosbancarios-create/numdepositosbancarios-create.component';
import { NumdepositosbancariosComponent } from '@components/mantenimiento/fondos/numdepositosbancarios/numdepositosbancarios.component';
import { NumchequesclientesComponent } from '@components/mantenimiento/fondos/numchequesclientes/numchequesclientes.component';
import { NumchequesclientesEditComponent } from '@components/mantenimiento/fondos/numchequesclientes/numchequesclientes-edit/numchequesclientes-edit.component';
import { NumchequesclientesCreateComponent } from '@components/mantenimiento/fondos/numchequesclientes/numchequesclientes-create/numchequesclientes-create.component';
import { NumlibrosbancosComponent } from '@components/mantenimiento/fondos/numlibrosbancos/numlibrosbancos.component';
import { NumlibrosbancosEditComponent } from '@components/mantenimiento/fondos/numlibrosbancos/numlibrosbancos-edit/numlibrosbancos-edit.component';
import { NumlibrosbancosCreateComponent } from '@components/mantenimiento/fondos/numlibrosbancos/numlibrosbancos-create/numlibrosbancos-create.component';
import { NumsolicitudurgenteEditComponent } from '@components/mantenimiento/inventario/numsolicitudurgente/numsolicitudurgente-edit/numsolicitudurgente-edit.component';
import { NumPedidosImportacionComponent } from '@components/mantenimiento/importaciones/numeracion/num-pedidos-importacion/num-pedidos-importacion.component';
import { NumPedidosImportacionCreateComponent } from '@components/mantenimiento/importaciones/numeracion/num-pedidos-importacion/num-pedidos-importacion-create/num-pedidos-importacion-create.component';
import { NumPedidosImportacionEditComponent } from '@components/mantenimiento/importaciones/numeracion/num-pedidos-importacion/num-pedidos-importacion-edit/num-pedidos-importacion-edit.component';
import { NumProformaImportacionComponent } from '@components/mantenimiento/importaciones/numeracion/num-proforma-importacion/num-proforma-importacion.component';
import { NumProformaImportacionCreateComponent } from '@components/mantenimiento/importaciones/numeracion/num-proforma-importacion/num-proforma-importacion-create/num-proforma-importacion-create.component';
import { NumProformaImportacionEditComponent } from '@components/mantenimiento/importaciones/numeracion/num-proforma-importacion/num-proforma-importacion-edit/num-proforma-importacion-edit.component';
import { NumOrdCompraComponent } from '@components/mantenimiento/importaciones/numeracion/num-ord-compra/num-ord-compra.component';
import { NumOrdCompraEditComponent } from '@components/mantenimiento/importaciones/numeracion/num-ord-compra/num-ord-compra-edit/num-ord-compra-edit.component';
import { NumOrdCompraCreateComponent } from '@components/mantenimiento/importaciones/numeracion/num-ord-compra/num-ord-compra-create/num-ord-compra-create.component';
import { NumEmbarqueImportacionComponent } from '@components/mantenimiento/importaciones/numeracion/num-embarque-importacion/num-embarque-importacion.component';
import { NumEmbarqueImportacionCreateComponent } from '@components/mantenimiento/importaciones/numeracion/num-embarque-importacion/num-embarque-importacion-create/num-embarque-importacion-create.component';
import { NumEmbarqueImportacionEditComponent } from '@components/mantenimiento/importaciones/numeracion/num-embarque-importacion/num-embarque-importacion-edit/num-embarque-importacion-edit.component';
import { NumRecepcionImportacionComponent } from '@components/mantenimiento/importaciones/numeracion/num-recepcion-importacion/num-recepcion-importacion.component';
import { NumRecepcionImportacionCreateComponent } from '@components/mantenimiento/importaciones/numeracion/num-recepcion-importacion/num-recepcion-importacion-create/num-recepcion-importacion-create.component';
import { NumRecepcionImportacionEditComponent } from '@components/mantenimiento/importaciones/numeracion/num-recepcion-importacion/num-recepcion-importacion-edit/num-recepcion-importacion-edit.component';
import { NumTipoDocumentoVentaComponent } from '@components/mantenimiento/ventas/num-tipo-documento-venta/num-tipo-documento-venta.component';
import { NumeracionComprobantesEditComponent } from '@components/mantenimiento/contabilidad/numeracion-comprobantes/numeracion-comprobantes-edit/numeracion-comprobantes-edit.component';
import { NumeracionComprobantesCreateComponent } from '@components/mantenimiento/contabilidad/numeracion-comprobantes/numeracion-comprobantes-create/numeracion-comprobantes-create.component';
import { NumeracionComprobantesComponent } from '@components/mantenimiento/contabilidad/numeracion-comprobantes/numeracion-comprobantes.component';


import { TalonarioRecibosComponent } from '@components/mantenimiento/cuentas-cobrar/talonario-recibos/talonario-recibos.component';
import { TalonarioRecibosCreateComponent } from '@components/mantenimiento/cuentas-cobrar/talonario-recibos/talonario-recibos-create/talonario-recibos-create.component';
import { TalonarioRecibosEditComponent } from '@components/mantenimiento/cuentas-cobrar/talonario-recibos/talonario-recibos-edit/talonario-recibos-edit.component';
import { TipoPagoCreateComponent } from '@components/mantenimiento/cuentas-cobrar/tipo-pago/tipo-pago-create/tipo-pago-create.component';
import { TipoPagoEditComponent } from '@components/mantenimiento/cuentas-cobrar/tipo-pago/tipo-pago-edit/tipo-pago-edit.component';
import { CompradoresComponent } from '@components/mantenimiento/compras/compradores/compradores.component';
import { BancoEditComponent } from '@components/mantenimiento/fondos/banco/banco-edit/banco-edit.component';
import { DeudoresCompCreateComponent } from '@components/mantenimiento/fondos/deudores-compuestos/deudores-comp-create/deudores-comp-create.component';
import { DeudoresCompEditComponent } from '@components/mantenimiento/fondos/deudores-compuestos/deudores-comp-edit/deudores-comp-edit.component';
import { DeudoresIntegrantesComponent } from '@components/mantenimiento/fondos/deudores-compuestos/deudores-integrantes/deudores-integrantes.component';
import { DeudoresCatalogoComponent } from '@components/mantenimiento/fondos/deudores/deudores-catalogo/deudores-catalogo.component';
import { TipoPagoComponent } from '@components/mantenimiento/cuentas-cobrar/tipo-pago/tipo-pago.component';
import { SolicitudesDescuentoComponent } from '@components/mantenimiento/ventas/solicitudes-descuento/solicitudes-descuento.component';
import { CatalogoDocumentoVentaComponent } from '@components/mantenimiento/ventas/num-tipo-documento-venta/catalogo-documento-venta/catalogo-documento-venta.component';
import { TipoconocimientocargaEditComponent } from '@components/mantenimiento/inventario/tipoconocimientocarga/tipoconocimientocarga-edit/tipoconocimientocarga-edit.component';
import { TipoinventarioEditComponent } from '@components/mantenimiento/inventario/tipoinventario/tipoinventario-edit/tipoinventario-edit.component';
import { SucursalCreateComponent } from '@components/mantenimiento/contabilidad/sucursal/sucursal-create/sucursal-create.component';
import { SucursalEditComponent } from '@components/mantenimiento/contabilidad/sucursal/sucursal-edit/sucursal-edit.component';
import { SucursalComponent } from '@components/mantenimiento/contabilidad/sucursal/sucursal.component';
import { PlanCuentaComponent } from '@components/mantenimiento/contabilidad/plan-cuenta/plan-cuenta.component';
import { PlanCuentaCreateComponent } from '@components/mantenimiento/contabilidad/plan-cuenta/plan-cuenta-create/plan-cuenta-create.component';
import { PlanCuentaEditComponent } from '@components/mantenimiento/contabilidad/plan-cuenta/plan-cuenta-edit/plan-cuenta-edit.component';
import { CuentaEfectivoCuentasContablesComponent } from '@components/mantenimiento/fondos/cuentas-efectivo/cuenta-efectivo-cuentas-contables/cuenta-efectivo-cuentas-contables.component';
import { CuentasContablesComponent } from '@components/mantenimiento/fondos/deudores/cuentas-contables/cuentas-contables.component';
import { CuentasCatalogoComponent } from '@components/mantenimiento/fondos/deudores/cuentas-catalogo/cuentas-catalogo.component';
import { registerCellType, NumericCellType } from 'handsontable/cellTypes';
import { registerPlugin, UndoRedo } from 'handsontable/plugins';
import { StockActualF9Component } from '@components/mantenimiento/ventas/matriz-items/stock-actual-f9/stock-actual-f9.component';
import { MonedaCatalogoComponent } from '@components/mantenimiento/administracion/moneda/moneda-catalogo/moneda-catalogo/moneda-catalogo.component';
import { VerificarCreditoDisponibleComponent } from '@components/mantenimiento/ventas/verificar-credito-disponible/verificar-credito-disponible.component';
import { ItemSeleccionCantidadComponent } from '@components/mantenimiento/ventas/matriz-items/item-seleccion-cantidad/item-seleccion-cantidad.component';
import { AnticiposProformaComponent } from '@components/mantenimiento/ventas/anticipos-proforma/anticipos-proforma.component';
import { ModalEtiquetaComponent } from '@components/mantenimiento/ventas/modal-etiqueta/modal-etiqueta.component';
import { CatalogoProformasComponent } from '@components/mantenimiento/ventas/transacciones/proforma/catalogo-proformas/catalogo-proformas.component';
import { CatalogoCotizacionComponent } from '@components/mantenimiento/ventas/transacciones/cotizacion/catalogo-cotizacion/catalogo-cotizacion.component';
import { ModalEstadoPagoClienteComponent } from '@components/mantenimiento/ventas/modal-estado-pago-cliente/modal-estado-pago-cliente.component';
import { ModalSubTotalComponent } from '@components/mantenimiento/ventas/modal-sub-total/modal-sub-total.component';
import { ModalRecargosComponent } from '@components/mantenimiento/ventas/modal-recargos/modal-recargos.component';
import { ModalDesctExtrasComponent } from '@components/mantenimiento/ventas/modal-desct-extras/modal-desct-extras.component';
import { VentanaValidacionesComponent } from '@components/mantenimiento/ventas/ventana-validaciones/ventana-validaciones.component';

// import Handsontable from 'handsontable/base';
import localeEs from '@angular/common/locales/es';
import es from '@angular/common/locales/es';
import { ModalIvaComponent } from '@components/mantenimiento/ventas/modal-iva/modal-iva.component';
import { ModalDetalleObserValidacionComponent } from '@components/mantenimiento/ventas/modal-detalle-obser-validacion/modal-detalle-obser-validacion.component';
import { ConceptosmovimientosmercaderiaEditComponent } from '@components/mantenimiento/inventario/conceptosmovimientosmercaderia/conceptosmovimientosmercaderia-edit/conceptosmovimientosmercaderia-edit.component';
import { PermisosEspecialesParametrosComponent } from '@components/seguridad/permisos-especiales-parametros/permisos-especiales-parametros.component';
import { ModalPasswordComponent } from '@components/seguridad/modal-password/modal-password.component';
import { ModalGenerarAutorizacionComponent } from '@components/seguridad/modal-generar-autorizacion/modal-generar-autorizacion.component';
import { ModalDesctDepositoClienteComponent } from '@components/mantenimiento/ventas/modal-desct-deposito-cliente/modal-desct-deposito-cliente.component';
import { CargarExcelComponent } from '@components/mantenimiento/ventas/cargar-excel/cargar-excel.component';
import { ProformaPdfComponent } from '@components/mantenimiento/ventas/transacciones/proforma/proforma-pdf/proforma-pdf.component';
import { ModalBotonesImpresionComponent } from '@components/mantenimiento/ventas/transacciones/proforma/modal-botones-impresion/modal-botones-impresion.component';
import { EtiquetasItemProformaComponent } from '@components/mantenimiento/ventas/transacciones/proforma/etiquetas-item-proforma/etiquetas-item-proforma.component';
import { EtiquetaImpresionProformaComponent } from '@components/mantenimiento/ventas/transacciones/proforma/etiqueta-impresion-proforma/etiqueta-impresion-proforma.component';
import { ModalSolicitarUrgenteComponent } from '@components/mantenimiento/ventas/modal-solicitar-urgente/modal-solicitar-urgente.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QRCodeModule } from 'angularx-qrcode';



import { ImportsModule } from '@components/laboratorio/import';
import { ProductService } from '@components/laboratorio/product.service';
import { ModificarProformaComponent } from '@components/mantenimiento/ventas/transacciones/modificar/modificar-proforma/modificar-proforma.component';
import { ModalClienteDireccionComponent } from '@components/mantenimiento/ventas/modal-cliente-direccion/modal-cliente-direccion.component';
import { BuscadorAvanzadoComponent } from '@components/uso-general/buscador-avanzado/buscador-avanzado.component';
import { ProformaPdfEmailComponent } from '@components/mantenimiento/ventas/transacciones/proforma/proforma-pdf-email/proforma-pdf-email.component';
import { CatalogoNotasRemisionComponent } from '@components/mantenimiento/ventas/transacciones/nota-remision/catalogo-notas-remision/catalogo-notas-remision.component';
import { ModalTransfeNotaRemisionComponent } from '@components/mantenimiento/ventas/transacciones/nota-remision/modal-transfe-nota-remision/modal-transfe-nota-remision.component';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
import { ModalTransfeProformaComponent } from '@components/mantenimiento/ventas/transacciones/proforma/modal-transfe-proforma/modal-transfe-proforma.component';
import { DialogConfirmacionComponent } from '@modules/dialog-confirmacion/dialog-confirmacion.component';
import { EtiquetaTuercasProformaComponent } from '@components/mantenimiento/ventas/transacciones/proforma/etiqueta-tuercas-proforma/etiqueta-tuercas-proforma.component';
import { ModificarNotaRemisionComponent } from '@components/mantenimiento/ventas/transacciones/modificar/modificar-nota-remision/modificar-nota-remision.component';
import { ChartModule } from 'primeng/chart';
import { CatalogoFacturasComponent } from '@components/mantenimiento/ventas/transacciones/facturas/catalogo-facturas/catalogo-facturas.component';
import { MatrizItemsClasicaComponent } from '@components/mantenimiento/ventas/matriz-items-clasica/matriz-items-clasica.component';
import { MatrizItemsListaComponent } from '@components/mantenimiento/ventas/matriz-items-lista/matriz-items-lista.component';
import { FacturaTemplateComponent } from '@components/mantenimiento/ventas/transacciones/facturas/factura-template/factura-template.component';
import { FacturacionMostradorTiendasComponent } from '@components/mantenimiento/ventas/transacciones/facturacion-mostrador-tiendas/facturacion-mostrador-tiendas.component';
import { ModalFormaPagoComponent } from '@components/mantenimiento/ventas/transacciones/factura-nota-remision/modal-forma-pago/modal-forma-pago.component';
import { ModalSubTotalMostradorTiendasComponent } from '@components/mantenimiento/ventas/transacciones/facturacion-mostrador-tiendas/modalSubTotalMostradorTiendas/modalSubTotalMostradorTiendas.component';
import { TranferirMostradorTiendasComponent } from '@components/mantenimiento/ventas/transacciones/facturacion-mostrador-tiendas/tranferirMostradorTiendas/tranferirMostradorTiendas.component';
import { ModalDescuentosTiendaComponent } from '@components/mantenimiento/ventas/transacciones/facturacion-mostrador-tiendas/modal-descuentos-tienda/modal-descuentos-tienda.component';
import { BuscadorAvanzadoAnticiposComponent } from '@components/uso-general/buscador-avanzado-anticipos/buscador-avanzado-anticipos.component';
import { ModalAnticiposComponent } from '@components/mantenimiento/ventas/modal-anticipos/modal-anticipos.component';
import { ModificarFacturacionMostradorTiendasComponent } from '@components/mantenimiento/ventas/transacciones/modificar/modificar-facturacion-mostrador-tiendas/modificar-facturacion-mostrador-tiendas.component';
import { BuscadorAvanzadoFacturasComponent } from '@components/uso-general/buscador-avanzado-facturas/buscador-avanzado-facturas.component';
import { ProformaMovilComponent } from '@components/mantenimiento/ventas/transacciones/proforma-movil/proforma-movil.component';
import { TiposAnulacionFelComponent } from '@components/mantenimiento/ventas/transacciones/modificar/modificar-facturacion-mostrador-tiendas/tipos-anulacion-fel/tipos-anulacion-fel.component';
import { MessageService } from 'primeng/api';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { NotamovimientoComponent } from '@components/inventario/CRUD/notamovimiento/notamovimiento.component';

// Función para inicializar los Web Components
export function initializeCustomElements() {
    return () => defineCustomElements(window);
}

registerLocaleData(es);
registerAllModules();
registerCellType(NumericCellType);
registerPlugin(UndoRedo);
@NgModule({
    declarations: [
        AppComponent, VentanasComponent, MainComponent, LoginComponent, HeaderComponent, FooterComponent, MenuSidebarComponent, BlankComponent, DialogConfirmActualizarComponent,
        ProfileComponent, VentanaValidacionesComponent, RegisterComponent, DashboardComponent, MessagesComponent, NotificationsComponent, UserComponent,
        ForgotPasswordComponent, RecoverPasswordComponent, LanguageComponent, MainMenuComponent, SubMenuComponent, MenuItemComponent,
        ControlSidebarComponent, SidebarSearchComponent, MenuImportacionesComponent, UsuarioComponent, UsuarioCreateComponent, BancoEditComponent,
        UsuarioEditComponent, UsuarioDeleteComponent, MonedaComponent, AlmacenComponent, AreaComponent, EmpresaComponent, ConceptosmovimientosmercaderiaEditComponent,
        AlmacenCreateComponent, AreaCreateComponent, EmpresaCreateComponent, MonedaCreateComponent, LocalidadesComponent,
        LocalidadesCreateComponent, LocalidadesEditComponent, IdProformaUsuarioComponent, ModalEstadoPagoClienteComponent,
        LaboratorioComponent, DialogDeleteComponent, AreaEditComponent, DptopaisComponent, ProvinciadptopaisComponent, DptopaisCreateComponent,
        DptopaisEditComponent, ProvinciadptopaisCreateComponent, UnidadnegocioComponent, UnidadnegocioCreateComponent,
        TipocambioComponent, ProformaComponent, TipocambioCreateComponent, TipocambiovalidacionComponent, TipocambiovalidacionCreateComponent,
        LogComponent, ParamempresaComponent, ModalMinimoComplementariasComponent, ModalCreditoAutorizacionComponent, ModalSubTotalComponent,
        MenuVentasComponent, NumnotasdemovimientoEditComponent, ItemComponent, TipoconocimientocargaCreateComponent, ArchivoComponent,
        TipoconocimientocargaComponent, TipoconocimientocargaEditComponent, NumsolicitudurgenteEditComponent, TipoinventarioEditComponent,
        NumsolicitudurgenteComponent, NumsolicitudurgenteCreateComponent, VendedoresComponent, TiposCreditoComponent,
        TipoinventarioComponent, TipoinventarioCreateComponent, StockActualF9Component, CatalogoCotizacionComponent,
        ModalPreciosFacturacionComponent, RoscaComponent, UnidadmedidaComponent, TerminacionComponent, ResistenciaComponent,
        GruposlineasComponent, GruposlineasCreateComponent, GruposlineasdescuentosCreateComponent, ConceptosmovimientosmercaderiaCreateComponent,
        GruposlineasdescuentosComponent, LineaproductoComponent, LineaproductoCreateComponent, ConceptosmovimientosmercaderiaComponent,
        UnidadmedidaCreateComponent, ModalSaldoCubrirComponent, ModalComponenteskitComponent, ModalMaximoVentasComponent, MantenimientoComponent,
        ItemEditComponent, ModalPrecioControlComponent, ParametroUsuarioComponent, BancoComponent, MenuFondosComponent, MatrizItemsComponent,
        NumpedidomercaderiaEditComponent, RolesCreateComponent, RolesEditComponent, MenuInventarioComponent, CatalogoProformasComponent,
        MenuCuentasCobrarComponent, MenuContabilidadComponent, MenuActivosFijosComponent, MenuPlanillasPersonalComponent, NotaRemisionComponent,
        HerramientasComponent, ReportesComponent, AyudaComponent, SesionExpiradaComponent, ModalVendedorComponent, ModalPasswordComponent,
        FacturaNotaRemisionComponent, InterbancosComponent, ClientesComponent, ClientesIgualesComponent, PermisosEspecialesParametrosComponent,
        MenuComprasComponent, RefreshPasswordComponent, TransformacionDigitalComponent, PageNotFoundComponent, ModalClienteComponent,
        ModalClienteInfoComponent, DocumentationErrorsComponent, ModalAlmacenComponent, NumeraciontransferenciasComponent, NumpedidomercaderiaCreateComponent,
        ModalPrecioVentaComponent, ModalDescuentosComponent, ModalItemsComponent, ModalIdtipoComponent, ModalSaldosComponent,
        VehiculoComponent, ModalCatalogoNumeracionProformaComponent, ModalUsuarioComponent, RubroComponent, RubroCreateComponent,
        ModalRubroComponent, VehiculoCreateComponent, VehiculoEditComponent, PeriodosSistemaComponent, TarifaPermitidasUsuarioComponent,
        PermisosEspecialesComponent, PermisosEspecialesCreateComponent, PersonaCatalogoComponent, PermisosEspecialesEditComponent,
        LogUsuarioComponent, ReservaAlmacenesComponent, UrgentesAlmacenesComponent, StockAlmacenesComponent, ModificarParametroAComponent,
        ParametrosFacturacionSIATComponent, CrearTomaInventarioComponent, TomaInventarioConsolidadoComponent, CatalogoInventarioComponent,
        PrecioItemComponent, ActualizarPrecioItemComponent, ActualizarStockActualComponent, ExportarImportarSaldosComponent, BancoCreateComponent,
        GruposInventariosComponent, SaldosInventarioConsolidadoComponent, CatalogoPersonaComponent, CambiarPasswordComponent, ItemCreateComponent,
        ConsolidarInventarioComponent, CatalogoClientesIgualesComponent, ModalDesctExtrasComponent, NumdevolucionesdeudorCreateComponent,
        ValidarPrecioItemComponent, ValidarPermisoItemComponent, PermisoEspecialPasswordComponent, ModalZonaComponent, RolesComponent,
        ParametroUsuarioComponent, NotasAjustesComponent, CatalogoNotasMovimientoComponent, CatalogoMovimientoMercaderiaComponent, NumpedidomercaderiaComponent,
        ValidarComponent, RegistrarInventarioGrupoComponent, ConfirmacionNotasAjustesComponent, CatalogoPuntoVentaComponent, ResistenciaCreateComponent,
        PuntoVentaComponent, ProvinciasCatalogoComponent, MatrizInventarioComponent, DescuentosEspecialesComponent, ModificarProformaComponent,
        NivelesDescuentosComponent, NivelesDescuentosCreateComponent, ClasificacionClientesComponent, LugaresComponent, CatalogoLugarComponent,
        RecargoDocumentoComponent, PlanPagoClientesComponent, ObservacionesHojaRutaComponent, TiposCreditoCreateComponent, ResistenciaEditComponent,
        ObservHojaRutaCreateComponent, RecargoDocumentoCreateComponent, TiposCreditoEditComponent, RecargoDocumentoEditComponent,
        PreciosPermitidoDesctComponent, LineasPorcentajeDesctComponent, LineaProductoCatalogoComponent, RubroEditComponent, NumnotasdemovimientoComponent,
        NumeraciontransferenciasCreateComponent, NumeraciontransferenciasEditComponent, NumretirobancarioComponent, NumretirobancarioCreateComponent,
        NumretirobancarioEditComponent, NumreposicionComponent, NumreposicionCreateComponent, NumreposicionEditComponent, NumpagodeudorComponent,
        NumpagodeudorCreateComponent, NumpagodeudorEditComponent, NummovfondosComponent, NummovfondosCreateComponent, NummovfondosEditComponent,
        NumentregascargoComponent, NumentregascargoCreateComponent, NumentregascargoEditComponent, NumdevolucionesdeudorComponent,
        NumdevolucionesdeudorEditComponent, NumdepositosclienteComponent, NumdepositosclienteCreateComponent, NumdepositosclienteEditComponent,
        NumdepositosbancariosComponent, NumdepositosbancariosCreateComponent, NumdepositosbancariosEditComponent, NumchequesclientesComponent,
        NumchequesclientesCreateComponent, NumchequesclientesEditComponent, NumlibrosbancosEditComponent, NumlibrosbancosComponent,
        NumlibrosbancosCreateComponent, CuentasEfectivoComponent, CuentasEfectivoCreateComponent, CuentasEfectivosEditComponent, RoscaEditComponent,
        DeudoresComponent, DeudoresEditComponent, DeudoresCreateComponent, NumcomprasmenoresComponent, NumcomprasmenoresCreateComponent,
        NumcomprasmenoresEditComponent, NumprovisioncompraComponent, NumprovisioncompraCreateComponent, NumprovisioncompraEditComponent,
        PercepcionesretencionesComponent, PercepcionesretencionesCreateComponent, PercepcionesretencionesEditComponent, TerminacionCreateComponent,
        ObserHojaRutaEditComponent, DeudoresCompuestosComponent, CuentasBancariasComponent, NumeracionAnticipoComponent, NumeracionAnticipoCreateComponent,
        NumeracionAnticipoEditComponent, NumeracionCobranzaComponent, NumeracionCobranzaCreateComponent, NumeracionCobranzaEditComponent,
        NumeracionDevolucionAnticiposComponent, NumeracionDevoclucionAnticipoCreateComponent, NumeracionDevoclucionAnticipoEditComponent,
        NumeracionPagosMoraComponent, NumeracionPagosMoraCreateComponent, NumeracionPagosMoraEditComponent, TalonarioRecibosComponent,
        TalonarioRecibosCreateComponent, TalonarioRecibosEditComponent, TipoPagoCreateComponent, TipoPagoEditComponent, NumeracionTipoAjusteComponent,
        NumeracionTipoAjusteCreateComponent, NumeracionTipoAjusteEditComponent, NumeracionDescuentoPorMoraComponent, NumeracionDescuentoPorMoraCreateComponent,
        NumeracionDescuentoPorMoraEditComponent, NumeracionDesctVariosDirectosComponent, NumeracionDesctVariosDirectosCreateComponent,
        NumeracionDesctVariosDirectosEditComponent, NumeracionDePagoComponent, NumeracionDePagoCreateComponent, NumeracionDePagoEditComponent,
        CompradoresComponent, DeudoresCompCreateComponent, DeudoresCompEditComponent, DeudoresIntegrantesComponent, DeudoresCatalogoComponent,
        TipoPagoComponent, NumTipoDocumentoVentaComponent, SolicitudesDescuentoComponent, CatalogoDocumentoVentaComponent, NumnotasdemovimientoCreateComponent,
        NumPedidosImportacionComponent, NumPedidosImportacionCreateComponent, NumPedidosImportacionEditComponent, NumProformaImportacionComponent,
        NumProformaImportacionCreateComponent, NumProformaImportacionEditComponent, NumOrdCompraComponent, NumOrdCompraEditComponent, RoscaCreateComponent,
        NumOrdCompraCreateComponent, NumEmbarqueImportacionComponent, NumEmbarqueImportacionCreateComponent, NumEmbarqueImportacionEditComponent,
        NumRecepcionImportacionComponent, NumRecepcionImportacionCreateComponent, NumRecepcionImportacionEditComponent, SucursalComponent,
        SucursalEditComponent, SucursalCreateComponent, PlanCuentaComponent, PlanCuentaCreateComponent, PlanCuentaEditComponent, ModalBotonesImpresionComponent,
        CuentaEfectivoCuentasContablesComponent, CuentasContablesComponent, CuentasCatalogoComponent, NumeracionComprobantesComponent,
        NumeracionComprobantesCreateComponent, NumeracionComprobantesEditComponent, MonedaCatalogoComponent, ModalRecargosComponent,
        VerificarCreditoDisponibleComponent, ItemSeleccionCantidadComponent, AnticiposProformaComponent, ModalSolicitarUrgenteComponent,
        ModalEtiquetaComponent, ModalIvaComponent, ModalDetalleObserValidacionComponent, ModalGenerarAutorizacionComponent, EtiquetasItemProformaComponent,
        ModalDesctDepositoClienteComponent, ModalTransfeNotaRemisionComponent, CargarExcelComponent, ProformaPdfComponent, EtiquetaImpresionProformaComponent,
        ModalClienteDireccionComponent, BuscadorAvanzadoComponent, ProformaPdfEmailComponent, CatalogoNotasRemisionComponent, ModalTransfeProformaComponent,
        DialogConfirmacionComponent, BuscadorAvanzadoFacturasComponent, ModalDescuentosTiendaComponent,TranferirMostradorTiendasComponent, 
        EtiquetaTuercasProformaComponent, ModificarNotaRemisionComponent, CatalogoFacturasComponent, MatrizItemsClasicaComponent, MatrizItemsListaComponent,
        ModalFormaPagoComponent, ModificarFacturacionMostradorTiendasComponent, ModalAnticiposComponent, ModalSubTotalMostradorTiendasComponent, FacturaTemplateComponent,
        FacturacionMostradorTiendasComponent, BuscadorAvanzadoAnticiposComponent, TiposAnulacionFelComponent, NotamovimientoComponent,







        

        ProformaMovilComponent,
        

    ],
    bootstrap: [AppComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ], imports: [
        BrowserModule,
        StoreModule.forRoot({ auth: authReducer, ui: uiReducer }),
        AppRoutingModule,
        MatTableModule,

        MatMenuModule,
        ReactiveFormsModule,
        FormsModule,
        InputTextModule,
        MatFormFieldModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSnackBarModule,
        MatButtonModule,
        MatPaginatorModule,
        NgxSpinnerModule,
        MatSlideToggleModule,
        MaterialExampleModule,
        ScrollingModule,
        MatTabsModule,
        MatSidenavModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        // MatRippleModule,
        MatSliderModule,
        MatSortModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        PortalModule,
        NgPipesModule,
        HotTableModule,
        ImportsModule,
        ChartModule,
        QRCodeModule,
        ToastModule,
        ListboxModule,


        ToastrModule.forRoot({
            timeOut: 5000, // Duración infinita
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            extendedTimeOut: 0, // No desaparecer cuando se detiene el hover
            tapToDismiss: true, // No se oculta al hacer clic
        }),

        
],

    providers: [provideAnimationsAsync(), MatDialog, DatePipe, TipocambiovalidacionComponent, LogService, AuthGuard, NonAuthGuard,
        MenuSidebarComponent, LoginComponent, DecimalPipe, BnNgIdleService, ModalGenerarAutorizacionComponent,
        TomaInventarioConsolidadoComponent, ProductService, MessageService,
        { provide: ServiceRefreshItemsService },
        { provide: LOCALE_ID, useValue: 'es-BO' },
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_INITIALIZER, useFactory: initializeCustomElements, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
        { provide: MatDialogRef, useValue: {} }, provideHttpClient(withInterceptorsFromDi())]
})

export class AppModule { }
