import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  email: string;
  password: string;
  
  constructor(public usuariosServicio: UsuariosService) { }

  login() {
    console.log(this.email);
    console.log(this.password);
    this.usuariosServicio.validarUsuario(this.email, this.password);
  }

}
