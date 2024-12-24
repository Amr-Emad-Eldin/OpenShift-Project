import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})

export class AdminComponent implements OnInit {
  orders: any[] = [];
  showModal: boolean = false;
  selectedOrderId: string = '';
  selectedStatus: string = '';
  selectedCourier: string = '';
  couriers: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getAllOrders().subscribe(
      (response) => {
        this.orders = response.orders;
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );

    this.authService.getCouriers().subscribe(
      (response) => {
        this.couriers = response.couriers;
      },
      (error) => {
        console.error('Error fetching couriers:', error);
      }
    );
  }

  openStatusModal(orderId: string): void {
    this.selectedOrderId = orderId;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  updateStatus(): void {
    this.authService.updateOrderStatus(this.selectedOrderId, this.selectedStatus).subscribe(
      (response) => {
        alert('Order status updated successfully!');
        this.showModal = false;
        this.ngOnInit(); // Reload orders
      },
      (error) => {
        console.error('Error updating order status:', error);
      }
    );
  }

  deleteOrder(_id: string): void {
    this.authService.deleteOrder(_id).subscribe(
      (response) => {
        alert('Order deleted successfully!');
        this.ngOnInit();
      },
      (error) => {
        console.error('Error deleting order:', error);
      }
    );
  }

  reassignCourier(_id: string, courier: string) {
    if (!courier) return;

    this.authService.reassignOrder(_id, courier).subscribe(
      (response) => {
        alert('Courier reassigned successfully');

      },
      (error) => {
        console.error('Error reassigning courier:', error);
        alert('Error reassigning courier');
      }
    );
  }
}
