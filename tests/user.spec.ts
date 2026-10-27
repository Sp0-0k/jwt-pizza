import { test, expect } from 'playwright-test-coverage';
import type { Page } from '@playwright/test';

// Several tests log in as the shared default admin, and the service only tracks one session per user.
test.describe.configure({ mode: 'serial' });

test('updateUser', async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.goto('/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('pizza diner');
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Register' }).click();

  await page.getByRole('link', { name: 'pd' }).click();

  await expect(page.getByRole('main')).toContainText('pizza diner');

  await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page.locator('h3')).toContainText('Edit user');
  await page.getByRole('textbox').first().fill('pizza dinerx');
  // preline ignores a close that arrives before the open transition has finished
  await expect(page.locator('#hs-jwt-modal')).toHaveClass(/opened/);
  await page.getByRole('button', { name: 'Update' }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

  await expect(page.getByRole('main')).toContainText('pizza dinerx');
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'pd' }).click();

  await expect(page.getByRole('main')).toContainText('pizza dinerx');
});

test('updatePassword', async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.goto('/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('pizza diner');
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Register' }).click();

  await page.getByRole('link', { name: 'pd' }).click();

  await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page.locator('h3')).toContainText('Edit user');
  await page.locator('#password').fill('newpassword');
  // preline ignores a close that arrives before the open transition has finished
  await expect(page.locator('#hs-jwt-modal')).toHaveClass(/opened/);
  await page.getByRole('button', { name: 'Update' }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('newpassword');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'pd' }).click();

  await expect(page.getByRole('main')).toContainText(email);
});

