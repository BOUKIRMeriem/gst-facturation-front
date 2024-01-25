import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {AccountService} from '../../../../shared/service/account.service';
import {AccountModel} from '../../../../shared/model/account.model';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {
  public accountForm: FormGroup;
  public accountModel = new AccountModel();
  @Input() accountId: string;
  isAddMode: boolean;

  constructor(private fb: FormBuilder, private router: Router, public modal: NgbActiveModal,
              private modalService: NgbModal, private accountService: AccountService, private toastr: ToastrService) {
    this.isAddMode = true;
  }

  ngOnInit(): void {
    if (this.accountId !== undefined) {
      this.getById();
      this.isAddMode = false;
    }else{
      this.createAccountForm();
    }
  }

  getById(){
    this.accountService.findById(this.accountId).subscribe((res) => {
      this.accountModel = res;
      this.createAccountForm();
    });
  }

  // create account form
  createAccountForm() {
    this.accountForm = this.fb.group({
      id: this.fb.control({ value: this.accountModel.id, disabled: false }),
      password: this.fb.control({ value: this.accountModel.password, disabled: false }),
      email: this.fb.control({ value: this.accountModel.email, disabled: false }),
      user: this.fb.group({
        firstName: this.fb.control({ value: this.accountModel.user?.firstName, disabled: false }),
        lastName: this.fb.control({ value: this.accountModel.user?.lastName, disabled: false }),
        userName: this.fb.control({ value: this.accountModel.user?.userName, disabled: false }),
        phoneNumber: this.fb.control({ value: this.accountModel.user?.phoneNumber, disabled: false }),
        gender: this.fb.control({ value: this.accountModel.user?.gender, disabled: false }),

      })
    });
  }

  get sites() {
    return this.accountForm.get('sites');
  }

  get id() {
    return this.accountForm.get('id');
  }

  get password() {
    return this.accountForm.get('password');
  }

  get email() {
    return this.accountForm.get('email');
  }

  get user() {
    return this.accountForm.get('user');
  }

  clearValues() {
    this.accountForm.reset();
    this.id.setValue('');
    this.password.setValue('');
    this.email.setValue('');
    this.accountModel = new AccountModel();
  }

  getValues() {
    const userFormGroup = this.accountForm.get('user') as FormGroup;
    this.accountModel.enabled = true;
    this.accountModel.verified = true;
    this.accountModel.locked = false;
    this.accountModel.password = this.password.value;
    this.accountModel.id = this.id.value;
    this.accountModel.email = this.email.value;
    this.accountModel.user.firstName = userFormGroup.get('firstName').value;
    this.accountModel.user.lastName = userFormGroup.get('lastName').value;
    this.accountModel.user.userName = userFormGroup.get('userName').value;
    this.accountModel.user.phoneNumber = userFormGroup.get('phoneNumber').value;
    this.accountModel.user.gender = userFormGroup.get('gender').value;
  }

  add(){
    this.accountService.register(this.accountModel).subscribe(
      (success) => {
        this.toastr.success('Compte a été ajouté avec succès', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
        this.modal.close();
      },
      (error) => {
        console.log(error);
        this.toastr.error('Compte n\'est pas ajouté avec succès', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      });
  }

  edit(){
    this.accountService.edit(this.accountId, this.accountModel).subscribe(
      (success) => {
        this.toastr.success('Compte a été modifié avec succès', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
        this.modal.close();
      },
      (error) => {
        console.log(error);
        this.toastr.error('Compte n\'est pas modifié avec succès', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      });
  }
  save(){
    if (this.accountForm.valid) {
      this.getValues();
      if (this.isAddMode) {
        this.add();
      } else {
        this.edit();
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

  onSelect(event){
    console.log('sites : ', event);
  }
}
