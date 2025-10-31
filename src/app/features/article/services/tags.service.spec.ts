import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let service: TagsService;
  let httpMock: HttpTestingController;

  const mockTags: string[] = ['angular', 'typescript', 'testing', 'rxjs', 'javascript'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TagsService]
    });

    service = TestBed.inject(TagsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should fetch all tags', (done) => {
      service.getAll().subscribe(tags => {
        expect(tags).toEqual(mockTags);
        expect(tags.length).toBe(5);
        done();
      });

      const req = httpMock.expectOne('/tags');
      expect(req.request.method).toBe('GET');
      req.flush({ tags: mockTags });
    });

    it('should extract tags array from response wrapper', (done) => {
      service.getAll().subscribe(tags => {
        expect(Array.isArray(tags)).toBe(true);
        expect((tags as any).tags).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: mockTags });
    });

    it('should handle empty tags list', (done) => {
      service.getAll().subscribe(tags => {
        expect(tags).toEqual([]);
        expect(tags.length).toBe(0);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: [] });
    });

    it('should handle single tag', (done) => {
      const singleTag = ['angular'];

      service.getAll().subscribe(tags => {
        expect(tags).toEqual(singleTag);
        expect(tags.length).toBe(1);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: singleTag });
    });

    it('should handle many tags', (done) => {
      const manyTags = Array.from({ length: 100 }, (_, i) => `tag${i}`);

      service.getAll().subscribe(tags => {
        expect(tags.length).toBe(100);
        expect(tags[0]).toBe('tag0');
        expect(tags[99]).toBe('tag99');
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: manyTags });
    });

    it('should handle tags with special characters', (done) => {
      const specialTags = ['c++', 'c#', 'node.js', 'vue.js', 'asp.net'];

      service.getAll().subscribe(tags => {
        expect(tags).toEqual(specialTags);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: specialTags });
    });

    it('should handle tags with hyphens', (done) => {
      const hyphenatedTags = ['web-development', 'machine-learning', 'test-driven-development'];

      service.getAll().subscribe(tags => {
        expect(tags).toEqual(hyphenatedTags);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: hyphenatedTags });
    });

    it('should handle tags with underscores', (done) => {
      const underscoredTags = ['web_dev', 'unit_testing', 'code_review'];

      service.getAll().subscribe(tags => {
        expect(tags).toEqual(underscoredTags);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: underscoredTags });
    });

    it('should handle tags with numbers', (done) => {
      const numberedTags = ['angular17', 'vue3', 'react18', 'node20'];

      service.getAll().subscribe(tags => {
        expect(tags).toEqual(numberedTags);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: numberedTags });
    });

    it('should handle mixed case tags', (done) => {
      const mixedCaseTags = ['Angular', 'TypeScript', 'JavaScript', 'RxJS'];

      service.getAll().subscribe(tags => {
        expect(tags).toEqual(mixedCaseTags);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: mixedCaseTags });
    });

    it('should handle tags with spaces', (done) => {
      const spacedTags = ['web development', 'machine learning', 'data science'];

      service.getAll().subscribe(tags => {
        expect(tags).toEqual(spacedTags);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: spacedTags });
    });

    it('should handle duplicate tags', (done) => {
      const duplicateTags = ['angular', 'angular', 'typescript', 'typescript'];

      service.getAll().subscribe(tags => {
        expect(tags).toEqual(duplicateTags);
        expect(tags.length).toBe(4);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: duplicateTags });
    });

    it('should handle very long tag names', (done) => {
      const longTag = 'a'.repeat(100);
      const longTags = [longTag];

      service.getAll().subscribe(tags => {
        expect(tags[0]).toBe(longTag);
        expect(tags[0].length).toBe(100);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: longTags });
    });

    it('should handle unicode characters in tags', (done) => {
      const unicodeTags = ['日本語', '中文', 'español', 'français', '한국어'];

      service.getAll().subscribe(tags => {
        expect(tags).toEqual(unicodeTags);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: unicodeTags });
    });

    it('should handle emoji in tags', (done) => {
      const emojiTags = ['🚀 rocket', '💻 coding', '🎨 design', '📱 mobile'];

      service.getAll().subscribe(tags => {
        expect(tags).toEqual(emojiTags);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: emojiTags });
    });

    it('should handle server error', (done) => {
      const errorResponse = { status: 500, statusText: 'Server Error' };

      service.getAll().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        }
      });

      const req = httpMock.expectOne('/tags');
      req.flush('Server error', errorResponse);
    });

    it('should handle network error', (done) => {
      const errorResponse = { status: 0, statusText: 'Network Error' };

      service.getAll().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(0);
          done();
        }
      });

      const req = httpMock.expectOne('/tags');
      req.flush('Network error', errorResponse);
    });

    it('should handle timeout error', (done) => {
      const errorResponse = { status: 504, statusText: 'Gateway Timeout' };

      service.getAll().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(504);
          done();
        }
      });

      const req = httpMock.expectOne('/tags');
      req.flush('Timeout', errorResponse);
    });

    it('should handle unauthorized access', (done) => {
      const errorResponse = { status: 401, statusText: 'Unauthorized' };

      service.getAll().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          done();
        }
      });

      const req = httpMock.expectOne('/tags');
      req.flush('Unauthorized', errorResponse);
    });

    it('should handle forbidden access', (done) => {
      const errorResponse = { status: 403, statusText: 'Forbidden' };

      service.getAll().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(403);
          done();
        }
      });

      const req = httpMock.expectOne('/tags');
      req.flush('Forbidden', errorResponse);
    });

    it('should handle not found error', (done) => {
      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.getAll().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne('/tags');
      req.flush('Not found', errorResponse);
    });

    it('should make only one HTTP request', () => {
      service.getAll().subscribe();

      const requests = httpMock.match('/tags');
      expect(requests.length).toBe(1);

      requests[0].flush({ tags: mockTags });
    });

    it('should handle multiple subscribers', () => {
      const observable = service.getAll();

      observable.subscribe();
      observable.subscribe();
      observable.subscribe();

      // Each subscription makes a new request (no shareReplay)
      const requests = httpMock.match('/tags');
      expect(requests.length).toBe(3);

      requests.forEach(req => req.flush({ tags: mockTags }));
    });

    it('should return observable that completes', (done) => {
      service.getAll().subscribe({
        next: (tags) => {
          expect(tags).toEqual(mockTags);
        },
        complete: () => {
          expect(true).toBe(true);
          done();
        }
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: mockTags });
    });

    it('should handle malformed response', (done) => {
      service.getAll().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeDefined();
          done();
        }
      });

      const req = httpMock.expectOne('/tags');
      req.flush('invalid json', { status: 200, statusText: 'OK' });
    });

    it('should handle null tags in response', (done) => {
      service.getAll().subscribe(tags => {
        expect(tags).toBeNull();
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: null });
    });

    it('should handle undefined tags in response', (done) => {
      service.getAll().subscribe(tags => {
        expect(tags).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: undefined });
    });

    it('should handle response without tags property', (done) => {
      service.getAll().subscribe(tags => {
        expect(tags).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({});
    });
  });

  describe('Integration scenarios', () => {
    it('should fetch tags multiple times', (done) => {
      let callCount = 0;

      const subscription1 = service.getAll().subscribe(tags => {
        expect(tags).toEqual(mockTags);
        callCount++;

        if (callCount === 2) {
          done();
        }
      });

      const req1 = httpMock.expectOne('/tags');
      req1.flush({ tags: mockTags });

      subscription1.add(() => {
        const subscription2 = service.getAll().subscribe(tags => {
          expect(tags).toEqual(mockTags);
          callCount++;
        });

        const req2 = httpMock.expectOne('/tags');
        req2.flush({ tags: mockTags });
      });
    });

    it('should handle rapid successive calls', () => {
      for (let i = 0; i < 5; i++) {
        service.getAll().subscribe();
      }

      const requests = httpMock.match('/tags');
      expect(requests.length).toBe(5);

      requests.forEach(req => req.flush({ tags: mockTags }));
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string tags', (done) => {
      const emptyStringTags = ['', 'angular', '', 'typescript'];

      service.getAll().subscribe(tags => {
        expect(tags).toEqual(emptyStringTags);
        expect(tags[0]).toBe('');
        expect(tags[2]).toBe('');
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: emptyStringTags });
    });

    it('should handle tags with only whitespace', (done) => {
      const whitespaceTags = ['   ', '\t', '\n', 'valid'];

      service.getAll().subscribe(tags => {
        expect(tags).toEqual(whitespaceTags);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: whitespaceTags });
    });

    it('should handle tags with special URL characters', (done) => {
      const urlCharTags = ['tag&param', 'tag?query', 'tag#hash', 'tag/path'];

      service.getAll().subscribe(tags => {
        expect(tags).toEqual(urlCharTags);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: urlCharTags });
    });

    it('should handle tags with quotes', (done) => {
      const quotedTags = ['"quoted"', "'single'", 'normal'];

      service.getAll().subscribe(tags => {
        expect(tags).toEqual(quotedTags);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: quotedTags });
    });

    it('should handle tags with backslashes', (done) => {
      const backslashTags = ['tag\\with\\backslash', 'normal'];

      service.getAll().subscribe(tags => {
        expect(tags).toEqual(backslashTags);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: backslashTags });
    });
  });

  describe('Performance', () => {
    it('should handle large number of tags efficiently', (done) => {
      const largeTags = Array.from({ length: 1000 }, (_, i) => `tag${i}`);

      service.getAll().subscribe(tags => {
        expect(tags.length).toBe(1000);
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: largeTags });
    });

    it('should handle very long tag list', (done) => {
      const veryLongTags = Array.from({ length: 10000 }, (_, i) => `tag${i}`);

      service.getAll().subscribe(tags => {
        expect(tags.length).toBe(10000);
        expect(tags[0]).toBe('tag0');
        expect(tags[9999]).toBe('tag9999');
        done();
      });

      const req = httpMock.expectOne('/tags');
      req.flush({ tags: veryLongTags });
    });
  });
});
