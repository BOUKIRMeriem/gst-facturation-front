import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingRoutingModule } from './setting-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import {TableModule} from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { AddAccountComponent } from './account/add-account/add-account.component';
import { ListAccountComponent } from './account/list-account/list-account.component';

@NgModule({
  declarations: [ AddAccountComponent, ListAccountComponent],
  imports: [
    CommonModule,
    SettingRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DropzoneModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingModule { }
