
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import * as pdfjsLib from 'pdfjs-dist';
import { CookiesService } from './cookies.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  sala_name='';

  constructor(private router: Router,
  private cookies: CookiesService,
  ){}

  logout(){
    this.cookies.deleteToken('sala');
    this.cookies.deleteToken('onSession');
    location.reload();
  }

  ngOnInit() {
    if(this.cookies.checkToken('sala')){
      this.sala_name=this.cookies.getToken('sala');
    }
  }
}
