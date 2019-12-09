const MockBrowser = require('mock-browser').mocks.MockBrowser;

export function windowFactory() {
  return MockBrowser.createWindow();
}
