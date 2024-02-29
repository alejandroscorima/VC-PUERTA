
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import * as pdfjsLib from 'pdfjs-dist';
import { CookiesService } from './cookies.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from './users.service';
import { Payment } from './payment';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  accessPoint_name='HOLA';
  accessPoint_id = 0;

  userOnSes: User = new User('','','','','','','','','','','','','','','','','','','','','',0,0);

  constructor(private router: Router,
  private cookies: CookiesService,
  private toastr: ToastrService,
  private usersService: UsersService,
  ){}

  logout(){
    this.cookies.deleteToken('accessPoint_id');
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
        if(this.cookies.checkToken('accessPoint_id')){
          this.accessPoint_id=parseInt(this.cookies.getToken('accessPoint_id'));
          console.log(this.accessPoint_id);
          console.log('asignando valor al name de access point')
          this.accessPoint_name='Pruebaaaaa';
          console.log(this.accessPoint_name);
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
