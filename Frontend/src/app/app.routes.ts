import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/layout/layout.component';
import { PublicComponent } from './components/public/public.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CurrencyConverterComponent } from './components/currency-converter/currency-converter.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    canActivate: [publicGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [publicGuard]
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'converter',
        component: CurrencyConverterComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
