import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NotificationsService} from 'angular2-notifications';
import {NotificationService} from './notification.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {AppService} from '../app.service';
import {Employee} from '../content/employee.interface';

export interface Notification {
  id: number | undefined;
  header: string | undefined;
  body: string | undefined;
  user: Employee | undefined;
  imageUrl: string | undefined;
  isSend: boolean | undefined;
  isAlert: boolean | undefined;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, AfterViewInit, OnDestroy{

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  notifications!: Notification[];
  columnsToDisplay = ['id', 'header', 'body'];
  dataSource: any;
  interval: number | undefined;

  constructor(public notificationService: NotificationService, public notificationsService: NotificationsService, public appService: AppService) {
    appService.setEmployeeFromServer();
  }

  ngOnInit() {
    this.getNotifications();
    this.interval = setInterval(() => {this.getNotifications();}, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.interval = undefined;
  }

  ngAfterViewInit() {
    // this.paginator = this.dataSource.paginator;
  }


  getNotifications() {
    this.notificationService.getNotifications().subscribe((res: any) => {
      if (res === null) {
        console.log('res is null');
        return;
      }
      // for (let i = 0; i < res.length; i++) {
      //   this.notifications.push({id: res[i].id, header: res[i].header, body: res[i].body});
      // }
      this.notifications = res;
      this.dataSource = new MatTableDataSource<Notification>(this.notifications);
      this.dataSource.paginator = this.paginator;
      //console.log(this.notifications);
    }, (err: { message: any; }) => {
      console.log('Ошибка', err.message);
      this.notificationsService.error('Ошибка получения')
    });
  }

  getRole() {
    return localStorage.getItem("ROLE");
  }

}
