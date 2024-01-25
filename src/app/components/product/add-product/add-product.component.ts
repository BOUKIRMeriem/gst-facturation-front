import {Component, Input, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { RemoveCommaPipe } from 'src/app/shared/helpers/RemoveCommaPipe';
import {ProductModel} from "../../../shared/model/product/product.model";
import {ProductService} from "../../../shared/service/Product.service";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  providers: [RemoveCommaPipe]
})
export class AddProductComponent implements OnInit {
  listTva: any[];

  public productForm: FormGroup;
  public product = new ProductModel();
  @Input() productId: string;
  isAddMode: boolean;
  currentTimeInMs: number;

  constructor(public modal: NgbActiveModal, private fb: FormBuilder, private router: Router, private modalService: NgbModal, private productService: ProductService, private toastr: ToastrService, private activatedRoute: ActivatedRoute) {
    this.isAddMode = true;
    this.currentTimeInMs = new Date().getTime();
  }

  async ngOnInit(): Promise<void> {
    this.listTva = [
      {name: '20%', code: 20},
      {name: '14%', code: 14},
      {name: '10%', code: 10},
    ];
    if (this.productId !== undefined) {
      this.isAddMode = false;
      this.getProductById();
    } else {
      this.createProductForm();
    }
  }

  // get product by id
  getProductById() {
    this.productService.findById(this.productId).subscribe(
      (success) => {
        this.product = success;
        this.createProductForm();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // create product form
  createProductForm() {
    this.productForm = this.fb.group({
      reference: this.fb.control({ value: this.product.reference, disabled: false }, [Validators.required]),
      name: this.fb.control({ value: this.product.name, disabled: false }, [Validators.required]),
      purchasePrice: this.fb.control({ value: this.product.purchasePrice, disabled: false }),
      sellingPrice: this.fb.control({ value: this.product.sellingPrice, disabled: false }),
      departureQuantity: this.fb.control({ value: this.product.departureQuantity, disabled: false }),
      totalQuantity: this.fb.control({ value: this.product.totalQuantity, disabled: false }),

    });
  }
  get totalQuantity() {
    return this.productForm.get('totalQuantity');
  }

  get name() {
    return this.productForm.get('name');
  }

  get departureQuantity() {
    return this.productForm.get('departureQuantity');
  }

  get sellingPrice() {
    return this.productForm.get('sellingPrice');
  }

  get reference() {
    return this.productForm.get('reference');
  }

  get purchasePrice() {
    return this.productForm.get('purchasePrice');
  }
  // clear value
  clearValues() {
    this.productForm.reset();
    this.sellingPrice.setValue(this.product.sellingPrice);
    this.purchasePrice.setValue(this.product.purchasePrice);
    this.name.setValue(this.product.name);
    this.departureQuantity.setValue(this.product.departureQuantity);
    this.reference.setValue(this.product.reference);
    this.totalQuantity.setValue(this.product.totalQuantity);
  }

  getValues() {
    this.product.name = this.name.value;
    this.product.sellingPrice = this.sellingPrice.value;
    this.product.reference = this.reference.value;
    this.product.purchasePrice = this.purchasePrice.value;
    this.product.departureQuantity = this.departureQuantity.value;
    this.product.totalQuantity = this.totalQuantity.value;
  }
  save(){
    if (this.isAddMode){
      this.add();
    } else {
      this.edit();
    }
  }

  async add() {
    if (this.productForm.valid) {
      await this.getValues();
      this.productService.add(this.product).subscribe(
        (success) => {
          this.toastr.success('Le product a été ajouté avec succès', '', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
          this.modal.close();
        },
        (error) => {
          console.log(error);
          this.toastr.error('Le product n\'est pas ajouté avec succès', '', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        });
    } else {
      this.toastr.error('Merci de remplir tous les champs du formulaire nécessaire', '', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }

  }

  async edit() {
    if (this.productForm.valid) {
      await this.getValues();
      this.productService.edit(this.product, this.productId).subscribe(
        (success) => {
          this.toastr.success('Le product a été modifié avec succès', '', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
          this.modal.close();
        },
        (error) => {
          console.log(error);
          this.toastr.error('Le product n\'est pas modifié avec succès', '', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        });
    } else {
      this.toastr.error('Merci de remplir tous les champs du formulaire nécessaire', '', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }

  }
}
