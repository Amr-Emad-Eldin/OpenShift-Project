import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrderComponent } from './order/order.component';
import {OrderListComponent} from './order-list/order-list.component';
import {CourierPageComponent} from './courier-page/courier-page.component';
import {AdminComponent} from './admin/admin.component';

const routes: Routes = [
  {path:'', redirectTo : 'login', pathMatch:'full'},
  {path:'login', component: LoginComponent},
  {path: 'order', component: OrderComponent },
  {path: 'orderDetails', component: OrderListComponent},
  {path: 'courierPage', component: CourierPageComponent},
  {path: '123admin123', component: AdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
