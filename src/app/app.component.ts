import { Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthService } from './shared/services/auth.service';
import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core/media';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TdLayoutNavListComponent, TdLayoutManageListComponent } from '@covalent/core/layout';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnDestroy, OnInit {
navmenu: Object[] = [{
    icon: 'group',
    route: 'persons',
    title: 'Vrijwilligers',
    description: 'Item description',
  }, {
    icon: 'business',
    route: 'organizations',
    title: 'Organisaties',
    description: 'Item description',
  }, {
    icon: 'build',
    route: 'jobs',
    title: 'Jobs',
    description: 'Item description',
  }, {
    icon: 'event',
    route: 'events',
    title: 'Events',
    description: 'Item description',
  }, {
    icon: 'looks_5',
    route: 'opvolging',
    title: 'Opvolging',
    description: 'Item description',
  },{
    icon: 'insert_chart',
    route: 'rapportage',
    title: 'Rapporten',
    description: 'Item description',
  },
];

logout(): void {
  this.authService.logout();
}
login(): void {
  const dialogRef = this.dialog.open(LoginComponent, {
    width: '250px',
    data: {  }
  });
}

constructor(
  public media: TdMediaService,
  private matIconRegistry: MatIconRegistry,
  private domSanitizer: DomSanitizer,
  public authService: AuthService,
  public dialog: MatDialog,
  private router: Router
) {
    this.matIconRegistry.addSvgIconInNamespace(
      'assets',
      'refulogo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/logorefu.svg')
    );
    this.matIconRegistry.addSvgIconInNamespace(
      'assets',
      'refulogoblue',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/logo_refu_bleu.svg')
    );
    this.matIconRegistry.addSvgIconInNamespace(
      'assets',
      'refulogowhite',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/logo-refu_white.svg')
    );
  }
ngOnDestroy(): void {
  // this.media.deregisterQuery('gt-sm');
}
ngOnInit():void{
  if (!this.authService.isAuthenticated()){
    setTimeout(() => this.login());
  }
  else {
    this.router.navigate(['persons']);
  }
}
}
