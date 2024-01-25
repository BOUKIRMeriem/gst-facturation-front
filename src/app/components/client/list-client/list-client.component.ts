import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Client } from 'src/app/shared/model/client/client.model';
import { ClientService } from 'src/app/shared/service/Client/client.service';
import { RemoveCommaPipe } from 'src/app/shared/helpers/RemoveCommaPipe';
import {Table} from 'primeng/table';
@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.scss'],
  providers: [RemoveCommaPipe]
})
export class ListClientComponent implements OnInit , AfterViewInit{
  atrClient: any;
  listClients: Array<Client> = [];
  public closeResult: string;
  public clientToDelete: string;
  clientIdSelected: string;
  selectedClient = new Client();
  @ViewChild('dt2', { static: false }) private dataTable: Table;

  constructor( private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal, private clientService: ClientService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getAllClients();
    this.atrClient = [
      { field: 'code', header: 'Compte', width: '2rem' },
      { field: 'name', header: 'Nom', width: '18rem' },
      { field: 'email', header: 'Email', width: '15rem' },
      { field: 'phone', header: 'Telephone', width: '7rem' },
      { field: 'solde', header: 'Solde', width: '10rem' },
    ];
  }

  ngAfterViewInit() {
  }

  onRowSelect(event){
  }

  onRowDblClick(event , client: Client){
    this.onClickEditClient(client.id);
  }
  getAllClients() {
    this.clientService.getAll()
      .subscribe(client => {
        this.listClients = client;
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

  addClient() {
    const addUrl = ['client/add-client'];
    this.router.navigate(addUrl);
  }

  setClientToDelete(id: string) {
    this.clientToDelete = id;
  }

  onClickEditClient(id: string) {
    const editUrl = ['client/edit-client', id];
    this.router.navigate(editUrl);
  }

  onClickViewClient(id: string) {
  }

  onClickDeleteclient() {
    this.clientService.delete(this.clientToDelete).subscribe(
      (success) => {
        this.toastr.success('Le client a été supprimé avec succès', '', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'

        });
        this.getAllClients();
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

  paginate(value) {
  }

}
