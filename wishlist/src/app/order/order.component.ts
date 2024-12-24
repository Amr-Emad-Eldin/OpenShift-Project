import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
// import {error} from '@angular/compiler-cli/src/transformers/util';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})

export class OrderComponent implements OnInit {
  couriers: string[] = [];
  createOrderObj: orderModel = new orderModel();
  userName: string = '';

  ngOnInit() {
    this.authService.user$.subscribe(user => {
       this.userName = user;
    });
    this.authService.getCouriers().subscribe(
      (response) => {
        this.couriers = response.couriers;
      },
      (error) => {
        console.error('Error fetching couriers:', error);
      }
    );

  }

  constructor(private authService: AuthService,private router: Router) {}

  onSubmit() {
    this.authService.createOrder(this.createOrderObj).subscribe(
          (response) => {
            console.log('Order created successfully:', response);
            alert('Order created successfully!');
            },
          (error) => {
            alert("Something went wrong!");
              console.error('Error creating order:', error);
            }
          );
    }

  logout() {
      const userName= this.authService.getUserEmail();
      this.authService.logout(userName).subscribe(response => {
          console.log('Logged out: ', response);
          alert('Logged out successfully!');
          this.router.navigate(['/login']);
        },
        (error) => {
          alert("Something went wrong!");
          console.error('Error loggingd out:', error);
        }
      );
  }

  orderDetails() {
    this.router.navigate(['/orderDetails']);
  }
}

export class orderModel {
  packageDetails: string;
  dropoffLocation: string;
  pickupLocation: string;
  deliveryTime: string;
  userName: string;
  courier: string

  constructor() {
    this.packageDetails = "";
    this.dropoffLocation = "";
    this.pickupLocation = "";
    this.deliveryTime = "";
    this.userName = "";
    this.courier = ""
  }

}

export class userModel {
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;

  constructor() {
     this.userName = "";
     this.email = "";
     this.phoneNumber = "";
     this.password = "";
  }

}
