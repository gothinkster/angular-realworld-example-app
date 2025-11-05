import { Page } from '@playwright/test';

export async function followUser(page: Page, username: string) {
  await page.goto(`/profile/${username}`, { waitUntil: 'load' });
  // Wait for profile page to load and Follow button to appear
  await page.waitForSelector('button:has-text("Follow")', { timeout: 10000 });
  await page.click('button:has-text("Follow")');
}

export async function unfollowUser(page: Page, username: string) {
  await page.goto(`/profile/${username}`, { waitUntil: 'load' });
  // Wait for profile page to load and Unfollow button to appear
  await page.waitForSelector('button:has-text("Unfollow")', { timeout: 10000 });
  await page.click('button:has-text("Unfollow")');
}

export async function updateProfile(
  page: Page,
  updates: {
    image?: string;
    username?: string;
    bio?: string;
    email?: string;
    password?: string;
  },
) {
  await page.goto('/settings', { waitUntil: 'load' });

  if (updates.image) {
    await page.fill('input[formControlName="image"]', updates.image);
  }
  if (updates.username) {
    await page.fill('input[formControlName="username"]', updates.username);
  }
  if (updates.bio) {
    await page.fill('textarea[formControlName="bio"]', updates.bio);
  }
  if (updates.email) {
    await page.fill('input[formControlName="email"]', updates.email);
  }
  if (updates.password) {
    await page.fill('input[formControlName="password"]', updates.password);
  }

  // Click submit and wait for API call to complete, then navigation
  await Promise.all([
    page.waitForResponse(response => response.url().includes('/user') && response.request().method() === 'PUT'),
    page.waitForURL(url => !url.toString().includes('/settings')),
    page.click('button[type="submit"]'),
  ]);
}
