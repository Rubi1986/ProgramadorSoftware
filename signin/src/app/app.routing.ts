import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from "./app.component";
import { LoginComponent } from './login/login.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const appRoutes = [
    { path: "", component: AppComponent, pathMatch: "full" },
    { path: 'login', component: LoginComponent,  pathMatch: 'full'},
    { path: 'usuarios', component: UsuariosComponent,  pathMatch: 'full'}
  ];

export const routing = RouterModule.forRoot(appRoutes);