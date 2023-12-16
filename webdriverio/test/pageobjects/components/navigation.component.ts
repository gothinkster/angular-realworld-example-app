import { $, expect } from "@wdio/globals";

class NavigationComponent {
  async assertLoggedInUser(username: string) {
    expect($("a").getByText(username)).toBeDisplayed();
  }
}
export default new NavigationComponent();
