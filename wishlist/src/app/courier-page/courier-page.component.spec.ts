import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierPageComponent } from './courier-page.component';

describe('CourierPageComponent', () => {
  let component: CourierPageComponent;
  let fixture: ComponentFixture<CourierPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourierPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
