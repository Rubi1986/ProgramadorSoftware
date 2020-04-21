import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  token: string;

  validarUsuario(email, password){
    this.http.get('http://localhost:3000/validarUsuario').subscribe(data => {
      console.log(data);
    });
  }

  constructor(private http: HttpClient) { }
}
