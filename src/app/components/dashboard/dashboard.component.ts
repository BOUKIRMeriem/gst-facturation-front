import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';

import { RemoveCommaPipe } from 'src/app/shared/helpers/RemoveCommaPipe';
import { DecimalPipe } from '@angular/common';
import { ClientService } from 'src/app/shared/service/Client/client.service';
import { FactureClientService } from 'src/app/shared/service/Client/FactureClient.service';
import { ProductService } from 'src/app/shared/service/Product.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [RemoveCommaPipe, DecimalPipe]
})
export class DashboardComponent implements OnInit {

  totalClient: number;
  totalProduit: number;
  totalFactureClient: number;
  totalTTC: number;


  constructor( private clientService: ClientService, private factureClientService :FactureClientService, private produitService: ProductService) {

  }

  ngOnInit() {
    this.getTotalClient();
    this.getTotalProduit();
    this.getTotalFactureClient();
    this.getTotalTTC();
  }
  getTotalClient() {
    this.clientService.getCount().subscribe(
      (data: any) => {
        this.totalClient = data;
      });
  }
  getTotalProduit() {
    this.produitService.getCount().subscribe(
      (data: any) => {
        this.totalProduit = data;
      } );
  }
  getTotalFactureClient() {
    this.factureClientService.getCount().subscribe(
      (data: any) => {
        this.totalFactureClient = data;
      } );
  }
  getTotalTTC(){
    this.factureClientService.getTotalTTC().subscribe(
      (data: any) => {
        this.totalTTC = data;
      } );

  }
}
