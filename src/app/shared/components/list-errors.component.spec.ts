import { ListErrorsComponent } from "./list-errors.component";

describe("ListErrorsComponent", () => {
  it("should build errorList from Errors input", () => {
    const cmp = new ListErrorsComponent();
    cmp.errors = { errors: { email: "is invalid", password: "is too short" } };
    expect(cmp.errorList).toEqual(["email is invalid", "password is too short"]);
  });

  it("should handle null input as empty list", () => {
    const cmp = new ListErrorsComponent();
    cmp.errors = null;
    expect(cmp.errorList).toEqual([]);
  });
});


