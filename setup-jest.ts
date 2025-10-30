import 'jest-preset-angular/setup-jest';

// Optional: mock for window.scrollTo etc. add minimal DOM APIs if needed
Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true });


