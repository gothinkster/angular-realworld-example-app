export abstract class BasePage {
  abstract navigateTo(args?: {}): void;
  abstract waitTillLoaded(): void;
}
