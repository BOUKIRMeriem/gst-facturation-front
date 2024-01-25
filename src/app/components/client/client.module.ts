import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ListClientComponent } from './list-client/list-client.component';
import { AddClientComponent } from './add-client/add-client.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { AddFactureModalComponent } from './facture/add-facture-modal/add-facture-modal.component';
import { ListFactureComponent } from './facture/list-facture/list-facture.component';
import { ListPaymentComponent } from './facture/list-payment/list-payment.component';
import { ListAllPaymentComponent } from './list-all-payment/list-all-payment.component';

@NgModule({
  declarations: [
    ListClientComponent,
    AddClientComponent,
    AddFactureModalComponent,
    ListFactureComponent,
    ListPaymentComponent,
    ListAllPaymentComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DropzoneModule,
    DropdownModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    InputNumberModule,
    CheckboxModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ClientModule {}
