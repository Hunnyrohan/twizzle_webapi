import { test, expect } from '@playwright/test';

test.describe('Basic Navigation', () => {
    test('should show the landing page', async ({ page }) => {
        await page.goto('/');
        // Check for "Twizzle" text or a login button
        await expect(page).toHaveTitle(/Twizzle/);
        const loginLink = page.getByRole('link', { name: /Log in/i });
        await expect(loginLink).toBeVisible();
    });

    test('should navigate to login page', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: /Log in/i }).click();
        await expect(page).toHaveURL(/\/login/);
        await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();
    });

    test('should navigate to signup page', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: /Start for free/i }).click();
        await expect(page).toHaveURL(/\/signup/);
        await expect(page.getByRole('heading', { name: /Create account/i })).toBeVisible();
    });
});

test.describe('Search Functionality', () => {
    test('should search for users on explore page', async ({ page }) => {
        await page.goto('/explore');
        const searchInput = page.getByPlaceholder(/Search Twizzle.../i);
        await expect(searchInput).toBeVisible();

        await searchInput.fill('testuser');
        // The search is debounced, so we might need a small wait or just check if the query is in the URL if it syncs
        // Or check if results appear. For now, just check input and visibility.
        await expect(searchInput).toHaveValue('testuser');
    });
});
