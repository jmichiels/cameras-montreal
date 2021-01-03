import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Camera, CameraService} from '../../services/camera.service';

@Component({
  selector: 'app-camera-list',
  templateUrl: './camera-list.component.html',
  styleUrls: ['./camera-list.component.scss']
})
export class CameraListComponent {
  selectedCameras$: Observable<Array<Camera>>;

  constructor(
    private cameraService: CameraService
  ) {
    this.selectedCameras$ = cameraService.selectedCameras$;
  }

  removeClicked(id: number): void {
    this.cameraService.unselect(id);
  }

  raiseClicked(id: number): void {
    this.cameraService.raise(id);
  }

  lowerClicked(id: number): void {
    this.cameraService.lower(id);
  }

  trackCameraById(index: number, item: Camera): number {
    return item.id;
  }
}
