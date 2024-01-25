import { Injectable, HostListener, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { WINDOW } from './windows.service';

// Menu
export interface Menu {
	path?: string;
	title?: string;
	icon?: string;
	type?: string;
	badgeType?: string;
	badgeValue?: string;
	active?: boolean;
	bookmark?: boolean;
	children?: Menu[];
	code?: string;
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	constructor(@Inject(WINDOW) private window) {
		this.onResize();
		if (this.screenWidth < 991) {
			this.collapseSidebar = true;
		}
	}

	public screenWidth: any;
	public collapseSidebar = false;

	MENUITEMS: Menu[] = [
		{
			path: '/dashboard/default', title: 'Dashboard', icon: 'home', type: 'link', badgeType: 'primary', active: false
		},
    {
			title: 'Clients', path: '/client/list-client', code: 'clients', icon: 'users', type: 'link', active: false
		},
    {
      title: 'Facture', path: '/client/list-facture', code: 'factures', icon: 'tablet', type: 'link', active: false
    },
    {
      title: 'Reglement', path: '/client/list-payment', code: 'payments', icon: 'dollar-sign', type: 'link', active: false
    },
    {
      title: 'Produits', path: '/product/list-product' , code: 'product', icon: 'tag', type: 'link', active: false
    },
    {
      title: 'Utilisateurs', path: '/setting/list-account' , code: 'users', icon: 'users', type: 'link', active: false
    },
  ];
	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

	// Windows width
	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}


}
