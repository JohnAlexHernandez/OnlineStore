import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';
import { PostComponent } from './component/post/post.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RoutingModule } from './routing/routing.module';
import { VentasComponent } from './component/ventas/ventas.component';
import { DialogPostComponent } from './component/ventas/ventas.component';
import { GooglemapsComponent } from './component/googlemaps/googlemaps.component';
import { AgmDirectionModule } from 'agm-direction';
import { PostService } from './services/post.service';
import { VentaService } from './services/venta.service';

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    VentasComponent,
    DialogPostComponent,
    GooglemapsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    NgbModule,
    RoutingModule,
    MatSidenavModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSliderModule,
    MatSnackBarModule,
    AgmDirectionModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDWpzxYa5xyBFqT1lWbaRi58ir_70UYxVY',
    }),
  ],
  providers: [PostService, VentaService],
  bootstrap: [AppComponent],
})
export class AppModule {}
