import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDismissReasons, NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {PaymentClient} from '../../../../shared/model/client/PaymentClient.model';
import {PaymentClientService} from '../../../../shared/service/Client/PaymentClient.service';
import {RemoveCommaPipe} from '../../../../shared/helpers/RemoveCommaPipe';
import {DatePipe} from '@angular/common';
import {Client} from '../../../../shared/model/client/Client.model';
import {listTypes} from '../../../../shared/helpers/data.helper';
import {FactureClientModel} from "../../../../shared/model/client/FactureClient.model";

@Component({
  selector: 'app-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: ['./list-payment.component.scss'],
  providers: [RemoveCommaPipe, DatePipe]
})
export class ListPaymentComponent implements OnInit {

  types: any[];
  public paymentForm: FormGroup;
  atrPayment: any;
  @Input() client: Client;
  @Input() facture: FactureClientModel;
  listPayment: Array<PaymentClient> = [];
  public closeResult: string;
  public title: string;
  @ViewChild('AddModal') AddModal: any;

  public paymentClient = new PaymentClient();
  paymentId: string;
  isAddMode: boolean;
  isCheque: boolean;
  currentDate: Date = new Date();
  constructor(private fb: FormBuilder, private router: Router, public modal: NgbActiveModal,
              private modalService: NgbModal, public datepipe: DatePipe, private paymentClientService: PaymentClientService, private toastr: ToastrService) {
    this.isCheque = false;
    this.isAddMode = true;
  }

  ngOnInit(): void {
    this.types = listTypes;
    this.paymentClient.date = this.currentDate;
    this.getAllPayments();
    this.createPaymentForm();
    this.atrPayment = [
      { field: 'verified', header: 'ST', width: '1rem' },
      { field: 'date', header: 'Date', width: '8rem' },
      { field: 'designation', header: 'Description', width: '15rem' },
      { field: 'type', header: 'Type', width: '7rem' },
      { field: 'amount', header: 'Montant', width: '7rem' },
    ];
    this.paymentClientService.refresh.subscribe(response => {
      this.getAllPayments();
    });
    this.title = 'Fatcture N° : ' + this.facture.numPiece + '/' + this.facture.year;
  }

  getTypeName(code: string): string {
    const type = this.types.find(item => item.code === code);
    return type ? type.name : 'Unknown';
  }

  onTypeSelect(event){
    if (event.value === 'cheque' || event.value === 'effet'){
      this.isCheque = true;
    }else{
      this.isCheque = false;
    }
  }

  getAllPayments() {
    this.paymentClientService.getAllPaymentClientsByFacture(this.facture.id)
      .subscribe(pay => {
        this.listPayment = pay;
      });
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

  onClickEditPayment(dt: PaymentClient) {
    this.paymentClient = dt;
    this.paymentId = dt.id;
    this.isAddMode = false;
    if (this.paymentClient.type === 'cheque' || this.paymentClient.type === 'effet'){
      this.isCheque = true;
    }else{
      this.isCheque = false;
    }
    this.createPaymentForm();
  }


  onClickDeletePayment(paymentId: string) {
    this.paymentClientService.deletePaymentClientById(paymentId).subscribe(
      (success) => {
        this.toastr.success('Reglement a été supprimé avec succès', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'

        });
        this.getAllPayments();
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

  // create payment form
  createPaymentForm() {
    this.paymentForm = this.fb.group({
      id: this.fb.control({value: this.paymentClient.id, disabled: false}),
      date: this.fb.control({value: this.datepipe.transform(this.paymentClient.date, 'yyyy-MM-dd'), disabled: false}, [Validators.required]),
      designation: this.fb.control({value: this.paymentClient.designation, disabled: false}, [Validators.required]),
      amount: this.fb.control({value: this.paymentClient.amount, disabled: false}, [Validators.required]),
      type: this.fb.control({value: this.paymentClient.type, disabled: false}, [Validators.required]),
      deadline: this.fb.control({value: this.datepipe.transform(this.paymentClient.deadline, 'yyyy-MM-dd'), disabled: false}),
      tier: this.fb.control({value: this.paymentClient.tier, disabled: false}),
      bank: this.fb.control({value: this.paymentClient.bank, disabled: false})
    });
  }

  get factureAmount() {
    return this.paymentForm.get('factureAmount');
  }

  get bank() {
    return this.paymentForm.get('bank');
  }

  get tier() {
    return this.paymentForm.get('tier');
  }

  get deadline() {
    return this.paymentForm.get('deadline');
  }

  get date() {
    return this.paymentForm.get('date');
  }

  get designation() {
    return this.paymentForm.get('designation');
  }

  get amount() {
    return this.paymentForm.get('amount');
  }

  get type() {
    return this.paymentForm.get('type');
  }

  get id() {
    return this.paymentForm.get('id');
  }

  clearValues() {
    this.paymentForm.reset();
    this.id.setValue('');
    this.amount.setValue('');
    this.designation.setValue('');
    this.date.setValue(this.currentDate);
    this.bank.setValue('');
    this.tier.setValue('');
    this.deadline.setValue('');
  }

  getValues() {
    this.paymentClient.amount = this.amount.value;
    this.paymentClient.id = this.id.value;
    this.paymentClient.designation = this.designation.value;
    this.paymentClient.type = this.type.value;
    this.paymentClient.date = this.date.value;
    this.paymentClient.deadline = this.deadline.value;
    this.paymentClient.tier = this.tier.value;
    this.paymentClient.bank = this.bank.value;
    this.paymentClient.factureClient = this.facture;
    this.paymentClient.client = this.client;
  }

  addPayment(){
    if (this.facture.totalTTC >= this.amount.value ) {
      this.paymentClientService.addPaymentClient(this.paymentClient).subscribe(
        (success) => {
          this.toastr.success('Reglement a été ajouté avec succès', '', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
          this.clearValues();
          this.getAllPayments();
        },
        (error) => {
          console.log(error);
          this.toastr.error('Reglement n\'est pas ajouté avec succès', '', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        });
    } else {
      this.toastr.warning('Le montant payé a dépassé le montant de la facture..', '', {
        timeOut: 4000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
  }

  editPayment(){
    this.paymentClientService.editPaymentClient(this.paymentClient, this.paymentId).subscribe(
      (success) => {
        this.toastr.success('Reglement a été modifié avec succès', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
        this.clearValues();
        this.getAllPayments();
      },
      (error) => {
        console.log(error);
        this.toastr.error('Reglement n\'est pas modifié avec succès', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      });
  }

  savePayment(){
    if (this.paymentForm.valid) {
      this.getValues();
      if (this.isAddMode) {
        this.addPayment();
      } else {
        this.editPayment();
      }
    }else {
      this.toastr.error('Merci de remplir tous les champs du formulaire nécessaire', '', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
  }

  onClickVerifiedPayment(payment: PaymentClient) {
    if (!payment.verified) {
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
      });
    } else {
      this.toastr.success('Reglement a été validée avec succès.', '', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
  }

  onClickUnVerifiedPayment(payment: PaymentClient) {
    if (payment.verified) {
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
      });
    } else {
      this.toastr.success('Reglement a été dévalidée avec succès.', '', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
  }
}
