import { TestBed } from "@angular/core/testing";
import { MarkdownPipe } from "./markdown.pipe";
import { DomSanitizer } from "@angular/platform-browser";

jest.mock("marked", () => ({
  marked: {
    parse: (content: string) => `<p>${content}</p>`,
  },
}));

describe("MarkdownPipe", () => {
  it("should render markdown to sanitized HTML", async () => {
    const pipe = TestBed.runInInjectionContext(() => new MarkdownPipe());
    const result = await pipe.transform("Hello");
    expect(result).toBe("<p>Hello</p>");
  });
});


