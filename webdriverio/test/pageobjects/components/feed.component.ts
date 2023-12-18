class FeedComponent {
  public get yourFeedTab() {
    return browser.findByText("Your Feed", { exact: false }, { timeout: 5000 });
    // Some considerations while developing this:
    // Sadly the first option doesn't work because it's not a 'real' link and sadly the second option doesn't seem to retry the first part
    // return browser.findByRole('link', {name: 'Your Feed'}, {timeout:10000})
    // return $('a').findByText("Your Feed", {exact: false}, {timeout:10000});
  }
  public get globalFeedTab() {
    return browser.findByText(
      "Global Feed",
      { exact: false },
      { timeout: 5000 }
    );
  }
}
export default new FeedComponent();
