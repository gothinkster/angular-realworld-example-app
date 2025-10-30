import { TestBed } from "@angular/core/testing";
import { JwtService } from "./jwt.service";

describe("JwtService", () => {
  let service: JwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtService);
    window.localStorage.clear();
  });

  it("should save and get token", () => {
    service.saveToken("abc123");
    expect(service.getToken()).toBe("abc123");
  });

  it("should remove token on destroy", () => {
    service.saveToken("xyz");
    service.destroyToken();
    expect(service.getToken()).toBeUndefined();
  });
});


