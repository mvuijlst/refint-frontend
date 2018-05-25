import { TdLoadingService } from '@covalent/core/loading';
import { PersonService } from './../shared/services/person.service';
import { SideNavService } from './../shared/services/sidenav.service';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginComponent } from './../login/login.component';
import { AuthService } from './../shared/services/auth.service';
import { Component, ViewChild, OnDestroy, OnInit, HostListener } from '@angular/core';
import { TdMediaService } from '@covalent/core/media';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TdLayoutNavListComponent, TdLayoutManageListComponent } from '@covalent/core/layout';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnDestroy, OnInit {

  sideNavOpened = true;
  gridview = false;
  sideNavServiceSubscription: Subscription = Subscription.EMPTY;
  personSubscription: Subscription = Subscription.EMPTY;
  navmenu: any[] = [{
    icon: 'group',
    route: '/persons/',
    title: 'Vrijwilligers',
    description: 'Item description',
  }, {
    icon: 'business',
    route: 'organizations',
    title: 'Organisaties',
    description: 'Item description',
  }, {
    icon: 'build',
    route: '/jobs/',
    title: 'Jobs',
    description: 'Item description',
  }, {
    icon: 'event',
    route: 'events',
    title: 'Events',
    description: 'Item description',
  }, {
    icon: 'looks_5',
    route: '/succession/',
    title: 'Opvolging',
    description: 'Item description',
  }, {
    icon: 'insert_chart',
    route: 'rapportage',
    title: 'Rapporten',
    description: 'Item description',
  },
  ];
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.sideNavService.windowResize();
    // console.log(event.target.innerWidth);
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
  }
  login(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '250px',
      data: {}
    });
  }

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public sideNavService: SideNavService,
    private personService: PersonService,
    private _loadingService: TdLoadingService,
  ) {}

  ngOnDestroy(): void {
    this.sideNavServiceSubscription.unsubscribe();
    this.personSubscription.unsubscribe();
  }

  toggleDefaultFullscreenDemo(): void {
    this._loadingService.register();
    setTimeout(() => {
      this._loadingService.resolve();
    }, 1500);
  }


  ngOnInit(): void {
    this._loadingService.register();
    this.sideNavServiceSubscription = this.sideNavService.leftNavOpened.subscribe(opened => this.sideNavOpened = opened);
    
    


    if (!this.authService.isAuthenticated()) {
      this._loadingService.resolve();
      this.router.navigate(['login']);
    } else {
      this.personSubscription = this.personService.personsLoaded.subscribe(loaded=>{
        if (loaded){
          this._loadingService.resolve();
        }
      })

    }
  }
}
