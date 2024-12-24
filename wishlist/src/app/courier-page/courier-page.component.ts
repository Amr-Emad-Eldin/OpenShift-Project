import {Component, OnInit} from '@angular/core';
import { AuthService} from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-courier-page',
  templateUrl: './courier-page.component.html',
  styleUrl: './courier-page.component.css'
})

export class CourierPageComponent implements OnInit {
  courier = '';
  orders: any[] = [];
  oderIds: string[] = [];

  constructor(private authService: AuthService, private location: Location) { }

  ngOnInit() {
    this.courier = localStorage.getItem('userName') || '';

    if (this.courier) {
      this.authService.getCourierOrders(this.courier).subscribe(
        (response) => {
          this.orders = response.orders;
          console.log('Orders fetched:', this.orders);
        },
        (error) => {
          console.error('Error fetching orders:', error);
        }
      );

      this.authService.getIds(this.courier).subscribe(
        (response) => {
          this.oderIds = response.orderIds;
        },
        (error) => {
          console.error('Error fetching order IDs:', error);
        }
      );
    }
  }

  acceptOrder(_id: string) {
    this.authService.acceptOrder(_id).subscribe(
      (response) => {
        alert("Order accepted successfully!");
        console.log('Order accepted successfully:', response);

        this.orders = this.orders.map(order =>
          order._id === _id ? { ...order, status: 'ACCEPTED' } : order
        );
      },
      (error) => {
        alert("Something went wrong!");
        console.error('Error accepting order:', error);
      }
    );
  }

  updateOrderStatus(_id: string, newStatus: string) {
    this.authService.updateOrderStatus(_id, newStatus).subscribe(
      (response) => {
        console.log('Order status updated:', response);
        this.orders = this.orders.map(order =>
          order._id === _id ? { ...order, status: newStatus } : order
        );
      },
      (error) => {
        console.error('Error updating order status:', error);
      }
    );
  }

  goBack() {
    this.location.back();
  }
}
