import { Component, OnInit } from '@angular/core';
import {ContentService} from './content.service';
import {NotificationsService} from 'angular2-notifications';
import {NgForm} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Employee} from './employee.interface';
import {initializeApp} from "firebase/app";
import {environment} from "../../environments/environment";
import {AuthService} from "../login/auth.service";
import {getMessaging, getToken, onMessage, deleteToken} from "firebase/messaging";
import {AppService} from '../app.service';
import {MomentumTask} from '../task/momentum-task.interface';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  employee!: Employee;

  hunterList!: Employee[];               // список доступных Хантеров, если задача в Gray статусе, иначе он пустой
  progressStatus: number | undefined; // статус Прогресса задачи, если задача в статусах Yellow, Green, Red, иначе он пустой
  currentHunterID!: number | null;     // текущий вызванный Хантер, если задача в стаутсах Yellow, Green, Red, иначе он пустой

  momentumTask!: MomentumTask;
  interval: number | undefined;

  constructor(private modalService: NgbModal,
              public contentService: ContentService,
              private notificationService: NotificationsService,
              private auth: AuthService,
              public appService: AppService) {
    this.employee = contentService.getEmployee();
    this.contentService.setEmployee(this.employee);

    this.progressStatus = 0;
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      const firebaseApp = initializeApp(environment.firebase);
      this.requestPermission(firebaseApp);
      this.listen(firebaseApp);
    }
    this.getEmployeeFromServer();
  }

  requestPermission(firebaseApp: any) {
    const messaging = getMessaging(firebaseApp);
    getToken(messaging,
      { vapidKey: environment.firebase.vapidKey}).then(
      (currentToken) => {
        if (currentToken) {
          console.log("Hurraaa!!! we got the token.....");
          console.log(currentToken);
          let token = {
            token: currentToken
          }
          console.log()
          this.contentService.setFbToken(currentToken);
          this.sendFireBaseToken(token);
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
  }

  listen(firebaseApp: any) {
    const messaging = getMessaging(firebaseApp);
    console.log("Receiving messages...")
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.notificationService.info(payload.notification?.title, payload.notification?.body)
      // this.message=payload;
      // const f = parseJson(payload.toString())
    });
  }

  getEmployeeFromServer() {  // flag for getData() call without rerender in NgOnInit()
    this.contentService.getEmployeeFromServer().subscribe((res: any) => {
      if (res === null) {
        console.log('res is null');
        return null;
      }
      this.employee = res;
      this.contentService.setEmployee(this.employee);
      //console.log(this.employee);
      return this.employee;
      //this.notificationService.success('Получено')
    }, (err: { message: any; }) => {
      this.notificationService.error('Ошибка', 'Не удалось получить сведения об аккаунте!')
      return null;
    });
  }

  sendFireBaseToken(token: any) {
    this.contentService.sendFireBaseToken(token).subscribe((res) => {
      console.log('Токен сохранен успешно');
    }, (err: { message: any; }) => {
      console.log('Ошибка', err);
      // this.notificationService.error('Ошибка получения')
      return null;
    });
  }

  openGuardModal(guardModal: any) {
    this.getCurrentTask();
    this.interval = setInterval(() => {this.getCurrentTask(); console.log("int start")}, 5000);

    // this.getHunterList();
    // Get there current Hunter ID
    // else If none than get list of available Hunters

    this.modalService.open(guardModal).result
      .then((result) => {
        console.log('Modal closed');
      })
      .catch(err => '');
  }

  onClose(modal: any){
    modal.dismiss('Cross click');
    console.log('tets')
    clearInterval(this.interval);
    this.interval = undefined;
  }

  onSubmit(f: NgForm) {
    console.log(f.value);
    const task = {
      "from": this.employee.id,
      "to": f.value.id,
      "type": 1,
      "status": 1,
      "comment": "test"
    };
    this.hunterRequest(task);

    this.modalService.dismissAll(); //dismiss the modal
  }

  private hunterRequest(task: any) {
    this.contentService.hunterRequest(task).subscribe(
      () => {
        this.notificationService.success("Успех", "Запрос отправлен Хантеру");
      },
      error => {
        console.warn(error);
        this.notificationService.error("Ошибка", "Ошибка отправки запроса Хантеру");
      }
    );
  }

  private getHunterList() {
    this.contentService.getHunterList().subscribe((res: any) => {
      if (res === null) {
        console.log('res is null');
        return;
      }
      console.log(res);
      try {
        //let json = JSON.parse(res);
        console.log(res);
        let ids = [];
        for (let i = 0; i < res.length; i++) {
          console.log(res[i]['id']);
          ids.push(res[i]['id']);
        }
        this.hunterList = ids;
      } catch (e) {

      }
      console.log(this.hunterList);
    }, (err: { message: any; }) => {
      console.log('Ошибка', err.message);
      this.notificationService.error('Ошибка получения списка доступных Хантеров')
    });
  }

  stopMomentumTask() {
    this.contentService.stopMomentumTask(this.momentumTask.id).subscribe(
      () => {
        this.getCurrentTask();
        this.progressStatus = 0;
        this.notificationService.success("Успех", "Вызов завершен успешно");
      },
      error => {
        console.warn(error);
        this.notificationService.error("Ошибка", "Ошибка завершения вызова");
      }
    );
  }

  private getCurrentTask() {
    this.contentService.getMomentumTask().subscribe((res: any) => {
      if (res === null) {
        this.currentHunterID = null;
        this.getHunterList();
        return;
      }
      this.hunterList = [];
      this.momentumTask = res;
      this.currentHunterID = this.momentumTask.to.id;
      this.progressStatus = this.momentumTask.status.id;
    }, (err: { message: any; }) => {
      console.log('Ошибка', err.message);
      this.notificationService.error('Ошибка получения текущей задачи')
    });
  }
}
