import RegistrationPage from "../pageobjects/registration.page.ts";
import { faker } from "@faker-js/faker";
import HomePage from "../pageobjects/home.page.ts";

describe("as a user", () => {
  it("should be possible to register", async () => {
    await RegistrationPage.navigateTo();
    //username and email needs to be unique and there is no delete action for users, so a random string is necessary (using names would lead to re-use)
    const username = faker.string.alpha({ length: 30 });
    const email = `${username}@mailinator.com`;
    await RegistrationPage.attemptRegister(username, email, "testpw");
    await HomePage.navigation.assertLoggedInUser(username);
    browser.saveScreenshot("./screenshots/afterReg.png");
  });
});
