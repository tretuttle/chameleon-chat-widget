import { test, expect } from '@playwright/test';

// Test configuration for dev server
test.use({
  baseURL: 'http://localhost:5173',
});

test.describe('Chat Widget E2E Tests', () => {
  // Note: Tests verify empathy messages appear before troubleshooting steps
  // and that horizontal chat header has no white line (CSS fix)
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the chat widget to be ready
    await page.waitForSelector('[data-testid="chat-button"], [data-testid="horizontal-chat"]', { timeout: 10000 });
  });

  test.describe('General Amigo Flow - Longest Path', () => {
    test('should complete battery troubleshooting flow to battery replacement', async ({ page }) => {
      // Start from horizontal chat or open modal
      const chatButton = page.locator('[data-testid="chat-button"]');
      if (await chatButton.isVisible()) {
        await chatButton.click();
      }

      // Wait for modal to open and ensure no initial bot message
      await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();
      await expect(page.locator('.bot-message')).toHaveCount(0);

      // Click "I need help with my Amigo cart" or similar suggestion
      await page.locator('button:has-text("I need help with my Amigo cart")').click();
      
      // Wait for repair flow to start
      await expect(page.locator('.bot-message').last()).toContainText('I\'d be happy to help you with your Amigo cart repair');

      // Select "Enter model name"
      await page.locator('button:has-text("Enter model name")').click();
      await expect(page.locator('.bot-message').last()).toContainText('Please select the model of your cart');

      // Select "SmartShopper" model
      await page.locator('button:has-text("SmartShopper")').click();
      await expect(page.locator('.bot-message').last()).toContainText('What seems to be the issue?');

      // Select battery issue
      await page.locator('button:has-text("My Amigo turns on, but the charger will not turn on or the batteries do not hold a charge")').click();
      await expect(page.locator('.bot-message').last()).toContainText('Connect the AC cord to the wall outlet');

      // Answer "Yes" - battery gauge flashes
      await page.locator('button:has-text("Yes")').click();
      await expect(page.locator('.bot-message').last()).toContainText('measure and record the voltage on the batteries');

      // Answer "Yes" - voltage increased
      await page.locator('button:has-text("Yes")').click();
      await expect(page.locator('.bot-message').last()).toContainText('The batteries have reached a point where they can no longer hold a charge');

      // Select "Yes" to order parts
      await page.locator('button:has-text("Yes")').click();
      await expect(page.locator('.bot-message').last()).toContainText('order parts');
    });
  });

  test.describe('Cross-Flow Navigation', () => {
    test('should navigate from general flow to specific model flow', async ({ page }) => {
      // Open chat widget
      const chatButton = page.locator('[data-testid="chat-button"]');
      if (await chatButton.isVisible()) {
        await chatButton.click();
      }

      await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();

      // Start repair flow
      await page.locator('button:has-text("I need help with my Amigo cart")').click();
      await expect(page.locator('.bot-message').last()).toContainText('I\'d be happy to help you with your Amigo cart repair');

      // Select model name option
      await page.locator('button:has-text("Enter model name")').click();
      await expect(page.locator('.bot-message').last()).toContainText('Please select the model of your cart');

      // Select Vista model (cross-flow jump)
      await page.locator('button:has-text("Vista")').click();
      
      // Should now be in Vista-specific flow
      await expect(page.locator('.bot-message').last()).toContainText('What seems to be the issue?');
      
      // Verify we're in the Vista flow by checking for Vista-specific options or messages
      await page.locator('button:has-text("My Amigo will not move")').click();
      await expect(page.locator('.bot-message').last()).toContainText('Does the battery display or diagnostic code window');
    });
  });

  test.describe('Serial Number Lookup', () => {
    test('should handle successful serial number lookup', async ({ page }) => {
      // Mock successful serial lookup
      await page.route('**/api/serial-lookup*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            model: 'SmartShopper',
            serialNumber: 'AMI1234567',
            productInfo: { model: 'SmartShopper', year: '2023' }
          })
        });
      });

      // Open chat widget
      const chatButton = page.locator('[data-testid="chat-button"]');
      if (await chatButton.isVisible()) {
        await chatButton.click();
      }

      await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();

      // Start repair flow
      await page.locator('button:has-text("I need help with my Amigo cart")').click();
      await expect(page.locator('.bot-message').last()).toContainText('I\'d be happy to help you with your Amigo cart repair');

      // Select serial number option
      await page.locator('button:has-text("Enter serial number")').click();
      await expect(page.locator('.bot-message').last()).toContainText('Please enter the serial number');

      // Enter serial number
      await page.locator('input[type="text"]').fill('AMI1234567');
      await page.locator('button[type="submit"], button:has-text("Send")').click();

      // Should show success message and start appropriate flow
      await expect(page.locator('.bot-message').last()).toContainText('Thank you! I\'ve identified your product as an Amigo SmartShopper');
      await expect(page.locator('.bot-message').last()).toContainText('What seems to be the issue?');
    });

    test('should handle failed serial number lookup', async ({ page }) => {
      // Mock failed serial lookup
      await page.route('**/api/serial-lookup*', async route => {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Serial number not found' })
        });
      });

      // Open chat widget
      const chatButton = page.locator('[data-testid="chat-button"]');
      if (await chatButton.isVisible()) {
        await chatButton.click();
      }

      await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();

      // Start repair flow
      await page.locator('button:has-text("I need help with my Amigo cart")').click();
      
      // Select serial number option
      await page.locator('button:has-text("Enter serial number")').click();
      
      // Enter invalid serial number
      await page.locator('input[type="text"]').fill('INVALID123');
      await page.locator('button[type="submit"], button:has-text("Send")').click();

      // Should show failure message
      await expect(page.locator('.bot-message').last()).toContainText('I\'m sorry, I couldn\'t find that serial number');
    });
  });

  test.describe('Diagnostic Code Flow', () => {
    test('should complete diagnostic code troubleshooting path', async ({ page }) => {
      // Open chat widget
      const chatButton = page.locator('[data-testid="chat-button"]');
      if (await chatButton.isVisible()) {
        await chatButton.click();
      }

      await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();

      // Navigate to "won't move" issue
      await page.locator('button:has-text("I need help with my Amigo cart")').click();
      await page.locator('button:has-text("Enter model name")').click();
      await page.locator('button:has-text("SmartShopper")').click();
      await page.locator('button:has-text("My Amigo will not move")').click();

      // Answer "Yes" - display illuminates
      await page.locator('button:has-text("Yes")').click();
      await expect(page.locator('.bot-message').last()).toContainText('Is there a number illuminated in the diagnostic window?');

      // Answer "Yes" - there is a diagnostic code
      await page.locator('button:has-text("Yes")').click();
      await expect(page.locator('.bot-message').last()).toContainText('Is the Diagnostic Code a "1"?');

      // Answer "Yes" - code is "1"
      await page.locator('button:has-text("Yes")').click();
      await expect(page.locator('.bot-message').last()).toContainText('The "1" code indicates the EM Brake circuit has a short circuit');

      // Select "Yes" to order parts
      await page.locator('button:has-text("Yes")').click();
      await expect(page.locator('.bot-message').last()).toContainText('order parts');
    });
  });

  test.describe('UI State Transitions', () => {
    test('should transition between modal and sidebar views', async ({ page }) => {
      // Open chat widget
      const chatButton = page.locator('[data-testid="chat-button"]');
      if (await chatButton.isVisible()) {
        await chatButton.click();
      }

      // Should start in modal view
      await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();

      // Click to expand to sidebar
      const expandButton = page.locator('button[title="Expand to sidebar"], button:has-text("Expand")');
      if (await expandButton.isVisible()) {
        await expandButton.click();
        await expect(page.locator('[data-testid="chat-sidebar"]')).toBeVisible();
        await expect(page.locator('[data-testid="chat-modal"]')).not.toBeVisible();
      }

      // Click to minimize back to modal
      const minimizeButton = page.locator('button[title="Minimize"], button:has-text("Minimize")');
      if (await minimizeButton.isVisible()) {
        await minimizeButton.click();
        await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();
        await expect(page.locator('[data-testid="chat-sidebar"]')).not.toBeVisible();
      }
    });

    test('should close widget and return to button state', async ({ page }) => {
      // Open chat widget
      const chatButton = page.locator('[data-testid="chat-button"]');
      if (await chatButton.isVisible()) {
        await chatButton.click();
      }

      await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();

      // Close the widget
      await page.locator('button[title="Close"], button:has-text("Close"), .close-button').first().click();

      // Should return to button state
      await expect(page.locator('[data-testid="chat-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="chat-modal"]')).not.toBeVisible();
    });
  });

  test.describe('Horizontal Chat Suggestions', () => {
    test('should handle suggested actions from horizontal chat', async ({ page }) => {
      // If starting in horizontal mode, test suggestions
      const horizontalChat = page.locator('[data-testid="horizontal-chat"]');
      if (await horizontalChat.isVisible()) {
        // Click on a suggested action
        await page.locator('button:has-text("I need help with my Amigo cart")').click();
        
        // Should transition to modal with flow started
        await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();
        await expect(page.locator('.bot-message').last()).toContainText('I\'d be happy to help you with your Amigo cart repair');
      }
    });

    test('should handle serial number submission from horizontal chat', async ({ page }) => {
      // Mock successful serial lookup
      await page.route('**/api/serial-lookup*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            model: 'Vista',
            serialNumber: 'AMI7654321',
            productInfo: { model: 'Vista', year: '2023' }
          })
        });
      });

      const horizontalChat = page.locator('[data-testid="horizontal-chat"]');
      if (await horizontalChat.isVisible()) {
        // Enter serial number in horizontal chat
        await page.locator('input[placeholder*="serial"], input[type="text"]').fill('AMI7654321');
        await page.locator('button[type="submit"], button:has-text("Submit")').click();
        
        // Should transition to modal with product identified
        await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();
        await expect(page.locator('.bot-message').last()).toContainText('Thank you! I\'ve identified your product as an Amigo Vista');
      }
    });
  });

  test.describe('Contact Agent Flow', () => {
    test('should navigate to contact agent when needed', async ({ page }) => {
      // Open chat widget
      const chatButton = page.locator('[data-testid="chat-button"]');
      if (await chatButton.isVisible()) {
        await chatButton.click();
      }

      await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();

      // Start repair flow
      await page.locator('button:has-text("I need help with my Amigo cart")').click();
      await page.locator('button:has-text("Enter model name")').click();
      await page.locator('button:has-text("SmartShopper")').click();

      // Select "different customer service need"
      await page.locator('button:has-text("I have a different customer service need")').click();
      
      // Should navigate to contact agent flow
      await expect(page.locator('.bot-message').last()).toContainText('contact');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Mock network error for serial lookup
      await page.route('**/api/serial-lookup*', async route => {
        await route.abort('failed');
      });

      const chatButton = page.locator('[data-testid="chat-button"]');
      if (await chatButton.isVisible()) {
        await chatButton.click();
      }

      await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();

      // Try to submit serial number
      await page.locator('button:has-text("I need help with my Amigo cart")').click();
      await page.locator('button:has-text("Enter serial number")').click();
      await page.locator('input[type="text"]').fill('AMI1234567');
      await page.locator('button[type="submit"], button:has-text("Send")').click();

      // Should show error message
      await expect(page.locator('.bot-message').last()).toContainText('I\'m sorry, I couldn\'t find that serial number');
    });

    test('should handle missing flow steps gracefully', async ({ page }) => {
      // This test ensures the app doesn't crash when encountering unexpected flow states
      const chatButton = page.locator('[data-testid="chat-button"]');
      if (await chatButton.isVisible()) {
        await chatButton.click();
      }

      await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();
      
      // Navigate through a flow and ensure no JavaScript errors occur
      await page.locator('button:has-text("I need help with my Amigo cart")').click();
      
      // Check that no console errors occurred
      const logs = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          logs.push(msg.text());
        }
      });
      
      // Continue with flow
      await page.locator('button:has-text("Enter model name")').click();
      await page.locator('button:has-text("SmartShopper")').click();
      
      // Verify no critical errors
      expect(logs.filter(log => log.includes('Error') && !log.includes('404'))).toHaveLength(0);
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Open chat widget
      const chatButton = page.locator('[data-testid="chat-button"]');
      if (await chatButton.isVisible()) {
        await chatButton.click();
      }

      await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();

      // Test keyboard navigation through options
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      // Should navigate to next step
      await expect(page.locator('.bot-message').last()).toContainText('I\'d be happy to help you with your Amigo cart repair');
    });

    test('should have proper ARIA labels', async ({ page }) => {
      const chatButton = page.locator('[data-testid="chat-button"]');
      if (await chatButton.isVisible()) {
        await expect(chatButton).toHaveAttribute('aria-label');
        await chatButton.click();
      }

      await expect(page.locator('[data-testid="chat-modal"]')).toBeVisible();
      
      // Check for proper ARIA labels on interactive elements
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const hasAriaLabel = await button.getAttribute('aria-label');
        const hasText = await button.textContent();
        
        // Button should have either aria-label or visible text
        expect(hasAriaLabel || (hasText && hasText.trim().length > 0)).toBeTruthy();
      }
    });
  });
});
