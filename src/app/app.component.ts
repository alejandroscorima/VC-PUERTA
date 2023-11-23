
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import * as pdfjsLib from 'pdfjs-dist';
import { CookiesService } from './cookies.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from './users.service';
import { Payment } from './payment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  sala_name='';

  constructor(private router: Router,
  private cookies: CookiesService,
  private toastr: ToastrService,
  private usersService: UsersService,
  ){}

  logout(){
    this.cookies.deleteToken('sala');
    this.cookies.deleteToken('onSession');
    location.reload();
  }

  ngOnInit() {
    this.usersService.getPaymentByClientId(1).subscribe((resPay:Payment)=>{
      console.log(resPay);
      if(resPay.error){
        this.cookies.deleteToken("user_id");
        this.cookies.deleteToken("user_role");
        this.cookies.deleteToken('sala');
        this.cookies.deleteToken('onSession');
        console.error('Error al obtener el pago:', resPay.error);
        this.toastr.error('Error al obtener la licencia: '+resPay.error);
        this.router.navigateByUrl('/');
        console.log('No cumple licencia en APP MODULE');

      }
      else{
        if(this.cookies.checkToken('sala')){
          this.sala_name=this.cookies.getToken('sala');
        }
      }
    },
    (error) => {
    
      this.cookies.deleteToken("user_id");
      this.cookies.deleteToken("user_role");
      console.error('Error al obtener el pago:', error);

      // Maneja el error aquí según tus necesidades
      this.toastr.error('Error al obtener la licencia: '+error);
      this.router.navigateByUrl('/');
    });
  }
}
