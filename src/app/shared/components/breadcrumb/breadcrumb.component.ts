import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';

import { filter } from 'rxjs/operators';
import { map } from 'rxjs/internal/operators';
import { ClientService } from '../../service/Client/client.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  public breadcrumbs;
  public title: string;
  idUser: number;
  page: string;
  url: string;
  isModClient = false;
  nameUser: string;

  constructor(private clientService: ClientService, private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }))
      .pipe(filter(route => route.outlet === PRIMARY_OUTLET))
      .subscribe(route => {
        this.getUrl();
        const snapshot = this.router.routerState.snapshot;
        const title = route.snapshot.data.title;
        const parent = route.parent.snapshot.data.breadcrumb;
        const child = route.snapshot.data.breadcrumb;
        this.breadcrumbs = {};
        this.title = title;
        this.breadcrumbs = {
          parentBreadcrumb: parent,
          childBreadcrumb: child
        };
      });
  }

  getUrl(){
    this.url = this.router.url;
    const array = this.url.split('/');
    this.idUser = +array[4];
    this.page = array[2];
  }

  ngOnInit() {

  }
}
