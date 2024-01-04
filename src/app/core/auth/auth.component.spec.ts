import { TestBed } from '@angular/core/testing';
import AuthComponent from "./auth.component";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthComponent, RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();
  });

  it('should xx', () => {
    const fixture = TestBed.createComponent(AuthComponent);
    const app = fixture.componentInstance;
    expect(app.isSubmitting).toEqual(true);
  });
});
