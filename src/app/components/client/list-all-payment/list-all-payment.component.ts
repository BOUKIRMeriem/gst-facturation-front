import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Table} from 'primeng/table';
import {Router} from '@angular/router';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {LazyLoadEvent} from 'primeng/api';
import {DatePipe} from '@angular/common';
import { Client } from 'src/app/shared/model/client/Client.model';
import {RemoveCommaPipe} from "../../../shared/helpers/RemoveCommaPipe";
import {PaymentClient} from "../../../shared/model/client/PaymentClient.model";
import { ClientService } from 'src/app/shared/service/Client/client.service';
import {PaymentClientService} from "src/app/shared/service/Client/PaymentClient.service";
import { listTypes } from 'src/app/shared/helpers/data.helper';

@Component({
  selector: 'app-list-all-payment',
  templateUrl: './list-all-payment.component.html',
  styleUrls: ['./list-all-payment.component.scss'],
  providers: [RemoveCommaPipe, DatePipe]
})
export class ListAllPaymentComponent implements OnInit {

  @Input() clientId: string;
  @Input() isClient = false;
  type: string;
  atrPayment: any;
  rows: number;
  listTypes: any[];
  listPayments: Array<PaymentClient> = [];
  public closeResult: string;
  paymentToDelete: PaymentClient;
  page: number;
  size: number;
  @ViewChild('dt2') dataTable: Table;
  status: string;
  // Dropdown Client
  listClients: Array<Client> = [];
  selectedClient: Client;

  constructor(private clientService: ClientService, private router: Router, private modalService: NgbModal, private paymentClientService: PaymentClientService, private toastr: ToastrService) {
    this.rows = 40;
  }

  ngOnInit(): void {
    this.listTypes = listTypes;
    this.atrPayment = [
      { field: 'verified', header: 'ST', width: '2%' },
      { field: 'factureClient.numPiece', header: 'N°Facture', width: '6%' },
      { field: 'date', header: 'Date', width: '5%' },
      { field: 'client.name', header: 'Client', width: '15%'},
      { field: 'client.ice', header: 'ICE', width: '12%'},
      { field: 'designation', header: 'Mode', width: '15%' },
      { field: 'type', header: 'Type', width: '4%' },
      { field: 'deadline', header: 'Date D\'échéance', width: '8%' },
      { field: 'amount', header: 'Montant', width: '7%', position: 'center' },
    ];
    this.getAllPayments();
    this.paymentClientService.refresh.subscribe(response => {
      this.getAllPayments();
    });
    this.getAllClients();
  }

  getAllPayments(){
    this.paymentClientService.getAllPayments(this.clientId).subscribe((res) => {
      this.listPayments = res;
    })
  }

  getTypeName(code: string): string {
    const type = this.listTypes.find(item => item.code === code);
    return type ? type.name : 'Unknown';
  }

  getAllClients() {
    this.clientService.getAll()
      .subscribe(client => {
        this.listClients = client;
        this.selectedClient = this.listClients.find((d) => d.id === this.clientId);
      });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  setPaymentToDelete(paymentClient: PaymentClient) {
    this.paymentToDelete = paymentClient;
  }

  onClickVerifiedPayment(payment: PaymentClient) {
    this.paymentClientService.verifiedPaymentClient(payment.id).subscribe(
      (success) => {
        this.toastr.success('Reglement a été validée avec succès.', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'

        });
      },
      (error) => {
        console.log(error);
        this.toastr.error('Reglement n\'a pas été validée avec succès.', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    );
  }

  onClickUnVerifiedPayment(payment: PaymentClient) {
    this.paymentClientService.unverifiedPaymentClient(payment.id).subscribe(
      (success) => {
        this.toastr.success('Reglement a été dévalidée avec succès.', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'

        });
      },
      (error) => {
        console.log(error);
        this.toastr.error('Reglement n\'a pas été dévalidée avec succès.', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    );
  }

  onClickDeletePayment() {
    if (!this.paymentToDelete.verified) {
      this.paymentClientService.deletePaymentClientById(this.paymentToDelete.id).subscribe(
        (success) => {
          this.toastr.success('Reglement a été supprimé avec succès', '', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        },
        (error) => {
          console.log(error);
          this.toastr.error('Deletion error', '', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
      );
    }
  }

}
