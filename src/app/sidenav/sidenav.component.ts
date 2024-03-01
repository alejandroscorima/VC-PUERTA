import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { CookiesService } from '../cookies.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../users.service';
import { User } from '../user';

@Component({
  selector: 'app-sidenav',
  imports:[],
  standalone: true,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  
})
export class SidenavComponent extends AppComponent {
/* 
  accessPoint_id = 0;
  accessPoint_name = '';

  userOnSes: User = new User('','','','','','','','','','','','','','','','','','','','','',0,0); */

/*   constructor(
    private router: Router,
    private cookies: CookiesService,
    private toastr: ToastrService,
    private usersService: UsersService,
  ){} */

/*   ngOnInit(): void {
    if(check)

    console.log('accesPoint_name en Oninit de Sidenav', this.accessPoint_name);
    console.log(this.accessPoint_name);
  } */

}
