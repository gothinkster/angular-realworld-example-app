import { $ } from "@wdio/globals";

class FeedComponent {
  public get yourFeedTab() {
    return $("a").getByText("Your Feed");
  }
  public get globalFeedTab() {
    return $("a").getByText("Global Feed");
  }
}
export default new FeedComponent();
