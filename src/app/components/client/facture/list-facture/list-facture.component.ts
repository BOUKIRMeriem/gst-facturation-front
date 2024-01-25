import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RemoveCommaPipe } from 'src/app/shared/helpers/RemoveCommaPipe';
import { Table } from 'primeng/table';
import {FactureClientService} from '../../../../shared/service/Client/FactureClient.service';
import {FactureClientModel} from '../../../../shared/model/client/FactureClient.model';
import {LazyLoadEvent} from 'primeng/api';
import { Client } from 'src/app/shared/model/client/client.model';
import { ClientService } from 'src/app/shared/service/Client/client.service';
import {AddFactureModalComponent} from '../add-facture-modal/add-facture-modal.component';
import {ListPaymentComponent} from "../list-payment/list-payment.component";

@Component({
  selector: 'app-list-facture',
  templateUrl: './list-facture.component.html',
  styleUrls: ['./list-facture.component.scss'],
  providers: [ RemoveCommaPipe ]
})
export class ListFactureComponent implements OnInit {

  @Input() clientId;
  @Input() isClient = false;
  atrFacture: any;
  factureClients: Array<FactureClientModel> = [];
  public closeResult: string;
  factureToDelete: FactureClientModel;
  page: number;
  size: number;
  @ViewChild('dt2') dataTable: Table;
  status: string;
  // Dropdown Client
  listClients: Array<Client> = [];
  selectedClient: Client;
  constructor(private clientService: ClientService, private router: Router, private modalService: NgbModal, private factureClientService: FactureClientService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.atrFacture = [
      {field: 'verified', header: 'ST', width: '2%'},
      {field: 'numPiece', header: 'N°Piece', width: '3%'},
      {field: 'numOrigin', header: 'N°Origin', width: '3%'},
      {field: 'date', header: 'Date', width: '5%'},
      {field: 'client.name', header: 'Client', width: '13%'},
      {field: 'client.ice', header: 'ICE', width: '10%'},
      {field: 'totalTTC', header: 'Total TTC', width: '5%', position: 'center'},
      {field: 'totalHT', header: 'Total HT', width: '5%', position: 'center'},
      {field: 'totalTVA', header: 'TVA', width: '5%', position: 'center'},
      {field: 'totalDiscount', header: 'Remise', width: '5%', position: 'center'},
    ];
    this.getAllFacture();
    this.factureClientService.refresh.subscribe(response => {
      this.getAllFacture();
    });
    this.getAllClients();
  }

  getAllFacture() {
    this.factureClientService.getAll(this.clientId)
      .subscribe(facture => {
        this.factureClients = facture;
      });
  }

  getAllClients() {
    this.clientService.getAll()
      .subscribe(client => {
        this.listClients = client;
        this.selectedClient = this.listClients.find((d) => d.id === this.clientId);
      });
  }

  onRowDblClick(event , factureClient1: FactureClientModel){
    this.onClickEditFacture(factureClient1);
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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

  addFacture() {
    const modalRef = this.modalService.open(AddFactureModalComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      windowClass: 'modal-css',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.clientId = this.clientId;
  }

  setFactureToDelete(factureClient1: FactureClientModel) {
    this.factureToDelete = factureClient1;
  }

  onClickEditFacture(factureClient1: FactureClientModel) {
    if (!factureClient1.verified){
      const modalRef = this.modalService.open(AddFactureModalComponent, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'xl',
        windowClass: 'modal-css',
        backdrop: 'static',
        keyboard: false
      });
      modalRef.componentInstance.factureClientId = factureClient1.id;
      modalRef.componentInstance.clientId = this.clientId;
    }
  }

  onClickVerifiedFacture(facture: FactureClientModel) {
    if (!facture.verified) {
      this.factureClientService.verifiedFacture(facture.id).subscribe(
        (success) => {
          this.toastr.success('La facture a été validée avec succès.', '', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'

          });
        },
        (error) => {
          console.log(error);
          this.toastr.error('La facture n\'a pas été validée avec succès.', '', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        });
    } else {
      this.toastr.success('La facture a été validée avec succès.', '', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'

      });
    }
  }

  onClickUnVerifiedFacture(facture: FactureClientModel) {
    if (facture.verified) {
      this.factureClientService.unverifiedFacture(facture.id).subscribe(
      (success) => {
        this.toastr.success('La facture a été dévalidée avec succès.', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'

        });
      },
      (error) => {
        console.log(error);
        this.toastr.error('La facture n\'a pas été dévalidée avec succès.', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      });
    } else {
      this.toastr.success('La facture a été dévalidée avec succès.', '', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'

      });
    }
  }

  onClickDeleteFacture() {
    if (!this.factureToDelete.verified) {
      this.factureClientService.delete(this.factureToDelete.id).subscribe(
        (success) => {
          this.toastr.success('La facture a été supprimé avec succès', '', {
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

  printFacture(facture: FactureClientModel) {
    this.factureClientService.printFacture(facture.id).subscribe((response) => {
      const file = new Blob([response], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
  }

  download(facture: FactureClientModel) {
    this.factureClientService.download(facture);
  }

  onClickPayment(facture: FactureClientModel) {
    if (facture.verified){
      const modalRef = this.modalService.open(ListPaymentComponent, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'xl',
        windowClass: 'modal-css',
        backdrop: 'static',
        keyboard: false
      });
      modalRef.componentInstance.client = facture.client;
      modalRef.componentInstance.facture = facture;
    } else {
      this.toastr.warning('Merci de valider la facture.', '', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
  }
}


