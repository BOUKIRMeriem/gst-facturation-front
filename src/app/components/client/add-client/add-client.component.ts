import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Client } from 'src/app/shared/model/client/client.model';
import { ClientService } from 'src/app/shared/service/Client/client.service';
import {NgbModal, NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { RemoveCommaPipe } from 'src/app/shared/helpers/RemoveCommaPipe';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss'],
  providers: [RemoveCommaPipe]
})

export class AddClientComponent implements OnInit, AfterViewInit {

  public clientForm: FormGroup;
  public client = new Client();
  clientId: string;
  isAddMode: boolean;
  soldd: number;
  @ViewChild('tabset') tabset;
  currentTimeInMs: number;
  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private router: Router, private modalService: NgbModal,
              private clientService: ClientService,  private toastr: ToastrService, private activatedRoute: ActivatedRoute) {
    this.currentTimeInMs = new Date().getTime();
    this.isAddMode = true;
    this.activatedRoute.params.subscribe(
      (success) => {
        this.clientId = success.id;
      });
    this.soldd = 0;
  }

  ngOnInit(): void {
    if (this.clientId !== undefined) {
      this.isAddMode = false;
      this.getClient();
    } else {
      this.client.code = this.currentTimeInMs.toString();
      this.createClientForm();
    }
  }

  ngAfterViewInit() {

  }

  onTabChange($event: NgbTabChangeEvent) {

  }
  switchNgBTab(id: string) {
    this.tabset.select(id);
  }

  getClient() {
    this.clientService.findById(this.clientId).subscribe(
      (success) => {
        this.client = success;
        this.soldd = success.solde;
        this.createClientForm();
      },
      (error) => {
        console.log(error);
      }
    );
  }


  createClientForm() {
    this.clientForm = this.fb.group({
      id: this.fb.control({ value: this.client.id, disabled: false }),
      code: this.fb.control({ value: this.client.code, disabled: false }, [Validators.required]),
      name: this.fb.control({ value: this.client.name, disabled: false }, [Validators.required]),
      ice: this.fb.control({ value: this.client.ice, disabled: false }),
      email: this.fb.control({ value: this.client.email, disabled: false }),
      solde: this.fb.control({ value: this.client.solde, disabled: false }),
      phone: this.fb.control({ value: this.client.phone, disabled: false }),
      address: this.fb.control({ value: this.client.address, disabled: false }),
    });
  }

  get ice() {
    return this.clientForm.get('ice');
  }

  get code() {
    return this.clientForm.get('code');
  }

  get name() {
    return this.clientForm.get('name');
  }

  get email() {
    return this.clientForm.get('email');
  }

  get address() {
    return this.clientForm.get('address');
  }

  get id() {
    return this.clientForm.get('id');
  }

  get phone() {
    return this.clientForm.get('phone');
  }

  get solde() {
    return this.clientForm.get('solde');
  }

  clearValues() {
    this.clientForm.reset();
    this.code.setValue(this.client.code);
    this.phone.setValue(this.client.phone);
    this.email.setValue(this.client.email);
    this.name.setValue(this.client.name);
    this.address.setValue(this.client.address);
    this.id.setValue(this.client.id);
    this.solde.setValue(this.client.solde);
  }

  getValues() {
    this.client.code = this.code.value;
    this.client.name = this.name.value;
    this.client.email = this.email.value;
    this.client.phone = this.phone.value;
    this.client.id = this.id.value;
    this.client.address = this.address.value;
    this.client.ice = this.ice.value;
    this.client.solde = this.solde.value;
  }

  async addClient() {
    if (this.clientForm.valid) {
      await this.getValues();
      this.clientService.add(this.client).subscribe(
        (success) => {
          this.toastr.success('Le client a été ajouté avec succès', '', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
          setTimeout(() => {
            const editUrl = ['client/list-client'];
            this.router.navigate(editUrl);
          }, 2000);
        },
        (error) => {
          console.log(error);
          this.toastr.error(error.error.message, '', {
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

  async editClient() {
    if (this.clientForm.valid) {
      await this.getValues();
      this.clientService.edit(this.client, this.clientId).subscribe(
        (success) => {
          this.toastr.success('Le client a été modifié avec succès', '', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
          setTimeout(() => {
            const editUrl = ['client/list-client'];
            this.router.navigate(editUrl);
          }, 2000);
        },
        (error) => {
          console.log(error);
          this.toastr.error('le client n\'est pas modifié avec succès', '', {
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

  annuler() {
    const editUrl = ['client/list-client'];
    this.router.navigate(editUrl);
  }

}
