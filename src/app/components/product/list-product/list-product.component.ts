import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {RemoveCommaPipe} from 'src/app/shared/helpers/RemoveCommaPipe';
import {AddProductComponent} from '../add-product/add-product.component';
import {ProductModel} from "../../../shared/model/product/product.model";
import {ProductService} from "../../../shared/service/Product.service";
@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
  providers: [ RemoveCommaPipe ]
})
export class ListProductComponent implements OnInit {

  atrProduct: any;
  listProducts: Array<ProductModel> = [];
  public closeResult: string;
  public productToDelete: string;
  constructor(private router: Router, private modalService: NgbModal, private productService: ProductService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllProducts();
    this.productService.refresh.subscribe(response => {
      this.getAllProducts();
    });
    this.atrProduct = [
      { field: 'reference', header: 'Référence', width: '7%' },
      { field: 'name', header: 'Designation', width: '15%' },
      { field: 'sellingPrice', header: 'P.Vente', width: '7%' },
      { field: 'purchasePrice', header: 'P.Achat', width: '7%' },
      { field: 'totalQuantity', header: 'Stock', width: '7%' },
    ];
  }
  getAllProducts() {
    this.productService.getAll()
      .subscribe(product => {
        this.listProducts = product;
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

  addProduct() {
    const modalRef = this.modalService.open(AddProductComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      windowClass: 'modal-css',
      backdrop: 'static',
      keyboard: false
    });
  }

  setProductToDelete(id: string) {
    this.productToDelete = id;
  }

  onClickEditProduct(id: number) {
    const modalRef = this.modalService.open(AddProductComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      windowClass: 'modal-css',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.productId = id;
  }

  onClickDeleteProduct() {
    this.productService.delete(this.productToDelete).subscribe(
      (success) => {
        this.toastr.success('Le produit a été supprimé avec succès', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'

        });
        this.getAllProducts();
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
