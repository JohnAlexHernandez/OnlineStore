import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { post } from '../../models/post';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-producto',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  title: string;

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

  form: FormGroup;

  public submitted = false;

  displaycircle = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('focus', { static: true }) inputfocus: any;

  constructor(
    private postService: PostService,
    public formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getPosts();

    this.inputfocus.nativeElement.focus();

    this.form = this.formBuilder.group({
      id: [],
      title: ['', [Validators.required]],
      price: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')],
      ],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      count: ['', [Validators.required, Validators.pattern('^([0-9])*$')]],
    });
  }

  getPost(id: number) {
    this.postService.getPost(id).subscribe((res: any) => {
      console.log(res);
    });
  }

  resetForm(form: FormGroup) {
    form.reset();
  }

  addPost(form: FormGroup) {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      if (form.value.id) {
        this.postService.updatePost(form.value).subscribe(
          (res) => {
            console.log(res);
            this._snackBar.open('Artículo actualizado', 'Deshacer', {
              duration: 3000,
            });
            this.getPosts();
            form.reset();
          },
          (err) => console.error(err)
        );
      } else {
        this.postService.createPost(form.value).subscribe(
          (res) => {
            console.log(res);
            this._snackBar.open('Artículo creado', 'Deshacer', {
              duration: 3000,
            });
            this.getPosts();
            form.reset();
          },
          (err) => console.error(err)
        );
      }
    }
  }

  getPosts() {
    this.postService.getPosts().subscribe(
      (res: any) => {
        this.postService.posts = res;
        this.dataSource = new MatTableDataSource(this.postService.posts);
        this.dataSource.paginator = this.paginator;
      },
      (err) => console.error(err)
    );
  }

  deletePost(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar el artículo?')) {
      this.postService.deletePost(id).subscribe(
        (res) => {
          console.log(res);
          this._snackBar.open('Artículo eliminado', 'Deshacer', {
            duration: 3000,
          });
          this.getPosts();
        },
        (err) => console.error(err)
      );
    }
  }

  editPost(post: post) {
    this.form.patchValue(post);
  }
}
