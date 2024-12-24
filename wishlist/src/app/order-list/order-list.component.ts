import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { OrderComponent } from '../order/order.component';
import { Location } from '@angular/common';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})

export class OrderListComponent implements OnInit {
  userName = '';
  orders: any[] = [];
  oderIds: string[] = [];

  constructor(private authService: AuthService, private location: Location) { }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.userName = localStorage.getItem('userName') || '';
    this.authService.getUserOrders(this.userName).subscribe(
        (response) => {
          this.orders = response.orders;
          console.log('Orders fetched:', this.orders);
        },
        (error) => {
          console.error('Error fetching orders:', error);
        }
    );
    this.authService.getIdsForUser(this.userName).subscribe(
        (response) => {
          this.oderIds = response.orderIds;
        },
        (error) => {
          console.error('Error fetching order IDs:', error);
        }
    );
  }
  cancelOrder(orderId: string) {
    this.authService.cancelOrder(orderId).subscribe(
        (response) => {
          alert('Order canceled successfully');
          // Update order status locally or refresh list
          this.orders = this.orders.map(order =>
              order._id === orderId ? { ...order, status: 'CANCELED' } : order
          );
        },
        (error) => {
          alert('Failed to cancel order');
          console.error('Error canceling order:', error);
        }
    );
  }
}
