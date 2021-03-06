import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GeolocationService } from './services/geolocation.service';
import { AppState } from './models/app.state';
import * as Actions from './actions/state.actions';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/app/home',
      icon: 'home'
    },
    {
      title: 'Locations',
      url: '/app/fences',
      icon: 'locate'
    },
/*     {
      title: 'Source',
      url: 'https://github.com/blackshark537/geofence',
      icon: 'code'
    }, */
  ];

  theme: boolean = false;
  update: boolean = false;

  constructor(
    private store: Store<AppState>,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private geo: GeolocationService,
    private swUpdates: SwUpdate
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {

    this.swUpdates.available.subscribe(evt =>{
      this.swUpdates.activateUpdate().then(()=> document.location.reload());
    });

    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }

    this.geo.watchPosition();
    //save state bofore exit
    addEventListener('beforeunload', ev =>{
      ev.preventDefault();
      this.store.dispatch(Actions.onExit());
    });
  }

  action(index){
    switch(index){
      case 0:
        this.restoreAll();
        break;
      case 1:
        this.removeAll();
        break;
      case 2:
        this.removeAll();
        break;
      case 3:
        window.open('https://github.com/blackshark537/geofence').focus();
        break;
      default:
        break;
    }
  }

  removeAll(){
    //this.store.deleteAll();
    console.log('removeAll');
  }

  restoreAll(){
    //this.store.restore();
    console.log('addAll');
  }

  toggleTheme() {
    this.theme = !this.theme;
    document.body.classList.toggle('dark');
  }
  
}
