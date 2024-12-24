import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, tap } from 'rxjs';
import { OrderListComponent } from './order-list/order-list.component';

interface SignUp {
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) {}
  private baseUrl = 'http://127.0.0.1:5000';

  register(formData: SignUp){
    return this.http.post(this.baseUrl+'/register', formData);
  }

  private userSubject = new BehaviorSubject<string>(''); //Initial value momken tb2a null aw empty string
  user$ = this.userSubject.asObservable();

  userName: string = '';

  private userKey = 'loggedInUser';

  setUser(user: any) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  SecondSetUser(userName: string) {
    this.userName = userName;
    this.userSubject.next(userName);
  }


  getUserEmail(): string | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user).userName : null;
  }

  clearUser() {
    localStorage.removeItem(this.userKey);
  }

  logout(userName: any) {
    return this.http.post(this.baseUrl+'/logout', { userName });
  }

  registerCourier(courierData: SignUp){
    return this.http.post( this.baseUrl+'/registerCourier', courierData);
  }

  getCourierDetails(userName: string, password: string) {
    return this.http.get('http://127.0.0.1:5000/loginCourier?userName='+userName+'&password='+password);
  }

  getCouriers() {
    return this.http.get<{ couriers: string[] }>('http://127.0.0.1:5000/couriers');
  }

  getCourierOrders(courier: string) {
    return this.http.get<{ orders: any[] }>("http://127.0.0.1:5000/getCourierOrders?courier="+courier);
  }


  getUserOrders(userName: string): Observable<any> {
    return this.http.get<{ orders: any[] }>(`${this.baseUrl}/getUserOrders?userName=${userName}`);
  }

  getAllOrders() {
    return this.http.get<{ orders: any[] }>("http://127.0.0.1:5000/admin/getAllOrders");
  }

  getUserDetails(userName: string, password: string) {
    return this.http.get('http://127.0.0.1:5000/login?userName='+userName+'&password='+password);
  }

  createOrder(orderData: any): Observable<any> {
    orderData.userName = this.userName;
    return this.http.post(this.baseUrl + "/createOrder", orderData);
  }

  acceptOrder(_id: string) {
    return this.http.patch('http://127.0.0.1:5000/updateOrderStatus', { _id, status: 'ACCEPTED' });
  }

  updateOrderStatus(orderId: any, status: string) {
    return this.http.patch('http://127.0.0.1:5000/updateOrderStatus', { _id: orderId, status });
  }

  getIds(courier: string) {
    return this.http.get<{ orderIds: string[] }>(`http://127.0.0.1:5000/getIds?courier=${courier}`);
  }

  getIdsForUser(userName: string) {
    return this.http.get<{ orderIds: string[] }>(`http://127.0.0.1:5000/getIdsForUser?userName=${userName}`);
  }
  cancelOrder(orderId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/cancelOrder`, { _id: orderId });
  }


  deleteOrder(_id: string) {
    return this.http.delete("http://127.0.0.1:5000/admin/deleteOrder/"+_id);
  }

  reassignOrder(_id :string, courier: string) {
    return this.http.put("http://127.0.0.1:5000/admin/reassignOrder" , {_id: _id, courier});
  }

}
