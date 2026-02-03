import { test, expect } from '@playwright/test';

test('homepage has correct title and renders correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Check for the correct title
  await expect(page).toHaveTitle(/BANYAMULENGE YOUTH KENYA/);

  // Check for the presence of the Navbar
  const navbar = page.locator('nav');
  await expect(navbar).toBeVisible();

  // Check for the logo in the Navbar
  const logo = navbar.locator('img[alt="BANYAMULENGE YOUTH KENYA Logo"]');
  await expect(logo).toBeVisible();
});
