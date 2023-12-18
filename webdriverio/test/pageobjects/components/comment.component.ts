import { expect } from "@wdio/globals";

class CommentComponent {
  commentField = () => {
    return browser.findByPlaceholderText("Write a comment...");
  };
  postCommentButton = () => {
    return browser.findByRole("button", { name: "Post Comment" });
  };

  async waitTillLoaded() {
    expect(this.commentField()).toBeDisplayed();
    expect(this.postCommentButton()).toBeDisplayed();
  }
}

export default new CommentComponent();
