import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

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

