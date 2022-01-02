import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PostComponent } from '../component/post/post.component';
import { VentasComponent } from '../component/ventas/ventas.component';
import { GooglemapsComponent } from '../component/googlemaps/googlemaps.component';

const routes: Routes = [
  { path: '', redirectTo: '/ventas', pathMatch: 'full' },
  { path: 'posts', component: PostComponent },
  { path: 'ventas', component: VentasComponent },
  { path: 'googlemaps', component: GooglemapsComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
