import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuchatMessageListComponent } from './puchat-message-list.component';

describe('PuchatMessageListComponent', () => {
  let component: PuchatMessageListComponent;
  let fixture: ComponentFixture<PuchatMessageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuchatMessageListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuchatMessageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
