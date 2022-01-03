import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { coordenada } from '../../models/coordenada';
import { MouseEvent } from '@agm/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { venta } from '../../models/venta';

@Component({
  selector: 'app-googlemaps',
  templateUrl: './googlemaps.component.html',
  styleUrls: ['./googlemaps.component.css'],
})
export class GooglemapsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'price'];
  dataSource: MatTableDataSource<venta>;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  form: FormGroup;

  ubicacionCentral: coordenada = {
    latitud: 0,
    longitud: 0,
  };

  dir = {
    origin: { lat: 0, lng: 0 },
    destination: { lat: 0, lng: 0 },
  };

  zoom = 10;

  coordenadas: coordenada[] = [];

  public enabled = true;

  displaycircle = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('focus', { static: true }) inputfocus: any;

  public coordenada: string = '';

  @Input()
  set player(value: string) {
    this.coordenada = value;
  }

  get player(): string {
    return this.coordenada;
  }

  constructor(
    public formBuilder: FormBuilder,
    public ventaService: VentaService,
    public router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getCurrentPosition();
    this.getVentas();

    this.inputfocus.nativeElement.focus();

    this.form = this.formBuilder.group({
      destination: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[-+]?[0-9]{1,7}(.[0-9]+)?,[-+]?[0-9]{1,7}(.[0-9]+)?$'
          ),
        ],
      ],
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  mapClicked($event: MouseEvent) {
    let coord: coordenada = {
      latitud: $event.coords.lat,
      longitud: $event.coords.lng,
    };
    this.coordenadas.push(coord);
    this.trazarRutaMarcada();
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.ubicacionCentral.latitud = position.coords.latitude;
      this.ubicacionCentral.longitud = position.coords.longitude;
    });
  }

  trazarRuta(form: FormGroup) {
    if (this.form.invalid) {
      return;
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        this.dir.origin = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });

      const latlngDestination = form.value.destination.split(',', 2);
      this.dir.destination = {
        lat: parseFloat(latlngDestination[0]),
        lng: parseFloat(latlngDestination[1]),
      };
    }
    this.habilitarpedido();
  }

  habilitarpedido() {
    if (this.ventaService.ventas.length > 0) {
      this.enabled = false;
    }
  }

  trazarRutaMarcada() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.dir.origin = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });

    if (this.coordenadas.length > 0) {
      this.dir.destination = {
        lat: this.coordenadas[this.coordenadas.length - 1].latitud,
        lng: this.coordenadas[this.coordenadas.length - 1].longitud,
      };
      this.coordenada =
        this.dir.destination.lat + ',' + this.dir.destination.lng;
      this.habilitarpedido();
    }
  }

  getVentas() {
    this.dataSource = new MatTableDataSource(this.ventaService.ventas);
    this.dataSource.paginator = this.paginator;
  }

  enviarPedido() {
    if (
      confirm('¿Estás seguro de querer enviar la venta al destino ingresado?')
    ) {
      this._snackBar.open('Venta realizada', 'Deshacer', {
        duration: 3000,
      });
      this.router.navigate(['/ventas']);
      this.ventaService.subtotal = 0;
      this.ventaService.totalVenta = 0;
    }
  }
}
