import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CameraListComponent} from './components/camera-list/camera-list.component';
import {AddCameraFormComponent} from './components/add-camera-form/add-camera-form.component';

const routes: Routes = [{
  path: '',
  component: CameraListComponent,
}, {
  path: 'add',
  component: AddCameraFormComponent,
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
