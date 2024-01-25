import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Client} from '../../../../shared/model/client/Client.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ClientService} from '../../../../shared/service/Client/client.service';
import {ToastrService} from 'ngx-toastr';
import {DatePipe} from '@angular/common';
import {RemoveCommaPipe} from '../../../../shared/helpers/RemoveCommaPipe';
import {DetailFactureClient} from '../../../../shared/model/client/DetailFactureClient.model';
import {FactureClientModel} from '../../../../shared/model/client/FactureClient.model';
import {FactureClientService} from '../../../../shared/service/Client/FactureClient.service';
import {ProductModel} from "../../../../shared/model/product/product.model";
import {ProductService} from "../../../../shared/service/Product.service";
@Component({
  selector: 'app-add-facture-modal',
  templateUrl: './add-facture-modal.component.html',
  styleUrls: ['./add-facture-modal.component.scss'],
  providers: [RemoveCommaPipe, DatePipe]
})
export class AddFactureModalComponent implements OnInit {

  marginCheckBox: number[] = [37];
  types: any[];
  public factureClientForm: FormGroup;
  public factureClient = new FactureClientModel();
  @Input() factureClientId: string;
  @Input() clientId: string;
  isAddMode: boolean;
  detailsFacture: FormArray;
  isDetail: boolean;
  clientStatus = false;
  currentDate: Date = new Date();

  // Dropdown Product
  listProducts: Array<ProductModel> = [];
  selectedProduct: ProductModel;

  // Dropdown Client
  listClients: Array<Client> = [];
  selectedClient: Client;

  nbrPage: number;
  numbers: Array<number> = [];
  title: string;
  constructor( public modal: NgbActiveModal, private fb: FormBuilder, private router: Router, private modalService: NgbModal,
               private factureClientService: FactureClientService, private productService: ProductService,
               private clientService: ClientService, private toastr: ToastrService,
               private activatedRoute: ActivatedRoute, public datepipe: DatePipe, private removeCommaPipe: RemoveCommaPipe) {
    this.isAddMode = true;
  }


  ngOnInit(): void {
    this.types = [
      {name: 'Piece H.T', code: 'HT'},
      {name: 'Piece T.T.C', code: 'PTTC'},
      {name: 'Piece Exonéré', code: 'PEXON'},
    ];
    this.getAllProducts();
    this.getAllClients();
    if (this.factureClientId !== undefined) {
      this.isAddMode = false;
      this.getFactureById();
    } else {
      this.factureClient.date = this.currentDate;
      this.factureClient.type = 'HT';
      this.createFactureClientForm();
    }
    if (this.clientId !== undefined && this.clientId !== null) {
      this.clientStatus = true;
    }
  }

  getAllClients() {
    this.clientService.getAll()
      .subscribe(client => {
        this.listClients = client;
        this.selectedClient = this.listClients.find((d) => d.id === this.clientId);
      });
  }

