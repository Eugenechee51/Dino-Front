import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {AppService} from '../app.service';
import {DinoTrainerService} from './dino-trainer.service';

@Component({
  selector: 'app-dino-trainer',
  templateUrl: './dino-trainer.component.html',
  styleUrls: ['./dino-trainer.component.css']
})
export class DinoTrainerComponent implements OnInit {

  currentOperation: any;
  dinoList!: number[];

  constructor(private modalService: NgbModal,
              private notificationService: NotificationsService,
              private dinoTrainerService: DinoTrainerService,
              public appService: AppService) {
    appService.setEmployeeFromServer();
  }

  ngOnInit() {
  }

  openMultiModal(multiModal: any, type: any) {
    this.getDinoList();
    if (type === 1) {
      this.currentOperation = 'Отчет о занятии';
    }
    else {
      this.currentOperation = 'Направление дино в центр';
    }
    this.modalService.open(multiModal).result
      .then((result) => console.log('Modal closed'))
      .catch(err => '');
  }

  onSubmit(f: NgForm) {
    this.sendReport(f.value);
    this.modalService.dismissAll(); //dismiss the modal
  }

  getDinoList() {
    this.dinoTrainerService.getDinoList().subscribe((res: any) => {
      if (res === null) {
        console.log('res is null');
        return;
      }
      try {
        let ids = [];
        for (let i = 0; i < res.length; i++) {
          ids.push(res[i]['id']);
        }
        this.dinoList = ids;
      } catch (e) {

      }
      //console.log(this.dinoList);
    }, (err: { message: any; }) => {
      console.log('Ошибка', err.message);
      this.notificationService.error('Ошибка получения списка доступных Хантеров')
    });
  }

  sendReport(form: any) {
    form = {  dino_id: +form.id,
              training: form.train/1000,
              calm: form.calm/1000};
    //console.log(form);
    this.dinoTrainerService.sendReport(form).subscribe((res) => {
      this.notificationService.success('Успех', 'Информация о занятии дино отправлена')
    }, (err: { message: any; }) => {
      console.log('Ошибка', err);
      this.notificationService.error('Ошибка отправки отчета');
      return null;
    });
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + '%';
    }
    return value;
  }

  getRole() {
    return localStorage.getItem("ROLE");
  }
}
