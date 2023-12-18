import HomePage from "../pageobjects/home.page.ts";
import Apihelper from "../apiobjects/apihelper.ts";
import NewArticlePage from "../pageobjects/new-article.page.ts";
import { faker } from "@faker-js/faker";
import ViewArticlePage from "../pageobjects/view-article.page.ts";

describe("as a user", () => {
  //A more verbose way of writing a test and exposing seperate actions to perform in the test
  it("should be possible to publish a new article", async () => {
    const title = faker.string.alpha({ length: 20 });
    const description = faker.word.words({ count: 10 });
    const content = faker.lorem.lines(20);
    const tags = faker.word.words({ count: 3 }).split(" ");

    await Apihelper.authentication.loginUser(
      "gerwin@detesters.nl",
      "wachtwoord"
    );
    await HomePage.navigateTo();
    await HomePage.navigation.goToNewArticle();
    await NewArticlePage.fillTitle(title);
    await NewArticlePage.fillDescription(description);
    await NewArticlePage.fillContent(content);
    await NewArticlePage.fillTags(tags);
    await NewArticlePage.clickSubmit();
    await ViewArticlePage.waitTillLoaded();
    //Limited check, but normally would validate a full article
    await ViewArticlePage.assertPageTitle(title);
  });
  //Other scenario's would obviously be to edit and delete articles or see articles on the homescreen
});
