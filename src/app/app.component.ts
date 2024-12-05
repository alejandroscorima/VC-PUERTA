
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookiesService } from './cookies.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from './users.service';
import { Payment } from './payment';
import { User } from './user';
import { AccessPoint } from './access-point';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  //accessPoint_name='';
  accessPoint_id = 0;

  user_id=0;
  user_role='';

  accessPoint: AccessPoint = new AccessPoint('','','','');

  userOnSes: User = new User('','','','','','','','','','','','','',0,'','','','','','','','','','','',0,'',0);

  constructor(private router: Router,
  private cookies: CookiesService,
  private toastr: ToastrService,
  private usersService: UsersService,
  ){}

  logout(){
    this.cookies.deleteToken('accessPoint_id');
    this.cookies.deleteToken('user_id');
    this.cookies.deleteToken('onSession');
    location.reload();
  }

  ngOnInit() {
    // Verificar el pago/licencia del cliente
    this.usersService.getPaymentByClientId(1).subscribe({
      next: (resPay: Payment) => {
        if (resPay.error) {
          this.handlePaymentError(resPay.error);
        } else {
          this.initializeAccessPoint();
          this.initializeUser();
        }
      },
      error: (error) => {
        this.handlePaymentError(error);
      }
    });
  }
  
  /**
   * Manejo de errores relacionados al pago/licencia
   * @param error - Detalle del error
   */
  private handlePaymentError(error: any): void {
    // Eliminar cookies de sesión
    this.cookies.deleteToken("user_id");
    this.cookies.deleteToken("user_role");
    this.cookies.deleteToken("sala");
    this.cookies.deleteToken("onSession");
  
    // Mostrar error y redirigir al usuario
    console.error('Error al obtener el pago:', error);
    this.toastr.error('Error al obtener la licencia: ' + error);
    this.router.navigateByUrl('/');
  }
  
  /**
   * Inicializar datos del punto de acceso si existe el token correspondiente
   */
  private initializeAccessPoint(): void {
    if (this.cookies.checkToken('accessPoint_id')) {
      this.accessPoint_id = parseInt(this.cookies.getToken('accessPoint_id'), 10);
      this.usersService.getAccessPointById(this.accessPoint_id).subscribe({
        next: (cam: AccessPoint) => {
          if (cam) {
            this.accessPoint = cam;
          }
        },
        error: (err) => {
          console.error('Error al obtener el punto de acceso:', err);
          this.toastr.error('No se pudo cargar el punto de acceso.');
        }
      });
    }
  }
  
  /**
   * Inicializar datos del usuario si existe el token correspondiente
   */
  private initializeUser(): void {
    if (this.cookies.checkToken('user_id')) {
      this.user_id = parseInt(this.cookies.getToken('user_id'), 10);
      this.usersService.getUserById(this.user_id).subscribe({
        next: (u: User) => {
          this.userOnSes = u;
        },
        error: (err) => {
          console.error('Error al obtener el usuario:', err);
          this.toastr.error('No se pudo cargar la información del usuario.');
        }
      });
    }
  }
 
}
