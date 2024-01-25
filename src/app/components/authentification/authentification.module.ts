import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthentificationRoutingModule } from './authentification-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ConnexionComponent } from './connexion/connexion.component';
import { FormsModule } from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown'; // Import FormsModule


@NgModule({
  declarations: [ConnexionComponent],
  imports: [
    CommonModule,
    AuthentificationRoutingModule,
    ReactiveFormsModule,
    DropdownModule,
    NgbModule,
    CarouselModule,
    SharedModule,
    FormsModule
  ]
})
export class AuthentificationModule { }