  getFactureById() {
    this.factureClientService.findById(this.factureClientId).subscribe(
      async (success) => {
        this.factureClient = success;
          this.title = 'Facture N° : ' + success.numPiece + '/' + success.year;
          this.createFactureClientForm();
          this.fillDetailsProduct();
        this.selectedClient = this.listClients.find((d) => d.id === success.client.id);
        this.factureClientForm.get('client').setValue(this.selectedClient);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  fillDetailsProduct() {
    this.factureClient.detailsFacture.forEach(res => {
      console.log(res);
      if (res.description !== null){
        this.addNewValue(true, res);
      }else{
        this.addNewValue(false, res);
      }
    });
  }

  getAllProducts() {
    this.productService.getAll()
      .subscribe(pro => {
        this.listProducts = pro;
      });
  }

  onItemSelect(event, index) {
    if (event.value != null) {
      this.selectedProduct = this.listProducts.find((d) => d.id === event.value.id);
      this.detailsFacture.at(index).get('product').setValue(this.selectedProduct);
      this.detailsFacture.at(index).get('tva').setValue(20);
      this.detailsFacture.at(index).get('price').setValue(this.selectedProduct.sellingPrice);
    }
  }

  onClientSelect(event) {
    this.selectedClient = this.listClients.find((d) => d.id === event.value.id);
    this.factureClientForm.get('client').setValue(this.selectedClient);
  }

  removeValue(index) {
    this.detailsFacture.removeAt(index);
    this.convertData(index, index + 1);
    if (this.detailsFacture.length === 0) {
      this.isDetail = false;
    }
    this.calculateTotal();
  }

  async addNewValue(check?: boolean, res?: DetailFactureClient) {
    this.isDetail = true;
    this.detailsFacture = this.factureClientForm.get('detailsFacture') as FormArray;
    const order = this.detailsFacture.length + 1;
    this.detailsFacture.push(this.formvaleur(order, check, res));
  }

  convertData(i, j) {
    if (this.detailsFacture.length > i) {
      this.detailsFacture.at(i).get('rating').setValue(j);
      this.convertData(i + 1, j + 1);
    }
  }

  calculateMultiply(index) {
    let quantity: number;
    let price: number;
    price = quantity = 0;
    quantity = Number(this.detailsFacture.at(index).get('quantity').value) || 0;
    price = Number(this.detailsFacture.at(index).get('price').value) || 0;
    this.detailsFacture.at(index).get('total').setValue(quantity * price);
    this.calculateTotal();
  }

  calculateTotal() {
    if (this.detailsFacture?.length > 0) {
      let sum: number;
      let totDiscount: number;
      let totalTva: number;
      sum = totDiscount = totalTva = 0;
      const type = this.factureClientForm.get('type').value;
      for (let i = 0; i < this.detailsFacture.length; i++) {
        let total: number;
        total = Number(this.detailsFacture.at(i).get('total').value) || 0;
        sum += total;
        let tva: number;
        tva = Number(this.detailsFacture.at(i).get('tva').value) || 0;
        if (type === 'PEXON') {
          totalTva = 0;
        } else if (type === 'PTTC') {
          totalTva += total / (100 + tva) * tva;
        } else if (type === 'HT') {
          totalTva += total * tva / 100;
        }
      }
      this.totalTVA.setValue(totalTva);
      totDiscount = this.factureClientForm.get('totalDiscount').value || 0;
      if (type === 'PEXON') {
        this.totalHT.setValue(sum - totDiscount);
        this.totalTTC.setValue(((sum - totDiscount) + totalTva));
      } else if (type === 'PTTC') {
        this.totalTTC.setValue(sum - totDiscount);
        this.totalHT.setValue(((sum - totDiscount) - totalTva));
      } else if (type === 'HT') {
        this.totalHT.setValue(sum - totDiscount);
        this.totalTTC.setValue(((sum - totDiscount) + totalTva));
      }
    }
  }

  formvaleur(rating, check, res?: DetailFactureClient): FormGroup {
    return this.fb.group({
      rating: this.fb.control({ value: rating, disabled: false }, [Validators.required]),
      quantity: this.fb.control({ value: res?.quantity, disabled: false }, [Validators.required]),
      price: this.fb.control({ value: res?.price, disabled: false }, [Validators.required]),
      total: this.fb.control({ value: res?.total, disabled: false }, [Validators.required]),
      product: this.fb.control({ value: res?.product, disabled: false }),
      description: this.fb.control({ value: res?.description, disabled: false }),
      tva: this.fb.control({ value: res?.tva, disabled: false }),
      isDescription: new FormControl(check),
    });
  }

  createFactureClientForm() {
    this.factureClientForm = this.fb.group({
      id: this.fb.control({ value: this.factureClient.id, disabled: true }, [Validators.required]),
      numPiece: this.fb.control({ value: this.factureClient.numPiece, disabled: false }, [Validators.required]),
      date: this.fb.control({ value: this.datepipe.transform(this.factureClient.date, 'yyyy-MM-dd'), disabled: false }, [Validators.required]),
      numOrigin: this.fb.control({ value: this.factureClient.numOrigin, disabled: false }),
      client: this.fb.control({ value: this.factureClient.client, disabled: false }),
      totalTTC: this.fb.control({ value: this.factureClient.totalTTC, disabled: false }),
      totalTVA: this.fb.control({ value: this.factureClient.totalTVA, disabled: false }),
      totalHT: this.fb.control({ value: this.factureClient.totalHT, disabled: false }, [Validators.required]),
      totalDiscount: this.fb.control({ value: this.factureClient.totalDiscount, disabled: false }),
      type: this.fb.control({ value: this.factureClient.type, disabled: false }, [Validators.required]),
      detailsFacture: new FormArray([]),
    });
  }

  get numPiece() {
    return this.factureClientForm.get('numPiece');
  }

  get date() {
    return this.factureClientForm.get('date');
  }

  get numOrigin() {
    return this.factureClientForm.get('numOrigin');
  }

  get client() {
    return this.factureClientForm.get('client');
  }

  get totalTTC() {
    return this.factureClientForm.get('totalTTC');
  }

  get id() {
    return this.factureClientForm.get('id');
  }

  get type() {
    return this.factureClientForm.get('type');
  }

  get totalDiscount() {
    return this.factureClientForm.get('totalDiscount');
  }

  get totalTVA() {
    return this.factureClientForm.get('totalTVA');
  }

  get totalHT() {
    return this.factureClientForm.get('totalHT');
  }

  clearValues() {
    this.factureClientForm.reset();
    this.type.setValue('');
    this.date.setValue('');
    this.totalDiscount.setValue(0);
    this.numPiece.setValue(0);
    this.numOrigin.setValue(0);
    this.client.setValue(0);
    this.totalTTC.setValue(0);
    this.totalTVA.setValue(0);
  }

  getValues() {
    this.factureClient.type = this.type.value;
    this.factureClient.totalHT = this.totalHT.value;
    this.factureClient.numPiece = +this.numPiece.value;
    this.factureClient.date = this.date.value;
    this.factureClient.numOrigin = +this.numOrigin.value;
    this.factureClient.client = this.client.value;
    this.factureClient.totalTTC = this.totalTTC.value;
    this.factureClient.id = this.id.value;
    this.factureClient.totalDiscount = this.totalDiscount.value;
    this.factureClient.totalTVA = this.totalTVA.value;
    this.factureClient.detailsFacture = this.detailsFacture?.value;
  }

  async addFacture() {
    this.factureClientService.add(this.factureClient).subscribe(
      (success) => {
        this.toastr.success('Facture a été ajouté avec succès', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
        setTimeout(() => {
          this.close();
        }, 1000);
      },
      (error) => {
        console.log(error);
        this.toastr.error('Facture n\'est pas ajouté avec succès', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      });
  }

  saveFacture(){
    if (this.factureClientForm.valid) {
      this.getValues();
      if (this.isAddMode) {
        this.addFacture();
      } else {
        this.editFacture();
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
  async editFacture() {
    this.factureClientService.edit(this.factureClient, this.factureClientId).subscribe(
      (success) => {
        this.toastr.success('Facture a été modifié avec succès', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
        setTimeout(() => {
          this.close();
        }, 1000);
      },
      (error) => {
        console.log(error);
        this.toastr.error('Facture n\'est pas modifié avec succès', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      });

  }

  addDetail(){
    this.marginCheckBox.push(0);
  }

  close() {
   this.modal.close();
  }
}
