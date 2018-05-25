import { AuthService } from './shared/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private authService: AuthService
  ) {
    this.matIconRegistry.addSvgIconInNamespace(
      'assets',
      'refulogo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/logorefu.svg')
    );
    this.matIconRegistry.addSvgIconInNamespace(
      'assets',
      'refulogoblue',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/logo_refu_bleu.svg')
    );
    this.matIconRegistry.addSvgIconInNamespace(
      'assets',
      'refulogowhite',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/logo-refu_white.svg')
    );
  }
  ngOnInit(): void {
  }
}
