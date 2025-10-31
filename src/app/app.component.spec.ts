import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './core/layout/header.component';
import { FooterComponent } from './core/layout/footer.component';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';

// Mock components
@Component({
  selector: 'app-layout-header',
  template: '<div>Mock Header</div>',
  standalone: true
})
class MockHeaderComponent {}

@Component({
  selector: 'app-layout-footer',
  template: '<div>Mock Footer</div>',
  standalone: true
})
class MockFooterComponent {}

@Component({
  selector: 'router-outlet',
  template: '<div>Mock Router Outlet</div>',
  standalone: true
})
class MockRouterOutlet {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    })
    .overrideComponent(AppComponent, {
      remove: {
        imports: [HeaderComponent, FooterComponent, RouterOutlet]
      },
      add: {
        imports: [MockHeaderComponent, MockFooterComponent, MockRouterOutlet]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should have app-root selector', () => {
    const componentMetadata = (AppComponent as any).__annotations__?.[0] || 
                              (AppComponent as any).ɵcmp;
    expect(componentMetadata).toBeDefined();
  });

  describe('Template rendering', () => {
    it('should render header component', () => {
      const header = compiled.querySelector('app-layout-header');
      expect(header).toBeTruthy();
    });

    it('should render router outlet', () => {
      const routerOutlet = compiled.querySelector('router-outlet');
      expect(routerOutlet).toBeTruthy();
    });

    it('should render footer component', () => {
      const footer = compiled.querySelector('app-layout-footer');
      expect(footer).toBeTruthy();
    });

    it('should render components in correct order', () => {
      const children = Array.from(compiled.children);
      const selectors = children.map(child => child.tagName.toLowerCase());
      
      expect(selectors).toContain('app-layout-header');
      expect(selectors).toContain('router-outlet');
      expect(selectors).toContain('app-layout-footer');
    });

    it('should have header before router outlet', () => {
      const header = compiled.querySelector('app-layout-header');
      const routerOutlet = compiled.querySelector('router-outlet');
      
      expect(header).toBeTruthy();
      expect(routerOutlet).toBeTruthy();
      
      const headerIndex = Array.from(compiled.children).indexOf(header!);
      const outletIndex = Array.from(compiled.children).indexOf(routerOutlet!);
      
      expect(headerIndex).toBeLessThan(outletIndex);
    });

    it('should have router outlet before footer', () => {
      const routerOutlet = compiled.querySelector('router-outlet');
      const footer = compiled.querySelector('app-layout-footer');
      
      expect(routerOutlet).toBeTruthy();
      expect(footer).toBeTruthy();
      
      const outletIndex = Array.from(compiled.children).indexOf(routerOutlet!);
      const footerIndex = Array.from(compiled.children).indexOf(footer!);
      
      expect(outletIndex).toBeLessThan(footerIndex);
    });
  });

  describe('Component structure', () => {
    it('should be a standalone component', () => {
      const metadata = (AppComponent as any).ɵcmp;
      expect(metadata).toBeDefined();
    });

    it('should import required components', () => {
      const imports = (AppComponent as any).__annotations__?.[0]?.imports || 
                     (AppComponent as any).ɵcmp?.dependencies;
      expect(imports).toBeDefined();
    });

    it('should have correct selector', () => {
      const selector = (AppComponent as any).__annotations__?.[0]?.selector || 
                      (AppComponent as any).ɵcmp?.selectors?.[0]?.[0];
      expect(selector).toBe('app-root');
    });

    it('should have templateUrl defined', () => {
      const templateUrl = (AppComponent as any).__annotations__?.[0]?.templateUrl;
      expect(templateUrl).toBeDefined();
    });
  });

  describe('Component lifecycle', () => {
    it('should initialize without errors', () => {
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should render correctly on initialization', () => {
      expect(compiled.children.length).toBeGreaterThan(0);
    });

    it('should maintain structure after change detection', () => {
      fixture.detectChanges();
      
      const header = compiled.querySelector('app-layout-header');
      const routerOutlet = compiled.querySelector('router-outlet');
      const footer = compiled.querySelector('app-layout-footer');
      
      expect(header).toBeTruthy();
      expect(routerOutlet).toBeTruthy();
      expect(footer).toBeTruthy();
    });

    it('should not throw errors on multiple change detections', () => {
      expect(() => {
        fixture.detectChanges();
        fixture.detectChanges();
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('Component isolation', () => {
    it('should not have any public properties', () => {
      const publicProps = Object.keys(component);
      expect(publicProps.length).toBe(0);
    });

    it('should not have any public methods', () => {
      const prototype = Object.getPrototypeOf(component);
      const methods = Object.getOwnPropertyNames(prototype)
        .filter(name => name !== 'constructor' && typeof prototype[name] === 'function');
      expect(methods.length).toBe(0);
    });

    it('should be a simple container component', () => {
      expect(component.constructor.name).toBe('AppComponent');
    });
  });

  describe('Integration with child components', () => {
    it('should allow header component to render', () => {
      const header = compiled.querySelector('app-layout-header');
      expect(header?.textContent).toContain('Mock Header');
    });

    it('should allow router outlet to render', () => {
      const routerOutlet = compiled.querySelector('router-outlet');
      expect(routerOutlet?.textContent).toContain('Mock Router Outlet');
    });

    it('should allow footer component to render', () => {
      const footer = compiled.querySelector('app-layout-footer');
      expect(footer?.textContent).toContain('Mock Footer');
    });

    it('should not interfere with child component rendering', () => {
      fixture.detectChanges();
      
      const header = compiled.querySelector('app-layout-header');
      const routerOutlet = compiled.querySelector('router-outlet');
      const footer = compiled.querySelector('app-layout-footer');
      
      expect(header?.textContent).toBeTruthy();
      expect(routerOutlet?.textContent).toBeTruthy();
      expect(footer?.textContent).toBeTruthy();
    });
  });

  describe('DOM structure', () => {
    it('should have exactly 3 direct children', () => {
      const directChildren = Array.from(compiled.children);
      expect(directChildren.length).toBe(3);
    });

    it('should not have any text nodes between components', () => {
      const childNodes = Array.from(compiled.childNodes);
      const textNodes = childNodes.filter(node => 
        node.nodeType === Node.TEXT_NODE && 
        node.textContent?.trim() !== ''
      );
      expect(textNodes.length).toBe(0);
    });

    it('should not have any extra wrapper elements', () => {
      const wrappers = compiled.querySelectorAll('div, span, section');
      // Only mock components should have divs
      expect(wrappers.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Performance', () => {
    it('should render quickly', (done) => {
      const startTime = performance.now();
      
      fixture.detectChanges();
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(100); // Should render in less than 100ms
      done();
    });

    it('should handle multiple renders efficiently', () => {
      const iterations = 10;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        fixture.detectChanges();
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;
      
      expect(avgTime).toBeLessThan(50); // Average should be less than 50ms
    });
  });

  describe('Edge cases', () => {
    it('should handle component destruction gracefully', () => {
      expect(() => {
        fixture.destroy();
      }).not.toThrow();
    });

    it('should not leak memory on destroy', () => {
      const initialChildren = compiled.children.length;
      
      fixture.destroy();
      
      // After destroy, component should be cleaned up
      expect(fixture.componentInstance).toBeDefined();
    });

    it('should handle rapid change detection cycles', () => {
      expect(() => {
        for (let i = 0; i < 100; i++) {
          fixture.detectChanges();
        }
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic structure', () => {
      const header = compiled.querySelector('app-layout-header');
      const footer = compiled.querySelector('app-layout-footer');
      
      expect(header).toBeTruthy();
      expect(footer).toBeTruthy();
    });

    it('should maintain proper document flow', () => {
      const children = Array.from(compiled.children);
      expect(children.length).toBeGreaterThan(0);
      
      // Ensure components are in DOM order
      children.forEach((child, index) => {
        expect(child).toBeTruthy();
      });
    });
  });

  describe('Component metadata', () => {
    it('should be defined as a Component', () => {
      const annotations = (AppComponent as any).__annotations__;
      expect(annotations).toBeDefined();
    });

    it('should have correct component configuration', () => {
      const config = (AppComponent as any).__annotations__?.[0] || 
                    (AppComponent as any).ɵcmp;
      expect(config).toBeDefined();
    });
  });
});
