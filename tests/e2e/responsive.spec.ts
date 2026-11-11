import { test, expect } from '@playwright/test';

test.describe('Responsive Foundation & Viewport Tests', () => {
  test('renders canvas and HTML UI header without errors', async ({ page }) => {
    await page.goto('/');

    // Check title and canvas container
    await expect(page).toHaveTitle(/2D Game Starter Release v0.1.0/);
    const canvasContainer = page.locator('#game-container');
    await expect(canvasContainer).toBeVisible();

    // Verify HTML overlay header
    const titleEl = page.locator('#ui-game-title');
    await expect(titleEl).toHaveText(/2D GAME STARTER/);

    const platformBadge = page.locator('#ui-platform-badge');
    await expect(platformBadge).toBeVisible();

    // Verify orientation state based on current viewport
    const viewport = page.viewportSize();
    const isPortrait = viewport ? viewport.height > viewport.width : false;
    const orientationWarning = page.locator('#orientation-warning');

    if (isPortrait) {
      await expect(orientationWarning).toBeVisible();
    } else {
      await expect(orientationWarning).toHaveClass(/hidden/);
    }
  });

  test('handles portrait orientation warning on mobile viewport', async ({ page }) => {
    // Set viewport to mobile portrait
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Orientation warning should be visible in portrait mode
    const orientationWarning = page.locator('#orientation-warning');
    await expect(orientationWarning).toBeVisible();
    await expect(orientationWarning).toContainText('PLEASE ROTATE YOUR DEVICE');

    // Rotate to landscape
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(200);

    // Warning should now be hidden
    await expect(orientationWarning).toHaveClass(/hidden/);
  });

  test('toggles HTML UI fullscreen button safely', async ({ page }) => {
    // Ensure landscape view so orientation overlay does not intercept pointer
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    const fullscreenBtn = page.locator('#ui-fullscreen-btn');
    await expect(fullscreenBtn).toBeVisible();
    await fullscreenBtn.click();
    // Test passes if click triggers without throwing unhandled exceptions
  });
});
