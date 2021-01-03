import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {combineLatest, Observable} from 'rxjs';
import {Camera, CameraService} from '../../services/camera.service';
import {FormControl} from '@angular/forms';
import {map, shareReplay, startWith} from 'rxjs/operators';

const MAX_SUGGESTIONS = 50;

@Component({
  selector: 'app-add-camera-form',
  templateUrl: './add-camera-form.component.html',
  styleUrls: ['./add-camera-form.component.scss']
})
export class AddCameraFormComponent {
  formControl = new FormControl();
  filteredCameras$: Observable<Array<Camera>>;
  filteredCamerasEmpty$: Observable<boolean>;

  constructor(
    private cameraService: CameraService,
    private location: Location,
  ) {
    const value$ = this.formControl.valueChanges.pipe(
      startWith(''),
    );
    this.filteredCameras$ = combineLatest([
      cameraService.cameras$,
      value$,
    ]).pipe(
      map(([cameras, value]) => {
        if (value.length < 3) {
          return [];
        }
        return cameras
          .filter(
            camera => camera.title.toLowerCase().includes(value.toLowerCase())
          )
          .slice(0, MAX_SUGGESTIONS);
      }),
      shareReplay(1),
    );
    this.filteredCamerasEmpty$ = this.filteredCameras$.pipe(
      map(cameras => cameras.length === 0),
    );
  }

  cancelClicked(): void {
    this.location.back();
  }

  cameraClicked(id: number): void {
    this.cameraService.select(id);
  }

  trackCameraById(index: number, item: Camera): number {
    return item.id;
  }
}
