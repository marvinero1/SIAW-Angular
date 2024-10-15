import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from '@modules/main/main.component';
import { LoginComponent } from '@modules/login/login.component';
import { ProfileComponent } from '@pages/profile/profile.component';
import { RegisterComponent } from '@modules/register/register.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { AuthGuard } from '@guards/auth.guard';
import { NonAuthGuard } from '@guards/non-auth.guard';
import { ForgotPasswordComponent } from '@modules/forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from '@modules/recover-password/recover-password.component';
import { UsuarioComponent } from '@components/mantenimiento/usuario/usuario.component';
import { SidebarSearchComponent } from '@components/sidebar-search/sidebar-search.component';
import { LaboratorioComponent } from '@components/laboratorio/laboratorio.component';
import { ProvinciadptopaisComponent } from '@components/mantenimiento/administracion/provinciadptopais/provinciadptopais.component';
import { DptopaisComponent } from '@components/mantenimiento/administracion/dptopais/dptopais.component';
import { UnidadnegocioComponent } from '@components/mantenimiento/administracion/unidadnegocio/unidadnegocio.component';
import { TipocambioComponent } from '@components/mantenimiento/administracion/tipocambio/tipocambio.component';
import { LogComponent } from '@modules/admin/log/log.component';
import { ParamempresaComponent } from '@components/archivo/paramempresa/paramempresa.component';
import { NumnotasdemovimientoComponent } from '@components/mantenimiento/inventario/numnotasdemovimiento/numnotasdemovimiento.component';
import { ItemComponent } from '@components/mantenimiento/inventario/item/item.component';
import { AlmacenComponent } from '@components/mantenimiento/inventario/almacen/almacen.component';
import { TipoconocimientocargaComponent } from '@components/mantenimiento/inventario/tipoconocimientocarga/tipoconocimientocarga.component';
import { NumsolicitudurgenteComponent } from '@components/mantenimiento/inventario/numsolicitudurgente/numsolicitudurgente.component';
import { TipoinventarioComponent } from '@components/mantenimiento/inventario/tipoinventario/tipoinventario.component';
import { RoscaComponent } from '@components/mantenimiento/inventario/rosca/rosca.component';
import { UnidadmedidaComponent } from '@components/mantenimiento/inventario/unidadmedida/unidadmedida.component';
import { TerminacionComponent } from '@components/mantenimiento/inventario/terminacion/terminacion.component';
import { ResistenciaComponent } from '@components/mantenimiento/inventario/resistencia/resistencia.component';
import { NumpedidomercaderiaComponent } from '@components/mantenimiento/inventario/numpedidomercaderia/numpedidomercaderia.component';
import { GruposlineasdescuentosComponent } from '@components/mantenimiento/inventario/gruposlineasdescuentos/gruposlineasdescuentos.component';
import { GruposlineasComponent } from '@components/mantenimiento/inventario/gruposlineas/gruposlineas.component';
import { LineaproductoComponent } from '@components/mantenimiento/inventario/lineaproducto/lineaproducto.component';
import { ConceptosmovimientosmercaderiaComponent } from '@components/mantenimiento/inventario/conceptosmovimientosmercaderia/conceptosmovimientosmercaderia.component';
import { ParametroUsuarioComponent } from '@pages/profile/parametroUsuario/parametroUsuario.component';
import { BancoComponent } from '@components/mantenimiento/fondos/banco/banco.component';
import { RolesComponent } from '@components/mantenimiento/roles-component/roles-component.component';
import { PageNotFoundComponent } from '@pages/errors/page-not-found/page-not-found.component';
import { DocumentationErrorsComponent } from '@pages/errors/documentation-errors/documentation-errors.component';
import { InterbancosComponent } from '@pages/interbancos/interbancos.component';
import { AreaComponent } from '@components/mantenimiento/administracion/area/area.component';
import { LocalidadesComponent } from '@components/mantenimiento/administracion/localidades/localidades.component';
import { IdProformaUsuarioComponent } from '@components/mantenimiento/administracion/id-proforma-usuario/id-proforma-usuario.component';
import { EmpresaComponent } from '@components/mantenimiento/administracion/empresa/empresa.component';
import { MonedaComponent } from '@components/mantenimiento/administracion/moneda/moneda.component';
import { VehiculoComponent } from '@components/mantenimiento/administracion/vehiculo/vehiculo.component';
import { RubroComponent } from '@components/mantenimiento/rubro/rubro.component';
import { PeriodosSistemaComponent } from '@components/mantenimiento/administracion/periodos-sistema/periodos-sistema.component';
import { TarifaPermitidasUsuarioComponent } from '@components/mantenimiento/administracion/tarifa-permitidas-usuario/tarifa-permitidas-usuario.component';
import { PermisosEspecialesComponent } from '@components/mantenimiento/seguridad/permisos-especiales/permisos-especiales.component';
import { LogUsuarioComponent } from '@modules/admin/log-usuario/log-usuario.component';
import { ParametrosFacturacionSIATComponent } from '@components/mantenimiento/siat/parametros-facturacion-SIAT/parametros-facturacion-SIAT.component';
import { CrearTomaInventarioComponent } from '@components/inventario/crear-toma-inventario/crear-toma-inventario.component';
import { TomaInventarioConsolidadoComponent } from '@components/inventario/toma-inventario-consolidado/toma-inventario-consolidado.component';
import { PrecioItemComponent } from '@components/inventario/operaciones/precio-item/precio-item.component';
import { ActualizarStockActualComponent } from '@components/inventario/saldos-inventario/actualizar-stock-actual/actualizar-stock-actual.component';
import { ExportarImportarSaldosComponent } from '@components/inventario/exportar-importar-saldos/exportar-importar-saldos.component';
import { RegistrarInventarioGrupoComponent } from '@components/inventario/registrar-inventario-grupo/registrar-inventario-grupo.component';
import { ClientesComponent } from '@components/mantenimiento/ventas/clientes/clientes.component';
import { ClientesIgualesComponent } from '@components/mantenimiento/ventas/clientes-iguales/clientes-iguales.component';
import { PuntoVentaComponent } from '@components/mantenimiento/ventas/punto-venta/punto-venta.component';
import { DescuentosEspecialesComponent } from '@components/mantenimiento/ventas/descuentos-especiales/descuentos-especiales.component';
import { NivelesDescuentosComponent } from '@components/mantenimiento/ventas/niveles-descuentos/niveles-descuentos.component';
import { LugaresComponent } from '@components/mantenimiento/ventas/lugares/lugares.component';
import { ProformaComponent } from '@components/mantenimiento/ventas/transacciones/proforma/proforma.component';
import { NotaRemisionComponent } from '@components/mantenimiento/ventas/transacciones/nota-remision/nota-remision.component';
import { FacturaNotaRemisionComponent } from '@components/mantenimiento/ventas/transacciones/factura-nota-remision/factura-nota-remision.component';
import { TiposCreditoComponent } from '@components/mantenimiento/ventas/tipos-credito/tipos-credito.component';
import { VendedoresComponent } from '@components/mantenimiento/ventas/vendedores/vendedores.component';
import { RecargoDocumentoComponent } from '@components/mantenimiento/ventas/recargo-documento/recargo-documento.component';
import { PlanPagoClientesComponent } from '@components/mantenimiento/ventas/plan-pago-clientes/plan-pago-clientes.component';
import { ObservacionesHojaRutaComponent } from '@components/mantenimiento/ventas/observaciones-hoja-ruta/observaciones-hoja-ruta.component';
import { NumeraciontransferenciasComponent } from '@components/mantenimiento/fondos/numeraciontransferencias/numeraciontransferencias.component';
import { NumretirobancarioComponent } from '@components/mantenimiento/fondos/numretirobancario/numretirobancario.component';
import { NumreposicionComponent } from '@components/mantenimiento/fondos/numreposicion/numreposicion.component';
import { NumpagodeudorComponent } from '@components/mantenimiento/fondos/numpagodeudor/numpagodeudor.component';
import { NummovfondosComponent } from '@components/mantenimiento/fondos/nummovfondos/nummovfondos.component';
import { NumentregascargoComponent } from '@components/mantenimiento/fondos/numentregascargo/numentregascargo.component';
import { NumdevolucionesdeudorComponent } from '@components/mantenimiento/fondos/numdevolucionesdeudor/numdevolucionesdeudor.component';
import { NumdepositosclienteComponent } from '@components/mantenimiento/fondos/numdepositoscliente/numdepositoscliente.component';
import { NumdepositosbancariosComponent } from '@components/mantenimiento/fondos/numdepositosbancarios/numdepositosbancarios.component';
import { NumchequesclientesComponent } from '@components/mantenimiento/fondos/numchequesclientes/numchequesclientes.component';
import { NumlibrosbancosComponent } from '@components/mantenimiento/fondos/numlibrosbancos/numlibrosbancos.component';
import { CuentasEfectivoComponent } from '@components/mantenimiento/fondos/cuentas-efectivo/cuentas-efectivo.component';
import { NumcomprasmenoresComponent } from '@components/mantenimiento/compras/numcomprasmenores/numcomprasmenores.component';
import { NumprovisioncompraComponent } from '@components/mantenimiento/compras/numprovisioncompra/numprovisioncompra.component';
import { PercepcionesretencionesComponent } from '@components/mantenimiento/compras/percepcionesretenciones/percepcionesretenciones.component';
import { DeudoresComponent } from '@components/mantenimiento/fondos/deudores/deudores.component';
import { CuentasBancariasComponent } from '@components/mantenimiento/fondos/cuentas-bancarias/cuentas-bancarias.component';
import { DeudoresCompuestosComponent } from '@components/mantenimiento/fondos/deudores-compuestos/deudores-compuestos.component';
import { NumeracionAnticipoComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-anticipo/numeracion-anticipo.component';
import { NumeracionCobranzaComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-cobranza/numeracion-cobranza.component';
import { NumeracionDesctVariosDirectosComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-desct-varios-directos/numeracion-desct-varios-directos.component';
import { NumeracionDescuentoPorMoraComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-descuento-por-mora/numeracion-descuento-por-mora.component';
import { NumeracionTipoAjusteComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-tipo-ajuste/numeracion-tipo-ajuste.component';
import { TipoPagoComponent } from '@components/mantenimiento/cuentas-cobrar/tipo-pago/tipo-pago.component';
import { TalonarioRecibosComponent } from '@components/mantenimiento/cuentas-cobrar/talonario-recibos/talonario-recibos.component';
import { NumeracionDevolucionAnticiposComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-devolucion-anticipos/numeracion-devolucion-anticipos.component';
import { NumeracionDePagoComponent } from '@components/mantenimiento/compras/numeracion-de-pago/numeracion-de-pago.component';
import { CompradoresComponent } from '@components/mantenimiento/compras/compradores/compradores.component';
import { NumeracionPagosMoraComponent } from '@components/mantenimiento/cuentas-cobrar/numeracion-pagos-mora/numeracion-pagos-mora.component';
import { NumTipoDocumentoVentaComponent } from '@components/mantenimiento/ventas/num-tipo-documento-venta/num-tipo-documento-venta.component';
import { SolicitudesDescuentoComponent } from '@components/mantenimiento/ventas/solicitudes-descuento/solicitudes-descuento.component';
import { NumPedidosImportacionComponent } from '@components/mantenimiento/importaciones/numeracion/num-pedidos-importacion/num-pedidos-importacion.component';
import { NumProformaImportacionComponent } from '@components/mantenimiento/importaciones/numeracion/num-proforma-importacion/num-proforma-importacion.component';
import { NumOrdCompraComponent } from '@components/mantenimiento/importaciones/numeracion/num-ord-compra/num-ord-compra.component';
import { NumEmbarqueImportacionComponent } from '@components/mantenimiento/importaciones/numeracion/num-embarque-importacion/num-embarque-importacion.component';
import { NumRecepcionImportacionComponent } from '@components/mantenimiento/importaciones/numeracion/num-recepcion-importacion/num-recepcion-importacion.component';
import { SucursalComponent } from '@components/mantenimiento/contabilidad/sucursal/sucursal.component';
import { PlanCuentaComponent } from '@components/mantenimiento/contabilidad/plan-cuenta/plan-cuenta.component';
import { NumeracionComprobantesComponent } from '@components/mantenimiento/contabilidad/numeracion-comprobantes/numeracion-comprobantes.component';
import { PermisosEspecialesParametrosComponent } from '@components/seguridad/permisos-especiales-parametros/permisos-especiales-parametros.component';
import { ProformaPdfComponent } from '@components/mantenimiento/ventas/transacciones/proforma/proforma-pdf/proforma-pdf.component';
import { EtiquetasItemProformaComponent } from '@components/mantenimiento/ventas/transacciones/proforma/etiquetas-item-proforma/etiquetas-item-proforma.component';
import { EtiquetaImpresionProformaComponent } from '@components/mantenimiento/ventas/transacciones/proforma/etiqueta-impresion-proforma/etiqueta-impresion-proforma.component';
import { ModificarProformaComponent } from '@components/mantenimiento/ventas/transacciones/modificar/modificar-proforma/modificar-proforma.component';
import { ProformaPdfEmailComponent } from '@components/mantenimiento/ventas/transacciones/proforma/proforma-pdf-email/proforma-pdf-email.component';
import { EtiquetaTuercasProformaComponent } from '@components/mantenimiento/ventas/transacciones/proforma/etiqueta-tuercas-proforma/etiqueta-tuercas-proforma.component';
import { ModificarNotaRemisionComponent } from '@components/mantenimiento/ventas/transacciones/modificar/modificar-nota-remision/modificar-nota-remision.component';
import { FacturaTemplateComponent } from '@components/mantenimiento/ventas/transacciones/facturas/factura-template/factura-template.component';
import { FacturacionMostradorTiendasComponent } from '@components/mantenimiento/ventas/transacciones/facturacion-mostrador-tiendas/facturacion-mostrador-tiendas.component';


//AuthGuard canActive poner en el canActive para cuando ya funcione EL JWT
const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'profile',
                component: ProfileComponent,
            },
            // mantenimiento
            {
                path: 'admin/mante/almacen',
                component: AlmacenComponent
            },
            {
                path: 'admin/mante/area',
                component: AreaComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'administracion/mantenimiento/localidades',
                component: LocalidadesComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'administracion/mantenimiento/idproformausuario',
                component: IdProformaUsuarioComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'administracion/mantenimiento/vehiculo',
                component: VehiculoComponent,
                canActivate: [AuthGuard]
            },

            {
                path: 'admin/mante/empresa',
                component: EmpresaComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'admin/mante/moneda',
                component: MonedaComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'admin/mante/usuarios',
                component: UsuarioComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'admin/mante/departamentoPais',
                component: DptopaisComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'admin/mante/provinciasDepartamentoPais',
                component: ProvinciadptopaisComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'admin/mante/unidadNegocio',
                component: UnidadnegocioComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'admin/mante/tipocambio',
                component: TipocambioComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/administracion/periodos-sistema',
                component: PeriodosSistemaComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/administracion/tarifa-permitida-usuario',
                component: TarifaPermitidasUsuarioComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/seguridad/permisosEspeciales',
                component: PermisosEspecialesComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/inventario/item',
                component: ItemComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/inventario/lineaItem',
                component: LineaproductoComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/inventario/grupoLinea',
                component: GruposlineasComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/inventario/grupoLineaDescuentos',
                component: GruposlineasdescuentosComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/inventario/unidadMedida',
                component: UnidadmedidaComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/inventario/rosca',
                component: RoscaComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/inventario/terminacion',
                component: TerminacionComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/inventario/resistencia',
                component: ResistenciaComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/ventas/rubro',
                component: RubroComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/inventario/conceptoMovimientoMercaderia',
                component: ConceptosmovimientosmercaderiaComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/inventario/conceptoPedidoMercaderia',
                component: NumpedidomercaderiaComponent,
                canActivate: [AuthGuard]
                //numeracionTipoPedidoMercaderia
            },
            {
                path: 'mantenimiento/inventario/numeracionconocimientoCarga',
                component: TipoconocimientocargaComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/inventario/numNotasMovimiento',
                component: NumnotasdemovimientoComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/inventario/numeracionSolicitudUrgente',
                component: NumsolicitudurgenteComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/inventario/numeracionInventarioFisico',
                component: TipoinventarioComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/rolAcesso/accesos',
                component: RolesComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/ventas/cliente',
                component: ClientesComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/ventas/cliente_iguales',
                component: ClientesIgualesComponent,
                canActivate: [AuthGuard]
            },

            {
                path: 'sistema/documentacion/errores',
                component: DocumentationErrorsComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'sistema/consultas_externas/interbancos',
                component: InterbancosComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/siat/parametrosFacturacionSIAT',
                component: ParametrosFacturacionSIATComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/generar_autorizaciones_especiales',
                component: PermisosEspecialesParametrosComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'inventario/inventarioFisico/inventario',
                component: CrearTomaInventarioComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'inventario/inventarioFisico/tomaInventario',
                component: TomaInventarioConsolidadoComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'inventario/operaciones/definirPrecioItem',
                component: PrecioItemComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'inventario/saldoInventario/actualizarStockActual',
                component: ActualizarStockActualComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'inventario/ExportarImportarSaldos',
                component: ExportarImportarSaldosComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'inventario/inventarioFisico/RegistrarTomaInventarioGrupo',
                component: RegistrarInventarioGrupoComponent,
                canActivate: [AuthGuard]
            },


            //ventas
            {
                path: 'mantenimiento/ventas/puntoVenta',
                component: PuntoVentaComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/ventas/descuentosEspeciales',
                component: DescuentosEspecialesComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/ventas/nivelesDescuentos',
                component: NivelesDescuentosComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/ventas/lugares',
                component: LugaresComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/ventas/clienteIguales',
                component: ClientesIgualesComponent,
                canActivate: [AuthGuard]
            },

            {
                path: 'mantenimiento/ventas/tiposCreditos',
                component: TiposCreditoComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/ventas/vendedores',
                component: VendedoresComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/ventas/recargoDocumento',
                component: RecargoDocumentoComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/ventas/planPagoClientes',
                component: PlanPagoClientesComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/ventas/observacionesHojaRuta',
                component: ObservacionesHojaRutaComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/ventas/numTipoDocumentoVenta',
                component: NumTipoDocumentoVentaComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/ventas/numSolicitudMercaderia',
                component: SolicitudesDescuentoComponent,
                canActivate: [AuthGuard]
            },
            //fin ventas







            //Fondos
            {
                path: 'mantenimiento/fondos/bancos',
                component: BancoComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/fondos/cuentasBancarias',
                component: CuentasBancariasComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/fondos/numeracionTransferencias',
                component: NumeraciontransferenciasComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/fondos/numeracionRetiroBancario',
                component: NumretirobancarioComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/fondos/numeracionReposicion',
                component: NumreposicionComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/fondos/numeracionPagoDeudor',
                component: NumpagodeudorComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/fondos/numeracionMonFondos',
                component: NummovfondosComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/fondos/numeracionEntregaCargo',
                component: NumentregascargoComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/fondos/numeracionDevoDeudor',
                component: NumdevolucionesdeudorComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/fondos/numeracionDepoCliente',
                component: NumdepositosclienteComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/fondos/numeracionDepoBancario',
                component: NumdepositosbancariosComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/fondos/numeracionChequeClient',
                component: NumchequesclientesComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/fondos/numeracionLibroBancos',
                component: NumlibrosbancosComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/fondos/cuentasEfectivo',
                component: CuentasEfectivoComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/fondos/deudores',
                component: DeudoresComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/fondos/deudoresCompuestos',
                component: DeudoresCompuestosComponent,
                canActivate: [AuthGuard]
            },
            //Fondos Fin



            //cuentas por cobrar
            {
                path: 'mantenimiento/cuentasCobrar/numeracionAnticipacionCliente',
                component: NumeracionAnticipoComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/cuentasCobrar/numeracionCobranza',
                component: NumeracionCobranzaComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/cuentasCobrar/numeracionDesctPagoMora',
                component: NumeracionPagosMoraComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/cuentasCobrar/numeracionDevolucionAnticipos',
                component: NumeracionDevolucionAnticiposComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/cuentasCobrar/numeracionTalonarioRecibos',
                component: TalonarioRecibosComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/cuentasCobrar/numeracionTipoPago',
                component: TipoPagoComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/cuentasCobrar/numeracionTipoAjuste',
                component: NumeracionTipoAjusteComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/cuentasCobrar/numeracionDesctMora',
                component: NumeracionDescuentoPorMoraComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/cuentasCobrar/numeracionDescVariosDirectos',
                component: NumeracionDesctVariosDirectosComponent,
                canActivate: [AuthGuard]
            },
            //fin cuentas por cobrar



            //mantenimiento/importaciones
            {
                path: 'mantenimiento/importaciones/numeracion/pedidos',
                component: NumPedidosImportacionComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/importaciones/numeracion/proformas',
                component: NumProformaImportacionComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/importaciones/numeracion/ordenCompra',
                component: NumOrdCompraComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/importaciones/numeracion/embarque',
                component: NumEmbarqueImportacionComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/importaciones/numeracion/recepcion',
                component: NumRecepcionImportacionComponent,
                canActivate: [AuthGuard]
            },
            //fin mantenimiento/importaciones




            //mantenimiento/compras
            {
                path: 'mantenimiento/compras/compradores',
                component: CompradoresComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/compras/numComprasMenores',
                component: NumcomprasmenoresComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/compras/numeracionPago',
                component: NumeracionDePagoComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/compras/numProvisionCompra',
                component: NumprovisioncompraComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/compras/percepcionesRetenciones',
                component: PercepcionesretencionesComponent,
                canActivate: [AuthGuard]
            },
            //fin mantenimiento/compras







            // mantenimiento/contabilidad
            {
                path: 'mantenimiento/contabilidad/sucursal',
                component: SucursalComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/contabilidad/plancuenta',
                component: PlanCuentaComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'mantenimiento/contabilidad/numComprobantes',
                component: NumeracionComprobantesComponent,
                canActivate: [AuthGuard]
            },








            // fin mantenimiento/contabilidad

            {
                path: 'usuario/parametros_usuarios',
                component: ParametroUsuarioComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'archivo/parametros_empresa',
                component: ParamempresaComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'venta/transacciones/nota-remision',
                component: NotaRemisionComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'venta/modificaciones/modificacion-nota-remision',
                component: ModificarNotaRemisionComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'venta/transacciones/nota-remision-factura',
                component: FacturaNotaRemisionComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'venta/transacciones/facturacion-fel-mostrador',
                component: FacturacionMostradorTiendasComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'admin/system/log',
                component: LogComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'admin/system/log_usuario',
                component: LogUsuarioComponent,
                canActivate: [AuthGuard]
            },




            // ventas
            {
                path: 'venta/transacciones/proforma',
                component: ProformaComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'venta/modificaciones/proforma',
                component: ModificarProformaComponent,
                canActivate: [AuthGuard]
            },


            // {
            //     path: 'blank',
            //     component: BlankComponent
            // },
            // {
            //     path: 'sub-menu-1',
            //     component: SubMenuComponent
            // },
            // {
            //     path: 'sub-menu-2',
            //     component: BlankComponent
            // },
            {
                path: '',
                component: DashboardComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'lab',
                component: LaboratorioComponent
            },




            // FACTURA TEMPLATE
            {
                path: 'venta/transacciones/facturaTemplate',
                component: FacturaTemplateComponent
            },








            //PDF REPORTES DESDE ACA
            {
                path: 'proformaPDF',
                component: ProformaPdfComponent
            },
            {
                path: 'proformaPDFCorreo',
                component: ProformaPdfEmailComponent
            },

            {
                path: 'etiquetasItemsProforma',
                component: EtiquetasItemProformaComponent
            },
            {
                path: 'etiquetaTuercasProforma',
                component: EtiquetaTuercasProformaComponent
            },
            {
                path: 'etiquetaImpresionProforma',
                component: EtiquetaImpresionProformaComponent
            },



        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./modules/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'recover-password',
        component: RecoverPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'search',
        component: SidebarSearchComponent,
    },


    { path: '**', pathMatch: 'full', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
