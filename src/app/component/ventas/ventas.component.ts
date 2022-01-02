import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { post } from 'src/app/models/post';
import { PostService } from '../../services/post.service';
import { VentaService } from '../../services/venta.service';
import { venta } from '../../models/venta';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
})
export class VentasComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'title',
    'price',
    'category',
    'count',
    'acciones',
  ];
  dataSource: MatTableDataSource<post>;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  form: FormGroup;

  productoUpload: MatDialogRef<DialogPostComponent>;

  public submitted = false;

  public isUpdate = false;

  public postsfacturados = 0;

  public enabled = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('focus', { static: true }) inputfocus: any;

  constructor(
    public formBuilder: FormBuilder,
    private postService: PostService,
    public dialog: MatDialog,
    public ventaService: VentaService,
    public router: Router,
    public _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.inputfocus.nativeElement.focus();

    this.form = this.formBuilder.group({
      id: [],
      title: [],
      price: [],
      description: [],
      category: [],
      count: ['', [Validators.required, Validators.pattern('^([0-9])*$')]],
      subtotal: [],
    });
  }

  addVenta(form: FormGroup) {
    this.submitted = true;
    form.value.subtotal = form.value.price * form.value.count;
    if (this.form.invalid) {
      return;
    } else {
      if (this.isUpdate) {
        const indice = this.ventaService.ventas.findIndex(
          (elemento, indice) => {
            if (elemento.id === this.form.value.id) {
              return true;
            }
          }
        );

        if (indice !== -1) {
          this.ventaService.ventas[indice] = this.form.value;
        }
        this._snackBar.open('Venta actualizada', 'Deshacer', {
          duration: 3000,
        });
        this.getVentas();
      } else {
        this.ventaService.ventas.push(this.form.value);
        this._snackBar.open('Venta creada', 'Deshacer', {
          duration: 3000,
        });
        this.getVentas();
      }
    }
  }

  editVenta(id: any, post: venta, cantidad: any) {
    this.isUpdate = true;
    this.form.controls.id.patchValue(id);
    this.form.controls.title.patchValue(post.title);
    this.form.controls.price.patchValue(post.price);
    this.form.controls.description.patchValue(post.description);
    this.form.controls.count.patchValue(cantidad);
    this.form.controls.category.patchValue(post.category);
  }

  deleteVenta(venta: venta) {
    if (confirm('¿Estás seguro de que quieres eliminar la venta?')) {
      let i = this.ventaService.ventas.indexOf(venta);
      if (i !== -1) {
        this.ventaService.ventas.splice(i, 1);
      }
      this._snackBar.open('Venta eliminada', 'Deshacer', {
        duration: 3000,
      });
      this.getVentas();
    }
  }

  getVentas() {
    this.enabled = false;
    this.ventaService.totalVenta = 0;
    for (var venta of this.ventaService.ventas) {
      this.ventaService.totalVenta =
        this.ventaService.totalVenta + venta.subtotal;
    }
    this.dataSource = new MatTableDataSource(this.ventaService.ventas);
    this.dataSource.paginator = this.paginator;
    if (this.postsfacturados > 0) {
      this.cargarPost();
    }
  }

  resetForm(form: FormGroup) {
    form.reset();
  }

  getProductos() {
    this.postService.getPosts().subscribe(
      (res) => {
        this.postService.posts = res;
      },
      (err) => console.error(err)
    );
  }

  openDialog() {
    this.getProductos();
    this.postService.selectedPosts = [];
    this.productoUpload = this.dialog.open(DialogPostComponent);
    this.productoUpload.afterClosed().subscribe((res) => {
      this.postsfacturados = this.postService.selectedPosts.length;
      this.cargarPost();
    });
  }

  payBill() {
    this.router.navigate(['/googlemaps']);
  }

  cargarPost() {
    if (this.postsfacturados > 0) {
      var indice = this.postService.selectedPosts.length - this.postsfacturados;
      for (var i = indice; i < this.postService.selectedPosts.length; i++) {
        this.form.patchValue(this.postService.selectedPosts[indice]);
        this.postsfacturados = this.postsfacturados - 1;
        break;
      }
    }
  }
}

@Component({
  selector: 'app-dialog-post',
  templateUrl: './dialog-post.component.html',
  styleUrls: ['./dialog-post.component.css'],
})
export class DialogPostComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'title',
    'price',
    'category',
    'count',
    'acciones',
  ];
  dataSource: MatTableDataSource<post>;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  shoppingCart = [];

  filterPost = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public postService: PostService,
    public dialogRef: MatDialogRef<DialogPostComponent>,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getProductos();
  }

  getProductos() {
    this.postService.getPosts().subscribe(
      (res) => {
        this.postService.posts = res;
        this.dataSource = new MatTableDataSource(this.postService.posts);
        this.dataSource.paginator = this.paginator;
      },
      (err) => console.error(err)
    );
  }

  addToCart(post: post, ischeked: boolean) {
    if (ischeked) {
      this.shoppingCart.push(post);
      this._snackBar.open('artículo agregado', 'Deshacer', {
        duration: 1000,
      });
    } else {
      let i = this.shoppingCart.indexOf(post);
      if (i !== -1) {
        this.shoppingCart.splice(i, 1);
      }
      this._snackBar.open('artículo eliminado', 'Deshacer', {
        duration: 3000,
      });
    }
  }

  sellProducto() {
    this.postService.selectedPosts = this.shoppingCart;
  }

  removeFromCart() {
    this.dialogRef.close();
  }
}
