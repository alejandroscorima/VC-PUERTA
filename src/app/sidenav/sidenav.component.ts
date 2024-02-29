import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent extends AppComponent implements OnInit {

  ngOnInit(): void {
    console.log('accesPoint_name en Oninit de Sidenav', this.accessPoint_name);
    console.log(this.accessPoint_name);
  }

}
