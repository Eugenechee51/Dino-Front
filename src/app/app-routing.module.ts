import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationComponent } from './notification/notification.component';
import {ContentComponent} from './content/content.component';
import {AlarmComponent} from './alarm/alarm.component';
import {MedicPageComponent} from './medic-page/medic-page.component';
import {TaskComponent} from './task/task.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './login/auth.guard';
import {SidebarComponent} from './content/sidebar/sidebar.component';
import {PersonalTableComponent} from './content/sidebar/personal-table/personal-table.component';
import {ScheduleTableComponent} from './content/sidebar/schedule-table/schedule-table.component';
import {DinoTrainerComponent} from './dino-trainer/dino-trainer.component';
import {AddUserComponent} from './content/sidebar/personal-table/add-user/add-user.component';
import {EditUserComponent} from './content/sidebar/personal-table/edit-user/edit-user.component';
import {NavigatorComponent} from './navigator/navigator.component';
import {ScheduleComponent} from './schedule/schedule.component';
import {AddDinoComponent} from './content/sidebar/dino-table/add-dino/add-dino.component';
import {EditDinoComponent} from './content/sidebar/dino-table/edit-dino/edit-dino.component';
import {DinoTableComponent} from './content/sidebar/dino-table/dino-table.component';
import {InspectorComponent} from './inspector/inspector.component';

const routes: Routes = [
  { path: 'sidebar', canActivate:[AuthGuard], component: SidebarComponent, children: [
      { path: 'editUser', outlet: 'sidebar', component: EditUserComponent },
    ]},
  { path: 'notifications', canActivate:[AuthGuard], component: NotificationComponent },
  { path: 'alarm', canActivate:[AuthGuard], component: AlarmComponent },
  { path: 'inspector', canActivate:[AuthGuard], data: {role: 'Inspector'}, component: InspectorComponent },
  { path: 'medicPage', canActivate:[AuthGuard], data: {role: 'Medic'}, component: MedicPageComponent },
  { path: 'dinotrainer', canActivate:[AuthGuard], data: {role: 'DinoTrainer'}, component: DinoTrainerComponent },
  { path: 'navigator', canActivate:[AuthGuard], data: {role: 'Navigator'}, component: NavigatorComponent },
  { path: 'schedule', canActivate:[AuthGuard], component: ScheduleComponent },
  { path: 'tasks', canActivate:[AuthGuard], component: TaskComponent },
  { path: 'login', component: LoginComponent },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: 'content', canActivate:[AuthGuard], component: ContentComponent, children: [
      { path: '', outlet: 'sidebar', canActivate:[AuthGuard], component: NotificationComponent },
      { path: 'notifications', outlet: 'sidebar', canActivate:[AuthGuard], data: {role: 'Manager'}, component: NotificationComponent },
      { path: 'schedule', outlet: 'sidebar', canActivate:[AuthGuard], data: {role: 'Manager'}, component: ScheduleTableComponent },
      { path: 'personal', outlet: 'sidebar', canActivate:[AuthGuard], data: {role: 'Manager'}, component: PersonalTableComponent },
      { path: 'addUser', outlet: 'sidebar', canActivate:[AuthGuard], data: {role: 'Manager'}, component: AddUserComponent },
      { path: 'editUser', outlet: 'sidebar', canActivate:[AuthGuard], data: {role: 'Manager'}, component: EditUserComponent },
      { path: 'dino', outlet: 'sidebar', canActivate:[AuthGuard], data: {role: 'Manager'}, component: DinoTableComponent },
      { path: 'addDino', outlet: 'sidebar', canActivate:[AuthGuard], data: {role: 'Manager'}, component: AddDinoComponent },
      { path: 'editDino', outlet: 'sidebar', canActivate:[AuthGuard], data: {role: 'Manager'}, component: EditDinoComponent },
  ]}
  // { path: 'notifications', component: NotificationComponent },
  // { path: 'alarm', component: AlarmComponent },
  // { path: 'medicPage', component: MedicPageComponent },
  // { path: 'tasks', component: TaskComponent },
  // { path: 'login', component: LoginComponent },
  // { path: '',   redirectTo: '/login', pathMatch: 'full' },
  // { path: 'content', component: ContentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
