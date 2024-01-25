import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { StoreRoutingModule } from './product-routing.module';
import { InputNumberModule } from 'primeng/inputnumber';
import { ListProductComponent } from './list-product/list-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import {DropdownModule} from 'primeng/dropdown';

@NgModule({
  declarations: [ListProductComponent, AddProductComponent],
  imports: [
    CommonModule,
    StoreRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DropzoneModule,
    TableModule,
    ToolbarModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductModule {}
