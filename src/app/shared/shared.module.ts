import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FeatherIconsComponent } from './components/feather-icons/feather-icons.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { FocusOnClickDirective } from './directives/FocusOnClick.directive';
import { ToggleFullscreenDirective } from './directives/fullscreen.directive';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NavService } from './service/nav.service';
import { WINDOW_PROVIDERS } from './service/windows.service';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AllowedRefProduitDirective } from './directives/allowed-ref-produit.directive';
import { LessThanDirective } from './directives/less-than.directive';
import { PasswordsEqualDirective } from './directives/passwords-equal.directive';
import { AllowedDateDirective } from './directives/allowed-date.directive';
import {RemoveCommaPipe} from 'src/app/shared/helpers/RemoveCommaPipe';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './interceptor/AuthInterceptor';



@NgModule({
  declarations: [
    ToggleFullscreenDirective,
    FeatherIconsComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ContentLayoutComponent,
    BreadcrumbComponent,
    RightSidebarComponent,
    AllowedRefProduitDirective,
    FocusOnClickDirective,
    LessThanDirective,
    PasswordsEqualDirective,
    AllowedDateDirective,
    RemoveCommaPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    LazyLoadImageModule,
    NgMultiSelectDropDownModule.forRoot(),

  ],
  providers: [NavService, WINDOW_PROVIDERS, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  exports: [RemoveCommaPipe, FeatherIconsComponent, FocusOnClickDirective , ToggleFullscreenDirective, LazyLoadImageModule, TranslateModule,
    AllowedRefProduitDirective, NgMultiSelectDropDownModule, LessThanDirective, PasswordsEqualDirective, AllowedDateDirective]
})
export class SharedModule { }
