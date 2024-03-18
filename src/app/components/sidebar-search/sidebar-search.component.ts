import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Menu } from '@services/modelos/objetos';
import { Observable, map, startWith } from 'rxjs';

@Component({
    selector: 'app-sidebar-search',
    templateUrl: './sidebar-search.component.html',
    styleUrls: ['./sidebar-search.component.scss']
})
export class SidebarSearchComponent implements OnInit {

    menu:Menu[] = [
        {
            name: 'Dashboard',
            iconClasses: 'fas fa-tachometer-alt',
            path: ['/']
        },
        {
            name: 'Area',
            iconClasses: 'fas fa-file',
            path: ['/admin/mante/area']
        },
        {
            name: 'Departamento del Pais',
            iconClasses: 'fas fa-file',
            path: ['/admin/mante/departamentoPais']
        },
        {
            name: 'Provincias de un Departamento',
            iconClasses: 'fas fa-file',
            path: ['/admin/mante/provinciasDepartamentoPais']
        },
        {
            name: 'Empresas',
            iconClasses: 'fas fa-file',
            path: ['/admin/mante/empresa']
        },
        {
            name: 'ID Proformas Usuario',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Moneda',
            iconClasses: 'fas fa-file',
            path: ['/admin/mante/moneda']
        },
        {
            name: 'Tipo de Cambio',
            iconClasses: 'fas fa-file',
            path: ['/admin/mante/tipocambio']
        },
        {
            name: 'Unidad de Negocio',
            iconClasses: 'fas fa-file',
            path: ['/admin/mante/unidadNegocio']
        },
        {
            name: 'Parametros de la Empresa',
            iconClasses: 'fas fa-file', 
            path: ['/archivo/parametros_empresa']
        }, 
        {
            name: 'Compradores',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Conceptos de Compra',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Proveedores',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Plan de Pagos Proveedores',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Numeracion de Compra',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Numeracion de Pagos',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Numeracion de Provisiones',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Percepciones / Retenciones',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Vehiculo',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Tipo Activo',
            iconClasses: 'fas fa-file', 
            path: ['/blank']
        },
        {
            name: 'Aseguradora',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Seguro',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Razones de Baja',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
    
    
        //inventario
        {
            name: 'Almacen',
            iconClasses: 'fas fa-file',
            path: ['/admin/mante/almacen']   
        },
        {
            name: 'Item', 
            iconClasses: 'fas fa-file',
            path: ['/mantenimiento/inventario/item']
        },
        {
            name: 'Linea de Items',
            iconClasses: 'fas fa-file',
            path: ['/mantenimiento/inventario/grupoLinea']
        },
        {
            name: 'Grupo de Lineas para Descuento',
            iconClasses: 'fas fa-file',
            path: ['/mantenimiento/inventario/grupoLineaDescuentos'] 
        },
        {
            name: 'Grupo de Items Ventas',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
       
    
    
    
        {
            name: 'Bancos',
            iconClasses: 'fas fa-file',
            path: ['/fondos/bancos']
        },
    
    
        
        {
            name: 'Rosca',
            iconClasses: 'fas fa-file',
            path: ['/mantenimiento/inventario/rosca']
        },
        {
            name: 'Tipo de Resistencias',
            iconClasses: 'fas fa-file',
            path: ['/mantenimiento/inventario/resistencia']
        },
        {
            name: 'Terminacion',
            iconClasses: 'fas fa-file',
            path: ['/mantenimiento/inventario/terminacion']
        },
        {
            name: 'Unidad de Medida',
            iconClasses: 'fas fa-file',
            path: ['/mantenimiento/inventario/unidadMedida']
        },
        {
            name: 'Lista de Stock',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Lista de Empaques',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Lista de Stock Maximo / Minimo',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Matriz',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Conceptos de Movimiento de Mercaderia',
            iconClasses: 'fas fa-file',
            path: ['/mantenimiento/inventario/conceptoMovimientoMercaderia']
        },
        {
            name: 'Numeracion de Pedido de Mercaderia',
            iconClasses: 'fas fa-file',
            path: ['/mantenimiento/inventario/conceptoPedidoMercaderia']
        },
        {
            name: 'Numeracion de Conocimiento de Carga',
            iconClasses: 'fas fa-file',
            path: ['mantenimiento/inventario/numeracionconocimientoCarga']
        },
        {
            name: 'Numeracion de Empaquetado',
            iconClasses: 'fas fa-file',
            path: ['/mantenimiento/inventario/numeracionNotasEmpaquetado']
        },
        {
            name: 'Numeracion de Lotes',
            iconClasses: 'fas fa-file',
            path: ['/mantenimiento/inventario/numeracionLotes']
        },
        {
            name: 'Numeracion de Notas de Movimiento',
            iconClasses: 'fas fa-file',
            path: ['/mantenimiento/inventario/numNotasMovimiento']
        },
        {
            name: 'Numeracion de Solicitud Urgente',
            iconClasses: 'fas fa-file',
            path: ['/mantenimiento/inventario/numeracionSolicitudUrgente']
        },
        {
            name: 'Numeracion de Inventario Fisico',
            iconClasses: 'fas fa-file',
            path: ['/mantenimiento/inventario/numeracionInventarioFisico']
        },
    
    
    
    
    
        {
            name: 'Roles',
            iconClasses: 'fas fa-file',
            path: ['/mantenimiento/rolAcesso/accesos']
        },
        {
            name: 'Usuarios',
            iconClasses: 'fas fa-file',
            path: ['/admin/mante/usuarios']
        },
        {
            name: 'Permisos Especiales',
            iconClasses: 'fas fa-file',
            path: ['/mantenimiento/seguridad/permisosEspeciales']
        },
        {
            name: 'Administrar Permisos',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Numeración de Inventario',
            iconClasses: 'fas fa-file',
            path: ['/blank']
        },
        {
            name: 'Proforma',
            iconClasses: 'fas fa-file',
            path: ['/venta/transacciones/proforma']
        },
    ];

    public searchText: string = '';
    public foundMenuItems = [];
    myControl = new FormControl();


    filteredOptions: Observable<Menu[]>;

    constructor() { }

    ngOnInit(): void{
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(""),
            map(value => (typeof value === "string" ? value : value.name)),
            map(name => (name ? this._filter(name) : this.menu.slice()))
        );  
    }


    displayFn(user?: Menu): string | undefined {
        console.log(user ? user.name : "");
        return user ? user.name : undefined;
      }
      returnFn(user?: Menu): string | undefined {
        return user ? user.name : undefined;
      }
    
      private _filter(name: string): Menu[] {
        const filterValue = name.toLowerCase();
    
        return this.menu.filter(
          option => option.name.toLowerCase().indexOf(filterValue) === 0
        );
      }


}
