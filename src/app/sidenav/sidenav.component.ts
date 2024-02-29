import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent extends AppComponent implements OnInit {

  ngOnInit(): void {
    console.log('sala_name en Oninit de Sidenav', this.sala_name);
    console.log(this.sala_name);
  }

}
