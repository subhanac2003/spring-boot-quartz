import { NgModule }                 from '@angular/core';
import { Routes, RouterModule }     from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule }            from '@angular/platform-browser';

import { AppComponent }             from './app.component';
import { appRoutes }                from './app.routes'; 
import { SchedulerModule } from './scheduler/scheduler.module';

import 'rxjs/add/operator/map'
@NgModule({

    imports: [ 
		BrowserModule,
	    SchedulerModule,
        RouterModule,
		RouterModule.forRoot(appRoutes, {
			useHash: true
		})
	],
    declarations:[
        AppComponent
    ],


    providers: [
      {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
