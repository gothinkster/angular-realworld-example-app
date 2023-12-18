import RegistrationPage from "../pageobjects/registration.page.ts";
import { faker } from "@faker-js/faker";
import HomePage from "../pageobjects/home.page.ts";
import SignInPage from "../pageobjects/signIn.page.ts";
import ProfilePage from "../pageobjects/profile.page.ts";
import ProfilesettingsPage from "../pageobjects/profilesettings.page.ts";

describe("as a user", () => {
  it("should be possible to register", async () => {
    await RegistrationPage.navigateTo();
    //username and email needs to be unique and there is no delete action for users, so a random string is necessary (using names would lead to re-use)
    const username = faker.string.alpha({ length: 30 });
    const email = `${username}@mailinator.com`;
    await RegistrationPage.attemptRegister(username, email, "testpw");
    await HomePage.navigation.assertSpecificUserLoggedIn(username);
  });

  // logout is necessary due to webdriverio not having a clean context (like Playwright) for each test
  it("should be possible to log out", async () => {
    await HomePage.navigation.goToProfile();
    await ProfilePage.goToProfileSettings();
    await ProfilesettingsPage.clickLogout();
  });

  it("should be possible to login", async () => {
    await SignInPage.navigateTo();
    await SignInPage.attemptLogin("gerwin@detesters.nl", "wachtwoord");
    await HomePage.navigation.assertSpecificUserLoggedIn("gerwin");
  });
});
