import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentsService } from './comments.service';
import { Comment } from '../models/comment.model';

describe('CommentsService', () => {
  let service: CommentsService;
  let httpMock: HttpTestingController;

  const mockComment: Comment = {
    id: '1',
    body: 'Test comment',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-02',
    author: {
      username: 'testuser',
      bio: 'Test bio',
      image: 'https://example.com/avatar.jpg',
      following: false
    }
  };

  const mockComments: Comment[] = [
    mockComment,
    {
      ...mockComment,
      id: '2',
      body: 'Second comment'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentsService]
    });

    service = TestBed.inject(CommentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should fetch all comments for an article', (done) => {
      const slug = 'test-article';

      service.getAll(slug).subscribe(comments => {
        expect(comments).toEqual(mockComments);
        expect(comments.length).toBe(2);
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      expect(req.request.method).toBe('GET');
      req.flush({ comments: mockComments });
    });

    it('should extract comments array from response wrapper', (done) => {
      const slug = 'test-article';

      service.getAll(slug).subscribe(comments => {
        expect(Array.isArray(comments)).toBe(true);
        expect((comments as any).comments).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush({ comments: mockComments });
    });

    it('should handle empty comments list', (done) => {
      const slug = 'article-no-comments';

      service.getAll(slug).subscribe(comments => {
        expect(comments).toEqual([]);
        expect(comments.length).toBe(0);
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush({ comments: [] });
    });

    it('should handle article not found', (done) => {
      const slug = 'nonexistent';
      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.getAll(slug).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush('Article not found', errorResponse);
    });

    it('should handle slug with special characters', () => {
      const slug = 'article-with-special-chars-123';

      service.getAll(slug).subscribe();

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush({ comments: mockComments });
    });

    it('should handle comments with null author bio', (done) => {
      const slug = 'test-article';
      const commentsWithNullBio = mockComments.map(c => ({
        ...c,
        author: { ...c.author, bio: null }
      }));

      service.getAll(slug).subscribe(comments => {
        expect(comments[0].author.bio).toBeNull();
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush({ comments: commentsWithNullBio });
    });

    it('should handle very long comment body', (done) => {
      const slug = 'test-article';
      const longBody = 'a'.repeat(1000);
      const commentWithLongBody = { ...mockComment, body: longBody };

      service.getAll(slug).subscribe(comments => {
        expect(comments[0].body).toBe(longBody);
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush({ comments: [commentWithLongBody] });
    });

    it('should handle server error', (done) => {
      const slug = 'test-article';
      const errorResponse = { status: 500, statusText: 'Server Error' };

      service.getAll(slug).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        }
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush('Server error', errorResponse);
    });

    it('should handle multiple comments from different authors', (done) => {
      const slug = 'popular-article';
      const multiAuthorComments: Comment[] = [
        mockComment,
        {
          ...mockComment,
          id: '2',
          author: { ...mockComment.author, username: 'anotheruser' }
        },
        {
          ...mockComment,
          id: '3',
          author: { ...mockComment.author, username: 'thirduser' }
        }
      ];

      service.getAll(slug).subscribe(comments => {
        expect(comments.length).toBe(3);
        expect(comments[0].author.username).toBe('testuser');
        expect(comments[1].author.username).toBe('anotheruser');
        expect(comments[2].author.username).toBe('thirduser');
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush({ comments: multiAuthorComments });
    });
  });

  describe('add', () => {
    it('should add a new comment to an article', (done) => {
      const slug = 'test-article';
      const commentBody = 'This is a new comment';

      service.add(slug, commentBody).subscribe(comment => {
        expect(comment.body).toBe(commentBody);
        expect(comment.id).toBeDefined();
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ comment: { body: commentBody } });
      req.flush({ comment: { ...mockComment, body: commentBody } });
    });

    it('should extract comment from response wrapper', (done) => {
      const slug = 'test-article';
      const commentBody = 'Test comment';

      service.add(slug, commentBody).subscribe(comment => {
        expect((comment as any).comment).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush({ comment: mockComment });
    });

    it('should handle empty comment body', (done) => {
      const slug = 'test-article';
      const emptyBody = '';
      const errorResponse = { status: 422, statusText: 'Unprocessable Entity' };

      service.add(slug, emptyBody).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(422);
          done();
        }
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush('Comment body cannot be empty', errorResponse);
    });

    it('should handle very long comment', (done) => {
      const slug = 'test-article';
      const longComment = 'a'.repeat(5000);

      service.add(slug, longComment).subscribe(comment => {
        expect(comment.body).toBe(longComment);
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush({ comment: { ...mockComment, body: longComment } });
    });

    it('should handle unauthorized comment', (done) => {
      const slug = 'test-article';
      const commentBody = 'Unauthorized comment';
      const errorResponse = { status: 401, statusText: 'Unauthorized' };

      service.add(slug, commentBody).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          done();
        }
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush('Must be logged in', errorResponse);
    });

    it('should handle article not found', (done) => {
      const slug = 'nonexistent';
      const commentBody = 'Comment on nonexistent article';
      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.add(slug, commentBody).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush('Article not found', errorResponse);
    });

    it('should send correct request body format', () => {
      const slug = 'test-article';
      const commentBody = 'Test';

      service.add(slug, commentBody).subscribe();

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      expect(req.request.body).toEqual({
        comment: {
          body: commentBody
        }
      });
      req.flush({ comment: mockComment });
    });

    it('should handle comment with special characters', (done) => {
      const slug = 'test-article';
      const specialComment = 'Comment with émojis 🚀 and special chars!@#$%';

      service.add(slug, specialComment).subscribe(comment => {
        expect(comment.body).toBe(specialComment);
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush({ comment: { ...mockComment, body: specialComment } });
    });

    it('should handle comment with newlines', (done) => {
      const slug = 'test-article';
      const multilineComment = 'Line 1\nLine 2\nLine 3';

      service.add(slug, multilineComment).subscribe(comment => {
        expect(comment.body).toBe(multilineComment);
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush({ comment: { ...mockComment, body: multilineComment } });
    });
  });

  describe('delete', () => {
    it('should delete a comment', (done) => {
      const slug = 'test-article';
      const commentId = '123';

      service.delete(commentId, slug).subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments/${commentId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle comment not found', (done) => {
      const slug = 'test-article';
      const commentId = 'nonexistent';
      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.delete(commentId, slug).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments/${commentId}`);
      req.flush('Comment not found', errorResponse);
    });

    it('should handle unauthorized delete', (done) => {
      const slug = 'test-article';
      const commentId = '123';
      const errorResponse = { status: 403, statusText: 'Forbidden' };

      service.delete(commentId, slug).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(403);
          done();
        }
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments/${commentId}`);
      req.flush('Cannot delete this comment', errorResponse);
    });

    it('should handle unauthenticated delete', (done) => {
      const slug = 'test-article';
      const commentId = '123';
      const errorResponse = { status: 401, statusText: 'Unauthorized' };

      service.delete(commentId, slug).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          done();
        }
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments/${commentId}`);
      req.flush('Must be logged in', errorResponse);
    });

    it('should handle numeric comment ID', () => {
      const slug = 'test-article';
      const commentId = '456';

      service.delete(commentId, slug).subscribe();

      const req = httpMock.expectOne(`/articles/${slug}/comments/${commentId}`);
      req.flush(null);
    });

    it('should handle UUID comment ID', () => {
      const slug = 'test-article';
      const commentId = '550e8400-e29b-41d4-a716-446655440000';

      service.delete(commentId, slug).subscribe();

      const req = httpMock.expectOne(`/articles/${slug}/comments/${commentId}`);
      req.flush(null);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle add then delete sequence', (done) => {
      const slug = 'test-article';
      const commentBody = 'Test comment';

      service.add(slug, commentBody).subscribe(comment => {
        expect(comment.body).toBe(commentBody);

        service.delete(comment.id, slug).subscribe(() => {
          expect(true).toBe(true);
          done();
        });

        const deleteReq = httpMock.expectOne(`/articles/${slug}/comments/${comment.id}`);
        deleteReq.flush(null);
      });

      const addReq = httpMock.expectOne(`/articles/${slug}/comments`);
      addReq.flush({ comment: mockComment });
    });

    it('should handle getAll then add sequence', (done) => {
      const slug = 'test-article';
      const commentBody = 'New comment';

      service.getAll(slug).subscribe(comments => {
        expect(comments.length).toBe(2);

        service.add(slug, commentBody).subscribe(newComment => {
          expect(newComment.body).toBe(commentBody);
          done();
        });

        const addReq = httpMock.expectOne(`/articles/${slug}/comments`);
        addReq.flush({ comment: { ...mockComment, body: commentBody } });
      });

      const getAllReq = httpMock.expectOne(`/articles/${slug}/comments`);
      getAllReq.flush({ comments: mockComments });
    });

    it('should handle multiple operations on same article', (done) => {
      const slug = 'test-article';

      service.getAll(slug).subscribe(comments => {
        expect(comments.length).toBe(2);

        service.add(slug, 'New comment').subscribe(() => {
          service.getAll(slug).subscribe(updatedComments => {
            expect(updatedComments.length).toBe(3);
            done();
          });

          const getReq2 = httpMock.expectOne(`/articles/${slug}/comments`);
          getReq2.flush({ comments: [...mockComments, mockComment] });
        });

        const addReq = httpMock.expectOne(`/articles/${slug}/comments`);
        addReq.flush({ comment: mockComment });
      });

      const getReq1 = httpMock.expectOne(`/articles/${slug}/comments`);
      getReq1.flush({ comments: mockComments });
    });
  });

  describe('Edge cases', () => {
    it('should handle comment with only whitespace', (done) => {
      const slug = 'test-article';
      const whitespaceComment = '   ';
      const errorResponse = { status: 422, statusText: 'Unprocessable Entity' };

      service.add(slug, whitespaceComment).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(422);
          done();
        }
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush('Comment cannot be empty', errorResponse);
    });

    it('should handle comment with HTML tags', (done) => {
      const slug = 'test-article';
      const htmlComment = '<script>alert("xss")</script>';

      service.add(slug, htmlComment).subscribe(comment => {
        expect(comment.body).toBe(htmlComment);
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush({ comment: { ...mockComment, body: htmlComment } });
    });

    it('should handle comment with markdown', (done) => {
      const slug = 'test-article';
      const markdownComment = '**Bold** and *italic* text';

      service.add(slug, markdownComment).subscribe(comment => {
        expect(comment.body).toBe(markdownComment);
        done();
      });

      const req = httpMock.expectOne(`/articles/${slug}/comments`);
      req.flush({ comment: { ...mockComment, body: markdownComment } });
    });
  });
});
