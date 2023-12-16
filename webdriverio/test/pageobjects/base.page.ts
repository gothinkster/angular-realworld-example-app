export abstract class BasePage {
  abstract navigateTo(): void;
  abstract waitTillLoaded(): void;
}
