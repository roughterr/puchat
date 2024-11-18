import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuchatTypeMessageComponent } from './puchat-type-message.component';

describe('PuchatTypeMessageComponent', () => {
  let component: PuchatTypeMessageComponent;
  let fixture: ComponentFixture<PuchatTypeMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuchatTypeMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuchatTypeMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
