import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  signUpObj: SignUp = { userName: '', email: '', password: '', phoneNumber: '' };
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}
  isSignDivVisiable: boolean  = true;
  loginObj: LoginModel  = new LoginModel();

  onLogin() {
    this.authService.getUserDetails(this.loginObj.userName, this.loginObj.password).subscribe(
      (response : any) => {
        if (response && response.user) {
          alert("User found");
          this.authService.setUser(response.user);
          this.authService.SecondSetUser(this.loginObj.userName);
          localStorage.setItem('userName', this.loginObj.userName);
          this.router.navigate(['/order'] );

        } else {
          alert("No User Found");
        }
      },
      (error) => {
        console.error(error);
        alert("Login Failed! Please check your credentials.");
      }
    );
    console.log('Attempting login with:', this.loginObj);
  }

  onLoginCourier() {
    this.authService.getCourierDetails(this.loginObj.userName, this.loginObj.password).subscribe(
      (response : any) => {
        if (response && response.user) {
          alert("User found");
          this.authService.setUser(response.user);
          this.authService.SecondSetUser(this.loginObj.userName);
          localStorage.setItem('userName', this.loginObj.userName);
          this.router.navigate(['/courierPage'] );

        } else {
          alert("No User Found");
        }
      },
      (error) => {
        console.error(error);
        alert("Login Failed! Please check your credentials.");
      }
    );
    console.log('Attempting login with:', this.loginObj);
  }


  onRegister() {
    this.authService.register(this.signUpObj)
      .subscribe(
        (response) => {
            console.log('User registered successfully:', response);
            alert('User Registered successfully!');
            this.signUpObj = { userName: '', email: '', password: '', phoneNumber: '' };
          this.router.navigate(['/login']);

        },
        (error) => {
          alert("Something went wrong!");

          console.error('Registration failed:', error);
          this.errorMessage = 'Sign Up failed. Please check your credentials.';
        }
      );
  }

  onRegisterCourier() {
    this.authService.registerCourier(this.signUpObj)
      .subscribe(
        (response) => {
          console.log('Courier registered successfully:', response);
          alert('Courier Registered successfully!');
          this.signUpObj = { userName: '', email: '', password: '', phoneNumber: '' };
          this.router.navigate(['/login']);

        },
        (error) => {
          alert("Something went wrong!");

          console.error('Registration failed:', error);
          this.errorMessage = 'Sign Up failed. Please check your credentials.';
        }
      );
  }
}

export class SignUp  {
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;

  constructor() {
    this.userName = "";
    this.email = "";
    this.password= "" ;
    this.phoneNumber =""
  }
}

export class LoginModel  {
  userName: string;
  password: string;

  constructor() {
    this.userName = "";
    this.password= ""
  }
}


