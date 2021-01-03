import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCameraFormComponent } from './add-camera-form.component';

describe('AddCameraFormComponent', () => {
  let component: AddCameraFormComponent;
  let fixture: ComponentFixture<AddCameraFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCameraFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCameraFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