test('updateEmail', async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  const newEmail = `new${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.goto('/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('pizza diner');
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Register' }).click();

  await page.getByRole('link', { name: 'pd' }).click();

  await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page.locator('h3')).toContainText('Edit user');
  await page.getByRole('textbox').nth(1).fill(newEmail);
  // preline ignores a close that arrives before the open transition has finished
  await expect(page.locator('#hs-jwt-modal')).toHaveClass(/opened/);
  await page.getByRole('button', { name: 'Update' }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

  await expect(page.getByRole('main')).toContainText(newEmail);
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByRole('textbox', { name: 'Email address' }).fill(newEmail);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'pd' }).click();

  await expect(page.getByRole('main')).toContainText(newEmail);
});

test('updateUserAsAdmin', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: '常' }).click();
  await expect(page.getByRole('main')).toContainText('admin');

  await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page.locator('h3')).toContainText('Edit user');
  await page.getByRole('textbox').first().fill('常用名字x');
  // preline ignores a close that arrives before the open transition has finished
  await expect(page.locator('#hs-jwt-modal')).toHaveClass(/opened/);
  await page.getByRole('button', { name: 'Update' }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

  await expect(page.getByRole('main')).toContainText('常用名字x');
  await expect(page.getByRole('main')).toContainText('admin');

  // restore the shared default admin
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('textbox').first().fill('常用名字');
  // preline ignores a close that arrives before the open transition has finished
  await expect(page.locator('#hs-jwt-modal')).toHaveClass(/opened/);
  await page.getByRole('button', { name: 'Update' }).click();
  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

  await expect(page.getByRole('main')).not.toContainText('常用名字x');
});

test('updateUserAsFranchisee', async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.goto('/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('pizza franchisee');
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();

  // make the new user a franchisee using the admin account
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByPlaceholder('franchise name').fill(`franchise${Math.floor(Math.random() * 100000)}`);
  await page.getByPlaceholder('franchisee admin email').fill(email);
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'pf' }).click();
  await expect(page.getByRole('main')).toContainText('franchisee');

  await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page.locator('h3')).toContainText('Edit user');
  await page.getByRole('textbox').first().fill('pizza franchiseex');
  // preline ignores a close that arrives before the open transition has finished
  await expect(page.locator('#hs-jwt-modal')).toHaveClass(/opened/);
  await page.getByRole('button', { name: 'Update' }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

  await expect(page.getByRole('main')).toContainText('pizza franchiseex');
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'pf' }).click();

  await expect(page.getByRole('main')).toContainText('pizza franchiseex');
  await expect(page.getByRole('main')).toContainText('franchisee');
});

async function registerDiner(page: Page, name: string, email: string) {
  await page.goto('/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill(name);
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
}

async function loginAsAdminAndFilterUsers(page: Page, filter: string) {
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();

  await page.getByPlaceholder('Filter users').fill(filter);
  await page.getByRole('row').filter({ has: page.getByPlaceholder('Filter users') }).getByRole('button', { name: 'Submit' }).click();
}

// Removes a test user through the admin UI so the shared database does not fill up with fixtures.
// Expects to be logged in as the admin, on the admin dashboard.
async function deleteUserAsAdmin(page: Page, nameFilter: string, email: string) {
  await page.getByPlaceholder('Filter users').fill(nameFilter);
  await page.getByRole('row').filter({ has: page.getByPlaceholder('Filter users') }).getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('row').filter({ hasText: email }).getByRole('button', { name: 'Delete' }).click();
  await expect(page.locator('#hs-delete-user-modal')).toHaveClass(/opened/);
  await page.getByRole('dialog').getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByRole('row').filter({ hasText: email })).toHaveCount(0);
  await expect(page.getByRole('dialog')).toBeHidden();
}

// These tests register, log in and list users against the real service, which takes longer than the default.
test.describe('admin user management', () => {
  test.describe.configure({ timeout: 20000 });

  test('adminListsUsers', async ({ page }) => {
    const id = Math.floor(Math.random() * 100000);
    const email = `list${id}@jwt.com`;
    await registerDiner(page, `listed diner ${id}`, email);

    await loginAsAdminAndFilterUsers(page, `listed diner ${id}`);
    try {
      const row = page.getByRole('row').filter({ hasText: email });
      await expect(row).toHaveCount(1);
      await expect(row).toContainText(`listed diner ${id}`);
      await expect(row).toContainText('diner');
    } finally {
      await deleteUserAsAdmin(page, `listed diner ${id}`, email);
    }
    await page.getByRole('link', { name: 'Logout' }).click();
  });

  test('adminFiltersUsersByName', async ({ page }) => {
    const id = Math.floor(Math.random() * 100000);
    await registerDiner(page, `findme ${id}`, `findme${id}@jwt.com`);
    await registerDiner(page, `skipme ${id}`, `skipme${id}@jwt.com`);

    await loginAsAdminAndFilterUsers(page, `findme ${id}`);
    try {
      await expect(page.getByRole('row').filter({ hasText: `findme${id}@jwt.com` })).toHaveCount(1);
      await expect(page.getByRole('row').filter({ hasText: `skipme${id}@jwt.com` })).toHaveCount(0);
    } finally {
      await deleteUserAsAdmin(page, `findme ${id}`, `findme${id}@jwt.com`);
      await deleteUserAsAdmin(page, `skipme ${id}`, `skipme${id}@jwt.com`);
    }
    await page.getByRole('link', { name: 'Logout' }).click();
  });

  test('adminDeletesUserAfterConfirming', async ({ page }) => {
    const id = Math.floor(Math.random() * 100000);
    const email = `doomed${id}@jwt.com`;
    await registerDiner(page, `doomed ${id}`, email);

    await loginAsAdminAndFilterUsers(page, `doomed ${id}`);
    const row = page.getByRole('row').filter({ hasText: email });
    await row.getByRole('button', { name: 'Delete' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('Delete user');
    await expect(dialog).toContainText(email);
    // preline ignores a close that arrives before the open transition has finished
    await expect(page.locator('#hs-delete-user-modal')).toHaveClass(/opened/);
    await dialog.getByRole('button', { name: 'Confirm' }).click();

    await expect(page.getByRole('row').filter({ hasText: email })).toHaveCount(0);
    await expect(dialog).toBeHidden();
    await page.getByRole('link', { name: 'Logout' }).click();

    // the deleted user can no longer log in
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill('diner');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('link', { name: 'Logout' })).toHaveCount(0);
  });

  test('adminCancelsUserDeletion', async ({ page }) => {
    const id = Math.floor(Math.random() * 100000);
    const email = `spared${id}@jwt.com`;
    await registerDiner(page, `spared ${id}`, email);

    await loginAsAdminAndFilterUsers(page, `spared ${id}`);
    try {
      await page.getByRole('row').filter({ hasText: email }).getByRole('button', { name: 'Delete' }).click();
      // preline ignores a close that arrives before the open transition has finished
      await expect(page.locator('#hs-delete-user-modal')).toHaveClass(/opened/);
      await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
      await expect(page.getByRole('dialog')).toBeHidden();

      await expect(page.getByRole('row').filter({ hasText: email })).toHaveCount(1);
    } finally {
      await deleteUserAsAdmin(page, `spared ${id}`, email);
    }
    await page.getByRole('link', { name: 'Logout' }).click();
  });
});
