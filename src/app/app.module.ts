import { BrowserModule, } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { DocumentViewer,DocumentViewerOptions } from '@ionic-native/document-viewer';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SubCategoryPage } from '../pages/sub-category/sub-category';
import { SliderPage } from '../pages/slider/slider';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataProvider } from '../providers/data/data';
import { WindowRef } from '../providers/WindowRef';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EmailComposer } from '@ionic-native/email-composer';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SubCategoryPage,
    SliderPage,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SliderPage,
    SubCategoryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DocumentViewer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    File,
    WindowRef,
    SocialSharing,
    EmailComposer
  ]
})
export class AppModule {}
