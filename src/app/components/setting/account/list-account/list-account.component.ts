import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {AccountModel} from '../../../../shared/model/account.model';
import {AccountService} from '../../../../shared/service/account.service';
import {AddAccountComponent} from '../add-account/add-account.component';

@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  styleUrls: ['./list-account.component.scss']
})
export class ListAccountComponent implements OnInit {

  atrAccount: any;
  listAccounts: Array<AccountModel> = [];
  public closeResult: string;
  public accountToDelete: string;
  @ViewChild('AddModal') AddModal: any;

  accountId: string;
  isAddMode: boolean;


  constructor(private fb: FormBuilder, private router: Router,
              private modalService: NgbModal, private accountService: AccountService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.getAllAccounts();
    this.atrAccount = [
      { field: 'user.firstName', header: 'Prenom', width: '10rem' },
      { field: 'user.lastName', header: 'Nom', width: '10rem' },
      { field: 'user.userName', header: 'Nom d\'utilisateur', width: '10rem' },
      { field: 'email', header: 'email', width: '10rem' },
      { field: 'user.phoneNumber', header: 'Telephone', width: '7rem' },
    ];
    this.accountService.refresh.subscribe(response => {
      this.getAllAccounts();
    });
  }


  getAllAccounts() {
    this.accountService.getAll()
      .subscribe(site => {
        this.listAccounts = site;
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

  setToDelete(id: string) {
    this.accountToDelete = id;
  }

  onClickEdit(dt: AccountModel) {
    const modalRef = this.modalService.open(AddAccountComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      windowClass: 'modal-css',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.accountId = dt.id;
  }

  onClickAdd() {
    const modalRef = this.modalService.open(AddAccountComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      windowClass: 'modal-css',
      backdrop: 'static',
      keyboard: false
    });
  }


  onClickDelete() {
    this.accountService.delete(this.accountToDelete).subscribe(
      (success) => {
        this.toastr.success('Compte a été supprimé avec succès', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'

        });
        this.getAllAccounts();
      },
      (error) => {
        console.log(error);
        this.toastr.error('Erreur de suppression de compte', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    );
  }
}
