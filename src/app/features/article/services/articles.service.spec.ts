import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArticlesService } from './articles.service';
import { Article } from '../models/article.model';
import { ArticleListConfig } from '../models/article-list-config.model';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let httpMock: HttpTestingController;

  const mockArticle: Article = {
    slug: 'test-article',
    title: 'Test Article',
    description: 'Test description',
    body: 'Test body content',
    tagList: ['test', 'angular'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-02',
    favorited: false,
    favoritesCount: 5,
    author: {
      username: 'testuser',
      bio: 'Test bio',
      image: 'https://example.com/avatar.jpg',
      following: false
    }
  };

  const mockArticleList: Article[] = [
    mockArticle,
    {
      ...mockArticle,
      slug: 'second-article',
      title: 'Second Article'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArticlesService]
    });

    service = TestBed.inject(ArticlesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('query', () => {
    it('should fetch articles with default config', () => {
      const config: ArticleListConfig = {
        type: 'all',
        filters: {}
      };

      service.query(config).subscribe(response => {
        expect(response.articles).toEqual(mockArticleList);
        expect(response.articlesCount).toBe(2);
      });

      const req = httpMock.expectOne('/articles');
      expect(req.request.method).toBe('GET');
      req.flush({ articles: mockArticleList, articlesCount: 2 });
    });

    it('should fetch feed articles when type is feed', () => {
      const config: ArticleListConfig = {
        type: 'feed',
        filters: {}
      };

      service.query(config).subscribe();

      const req = httpMock.expectOne('/articles/feed');
      expect(req.request.method).toBe('GET');
      req.flush({ articles: mockArticleList, articlesCount: 2 });
    });

    it('should include query parameters from filters', () => {
      const config: ArticleListConfig = {
        type: 'all',
        filters: {
          tag: 'angular',
          author: 'testuser',
          limit: 10,
          offset: 0
        }
      };

      service.query(config).subscribe();

      const req = httpMock.expectOne(request => {
        return request.url === '/articles' &&
               request.params.get('tag') === 'angular' &&
               request.params.get('author') === 'testuser' &&
               request.params.get('limit') === '10' &&
               request.params.get('offset') === '0';
      });
      
      expect(req.request.method).toBe('GET');
      req.flush({ articles: mockArticleList, articlesCount: 2 });
    });

    it('should handle pagination parameters', () => {
      const config: ArticleListConfig = {
        type: 'all',
        filters: {
          limit: 20,
          offset: 40
        }
      };

      service.query(config).subscribe();

      const req = httpMock.expectOne(request => {
        return request.url === '/articles' &&
               request.params.get('limit') === '20' &&
               request.params.get('offset') === '40';
      });
      
      req.flush({ articles: mockArticleList, articlesCount: 100 });
    });

    it('should handle empty results', () => {
      const config: ArticleListConfig = {
        type: 'all',
        filters: {}
      };

      service.query(config).subscribe(response => {
        expect(response.articles).toEqual([]);
        expect(response.articlesCount).toBe(0);
      });

      const req = httpMock.expectOne('/articles');
      req.flush({ articles: [], articlesCount: 0 });
    });
  });

  describe('get', () => {
    it('should fetch single article by slug', (done) => {
      const slug = 'test-article';

      service.get(slug).subscribe(article => {
        expect(article).toEqual(mockArticle);
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}`);
      expect(req.request.method).toBe('GET');
      req.flush({ article: mockArticle });
    });

    it('should handle article not found', (done) => {
      const slug = 'non-existent';
      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.get(slug).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`/articles/${slug}`);
      req.flush('Article not found', errorResponse);
    });
  });

  describe('delete', () => {
    it('should delete article by slug', (done) => {
      const slug = 'article-to-delete';

      service.delete(slug).subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle delete error', (done) => {
      const slug = 'protected-article';
      const errorResponse = { status: 403, statusText: 'Forbidden' };

      service.delete(slug).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(403);
          done();
        }
      });

      const req = httpMock.expectOne(`/articles/${slug}`);
      req.flush('Cannot delete', errorResponse);
    });
  });

  describe('create', () => {
    it('should create new article', (done) => {
      const newArticle: Partial<Article> = {
        title: 'New Article',
        description: 'New description',
        body: 'New body',
        tagList: ['new', 'test']
      };

      service.create(newArticle).subscribe(article => {
        expect(article.title).toBe(newArticle.title);
        done();
      });

      const req = httpMock.expectOne('/articles/');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ article: newArticle });
      
      req.flush({ article: { ...mockArticle, ...newArticle } });
    });

    it('should handle validation errors', (done) => {
      const invalidArticle: Partial<Article> = {
        title: '',
        description: '',
        body: ''
      };
      const errorResponse = { status: 422, statusText: 'Unprocessable Entity' };

      service.create(invalidArticle).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(422);
          done();
        }
      });

      const req = httpMock.expectOne('/articles/');
      req.flush('Validation failed', errorResponse);
    });
  });

  describe('update', () => {
    it('should update existing article', (done) => {
      const updates: Partial<Article> = {
        slug: 'existing-article',
        title: 'Updated Title',
        description: 'Updated description'
      };

      service.update(updates).subscribe(article => {
        expect(article.title).toBe(updates.title);
        done();
      });

      const req = httpMock.expectOne(`/articles/${updates.slug}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ article: updates });
      
      req.flush({ article: { ...mockArticle, ...updates } });
    });
  });

  describe('favorite', () => {
    it('should favorite an article', (done) => {
      const slug = 'article-to-favorite';

      service.favorite(slug).subscribe(article => {
        expect(article.favorited).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}/favorite`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      
      req.flush({ article: { ...mockArticle, favorited: true } });
    });
  });

  describe('unfavorite', () => {
    it('should unfavorite an article', (done) => {
      const slug = 'article-to-unfavorite';

      service.unfavorite(slug).subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}/favorite`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
