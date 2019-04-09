import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AppModule} from "./app.module";

@Component({
    selector: "app",
    template: `
<!--        <header class="cf mb-4">-->
<!--            <nav>-->
<!--                <h1 class="logo">AWS Scheduler</h1>-->
<!--            </nav>-->
<!--        </header>-->
        <router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    constructor(private _route: ActivatedRoute) {
    }

    ngOnInit() {
    }
}

