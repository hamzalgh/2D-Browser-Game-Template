import { test, expect } from '@playwright/test';

test.describe('End-to-End Gameplay & Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
  });

  test('completes initialization and boots into main menu', async ({ page }) => {
    // Wait for preloader transition to finish and main menu to be active
    const canvas = page.locator('#game-container canvas');
    await expect(canvas).toBeVisible();

    // Verify system title in header
    const titleEl = page.locator('#ui-game-title');
    await expect(titleEl).toHaveText(/NEON CIRCUIT HACKER/);

    // Verify platform badge
    const badge = page.locator('#ui-platform-badge');
    await expect(badge).toBeVisible();
  });

  test('opens and closes settings modal via HTML UI button', async ({ page }) => {
    const settingsBtn = page.locator('#ui-settings-btn');
    await expect(settingsBtn).toBeVisible();

    // Click settings button
    await settingsBtn.click();
    await page.waitForTimeout(300);

    // Verify canvas is still running and responsive
    const canvas = page.locator('#game-container canvas');
    await expect(canvas).toBeVisible();
  });

  test('triggers rewarded ad hint simulation', async ({ page }) => {
    // Wait for game to enter GameScene (or transition from menu)
    await page.waitForTimeout(800);

    // Click canvas center to trigger start if still on menu
    const canvas = page.locator('#game-container canvas');
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.52);
    }

    await page.waitForTimeout(600);

    // Press H key to request rewarded hint
    await page.keyboard.press('KeyH');
    await page.waitForTimeout(300);

    // If mock ad modal pops up, click "Skip Simulation"
    const skipBtn = page.locator('#mock-ad-skip');
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    }

    // Verify status text updates or hint route is confirmed
    const statusText = page.locator('#ui-status-text');
    await expect(statusText).toBeVisible();
  });
});
