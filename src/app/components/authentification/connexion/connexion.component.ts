import { Component, OnInit } from '@angular/core';
import {  FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthentificationService } from 'src/app/shared/service/authentification.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {
  email: string;
  password: string;

  constructor(private router: Router, private formBuilder: FormBuilder, private toastr: ToastrService, private authService: AuthentificationService) {
  }
  ngOnInit() {
  }

  loginUser(){
    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('password', this.password);

    this.authService.authenticateUser(formData).subscribe(
        (data) => {
          if (data){
            this.authService.storeUserData(data.accessToken, data.user , data.refreshToken);
            this.toastr.success('L\'utilisateur a été authentifié avec succès', '', {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });
            setTimeout(() => {
              const url = ['/dashboard/default'];
              this.router.navigate(url);
            }, 1500);
          }
        },
        (error) => {
          this.toastr.error(error.msg, 'Nom ou mot de passe incorrect', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
      );
  }
}
