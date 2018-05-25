import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatSidenav } from '@angular/material/sidenav';
import { TdMediaService } from '@covalent/core/media';
import { Subject } from 'rxjs/Subject';
import { Injectable, OnInit, OnDestroy } from '@angular/core';

@Injectable()
export class SideNavService implements OnInit, OnDestroy {
    private _leftNavOpened = true;
    private _rightNavOpened = false;
    private _rightNavContent = '';
    private _rightNavWidth = 300;
    private _leftNavWidth = 250;
    private _leftNavLastUserState = true;
    private _gridView = true;
    private _tableHeight = 400;
    private _tabHeight = 400;
    private _onlySelectedPersons = false;

    rightNavOpened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    rightNavWidth: BehaviorSubject<number> = new BehaviorSubject<number>(400);
    onlySelectedPersons: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    leftNavOpened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    gridView: BehaviorSubject<boolean> = new BehaviorSubject(true);
    gridCols: BehaviorSubject<number> = new BehaviorSubject(3);
    tableHeight: BehaviorSubject<number> = new BehaviorSubject(500);
    tabHeight: BehaviorSubject<number> = new BehaviorSubject(500);


    constructor(private mediaService: TdMediaService) {}

    windowResize(): void {
        const contentWidth = document.getElementById('sidenavcontent').clientWidth;
        const totalwidth = window.innerWidth;
        let leftNavChanged = false;
        if (totalwidth < 800) {
            leftNavChanged = (this._leftNavOpened) ? true : false;
            this._leftNavOpened = false;
            this.leftNavOpened.next(this._leftNavOpened);
        }
        if (totalwidth > 1050 && (this._leftNavLastUserState)) {
            leftNavChanged = (this._leftNavOpened) ? true : false;
            this._leftNavOpened = true;
            this.leftNavOpened.next(this._leftNavOpened);
        }
        if (!leftNavChanged) {
            if (this._rightNavOpened) { this.checkRightNavWidth(); }
        }
        if (this._gridView) { this.checkGridCols(); }
        this.setTableHeight();
        this.setTabHeight();

    }

    setTableHeight(): void{
        const tHeight = document.getElementById('sidenavcontent').clientHeight;
        this._tableHeight = tHeight - 90;
        this.tableHeight.next(this._tableHeight);
    }
    
    setTabHeight(): void{
        const sep = document.getElementById('tabLastSeparator')

        // const topContent = document.getElementById('tabLastSeparator').previousElementSibling.clientHeight;
        // console.log(sep.clientTop);
        // console.log(sep.offsetTop);
        this._tabHeight = this._tableHeight+90;
        if (sep){
            const tHeight = (this._rightNavContent === 'person-card') ? sep.previousElementSibling.clientHeight + 112 : sep.offsetTop + 94;
            this._tabHeight = this._tableHeight - tHeight;
        }
        this.tabHeight.next(this._tabHeight);
        // const tHeight = 
    }

    checkGridCols(): void {
        const totalwidth = document.getElementById('sidenavcontent').clientWidth;
        let availableWidth = totalwidth;
        if (this._rightNavOpened) {
            availableWidth = totalwidth - this._rightNavWidth;
        }
        if (availableWidth > 1200) {this.gridCols.next(3); return; }
        if (availableWidth < 1200 && availableWidth > 700) {this.gridCols.next(2); return; }
        if (availableWidth < 700 ) {this.gridCols.next(1); return; }
    }

    checkRightNavWidth(): void {
        const contentWidth = document.getElementById('sidenavcontent').clientWidth;
        const totalwidth = window.innerWidth;
        // const extraCardWidth = this._rightNavContent === 'personcard' ? 300 : 0;
        const extraCardWidth = 300;
        if (contentWidth > 1200) { this._rightNavWidth = 550; }
        if (contentWidth > 1000) { this._rightNavWidth = 450; }
        if (contentWidth < 1000 && contentWidth > 600 ) { this._rightNavWidth = 300; }
        if (contentWidth < 600 ) { this._rightNavWidth = 200; }
        this._rightNavWidth += extraCardWidth;
        this.rightNavWidth.next(this._rightNavWidth);
    }
    navChange(sideNav: MatSidenav): void {
        // console.log('sideNav changed');
        if (this._rightNavOpened) { this.checkRightNavWidth(); }
        if (this._gridView) { this.checkGridCols(); }
    }

    toggleLeftNav(): void {
        this._leftNavOpened = !this._leftNavOpened;
        this._leftNavLastUserState = this._leftNavOpened;
        this.leftNavOpened.next(this._leftNavOpened);
    }

    closeRightNav(elem): void{
        // console.log(elem);
    }

    toggleRightNav(content: string): void {
        const contentWidth = document.getElementById('sidenavcontent').clientWidth;
        if (content !== this._rightNavContent && content !== 'close'){
            this._rightNavOpened = !this._rightNavOpened;
            this.rightNavOpened.next(this._rightNavOpened);
        }
        this._rightNavContent = content;
        this.checkRightNavWidth();
        switch (content) {
            case 'close': {
                this._rightNavOpened = false;
                break;
            }
            default: {
                this._rightNavOpened = true;
                break;
            }
            // case 'contact': {
            //     this._rightNavOpened = true;
            //     break;
            // }
        }

        this.rightNavOpened.next(this._rightNavOpened);
        if (this._gridView) { this.checkGridCols(); }
    }

    toggleGridView(): void {
        this._gridView = !this._gridView;
        this.checkGridCols();
        this.gridView.next(this._gridView);
    }

    ngOnDestroy(): void {
        throw new Error("Method not implemented.");
    }
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
}
