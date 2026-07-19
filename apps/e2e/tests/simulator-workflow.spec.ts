import { test, expect } from '@playwright/test';

test.describe('OpenRFID Simulator System Integration Workflow', () => {
  test('Complete End-to-End Simulation Workflow', async ({ page }) => {
    // 1. Load Web Console
    await page.goto('/');
    await expect(page).toHaveTitle(/OpenRFID Simulator/);

    // 2. Navigate to Readers Management
    await page.click('text=Readers');
    await expect(page.locator('h2')).toContainText('Virtual Readers');

    // 3. Add a New Reader
    const readerInput = page.locator('input[placeholder="Reader Name..."]');
    await readerInput.fill('E2E Automated Reader');
    await page.click('button:has-text("Add Reader")');

    // Verify Reader Card is rendered
    await expect(page.locator('text=E2E Automated Reader')).toBeVisible();

    // 4. Navigate to Tags Management
    await page.click('text=Tags');
    await expect(page.locator('h2')).toContainText('Simulated RFID Tags');

    // 5. Generate Tag Batch
    await page.fill('input[type="number"]', '5');
    await page.click('button:has-text("Generate Tags")');
    
    // Verify tags in table
    const tagTableRows = page.locator('tbody tr');
    await expect(tagTableRows).toHaveCount(5);

    // 6. Return to Readers & Start Simulation
    await page.click('text=Readers');
    const startButton = page.locator('button:has-text("Start Simulation")').first();
    if (await startButton.isVisible()) {
      await startButton.click();
      await expect(page.locator('text=ONLINE').first()).toBeVisible();
    }

    // 7. View Event Monitor
    await page.click('text=Event Monitor');
    await expect(page.locator('h2')).toContainText('Live Event Stream');
  });
});
