import { test, expect } from './networkWrapper';
import { Page } from '@playwright/test';
import { Role, User } from '../src/service/pizzaService';

test('home page', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = {
      user: {
        id: 3,
        name: 'Kai Chen',
        email: 'd@jwt.com',
        roles: [{ role: 'diner' }],
      },
      token: 'abcdef',
    };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('a');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('navigation', { name: 'Global' })).toContainText('KC');
});

async function basicInit(page: Page) {
  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = { 'd@jwt.com': { id: '3', name: 'Kai Chen', email: 'd@jwt.com', password: 'a', roles: [{ role: Role.Diner }] },
    'a@jwt.com': { id: '1', name: 'Admin User', email: 'a@jwt.com', password: 'admin', roles: [{ role: Role.Admin }] },
    'f@jwt.com': { id: '5', name: 'Fran Chisee', email: 'f@jwt.com', password: 'f', roles: [{ role: Role.Franchisee }] },
  };

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = route.request().postDataJSON();
    const user = validUsers[loginReq.email];
    if (!user || user.password !== loginReq.password) {
      await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
      return;
    }
    loggedInUser = validUsers[loginReq.email];
    const loginRes = {
      user: loggedInUser,
      token: 'abcdef',
    };
    expect(route.request().method()).toBe('PUT');
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/user/me', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: loggedInUser });
  });

  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
    const franchiseRes = {
      franchises: [
        {
          id: 2,
          name: 'LotaPizza',
          stores: [
            { id: 4, name: 'Lehi' },
            { id: 5, name: 'Springville' },
            { id: 6, name: 'American Fork' },
          ],
        },
        { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
        { id: 4, name: 'topSpot', stores: [] },
      ],
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderReq = route.request().postDataJSON();
    const orderRes = {
      order: { ...orderReq, id: 23 },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: orderRes });
  });

  await page.goto('/');
}

test('login', async ({ page }) => {
  await basicInit(page);
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();
});

test('purchase with login', async ({ page }) => {
  await basicInit(page);

  await page.getByRole('button', { name: 'Order now' }).click();

  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  await expect(page.getByText('0.008')).toBeVisible();
});

test('register', async ({ page }) => {
  await basicInit(page);
  await page.route('*/**/api/auth', async (route) => {
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject({ name: 'Pat Doe', email: 'p@jwt.com', password: 'b' });
    await route.fulfill({ json: { user: { id: 9, name: 'Pat Doe', email: 'p@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' } });
  });

  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByPlaceholder('Full name').fill('Pat Doe');
  await page.getByPlaceholder('Email address').fill('p@jwt.com');
  await page.getByPlaceholder('Password').fill('b');
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.getByRole('link', { name: 'PD' })).toBeVisible();
});

async function loginAs(page: Page, email: string, password: string) {
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

test('logout', async ({ page }) => {
  await basicInit(page);
  await loginAs(page, 'd@jwt.com', 'a');
  await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();

  await page.route('*/**/api/auth', async (route) => {
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: { message: 'logout successful' } });
  });
  await page.getByRole('link', { name: 'Logout' }).click();

  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
});

test('diner dashboard', async ({ page }) => {
  await basicInit(page);
  await page.route('*/**/api/order', async (route) => {
    await route.fulfill({ json: { dinerId: 3, orders: [] } });
  });
  await loginAs(page, 'd@jwt.com', 'a');

  await page.getByRole('link', { name: 'KC' }).click();

  await expect(page.getByRole('main')).toContainText('Kai Chen');
  await expect(page.getByRole('main')).toContainText('d@jwt.com');
  await expect(page.getByRole('main')).toContainText('How have you lived this long without having a pizza?');
});

async function adminInit(page: Page) {
  await basicInit(page);
  await page.route(/\/api\/franchise\?/, async (route) => {
    const filtered = route.request().url().includes('name=*Lota*');
    const franchises = [
      { id: 2, name: 'LotaPizza', admins: [{ name: 'Fran Chisee' }], stores: [{ id: 4, name: 'Lehi', totalRevenue: 1.5 }] },
      { id: 3, name: 'PizzaCorp', admins: [{ name: 'Corp Owner' }], stores: [] },
    ];
    await route.fulfill({ json: { franchises: filtered ? franchises.slice(0, 1) : franchises, more: false } });
  });
  await loginAs(page, 'a@jwt.com', 'admin');
  await page.getByRole('link', { name: 'Admin' }).click();
}

test('admin dashboard', async ({ page }) => {
  await adminInit(page);

  await expect(page.getByRole('main')).toContainText("Mama Ricci's kitchen");
  await expect(page.getByRole('main')).toContainText('LotaPizza');
  await expect(page.getByRole('main')).toContainText('Fran Chisee');
  await expect(page.getByRole('main')).toContainText('Lehi');
  await expect(page.getByRole('main')).toContainText('1.5 ₿');
  await expect(page.getByRole('main')).toContainText('PizzaCorp');

  await page.getByPlaceholder('Filter franchises').fill('Lota');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('main')).not.toContainText('PizzaCorp');

  await page.getByRole('button', { name: 'Close' }).first().click();
  await expect(page.getByRole('main')).toContainText('Sorry to see you go');
});


test('franchise page without a franchise', async ({ page }) => {
  await basicInit(page);
  await page.route('*/**/api/franchise/3', async (route) => {
    await route.fulfill({ json: [] });
  });
  await loginAs(page, 'd@jwt.com', 'a');

  await page.getByRole('link', { name: 'Franchise' }).first().click();

  await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?');
});

async function franchiseeInit(page: Page) {
  await basicInit(page);
  await page.route('*/**/api/franchise/5', async (route) => {
    await route.fulfill({ json: [{ id: 2, name: 'LotaPizza', admins: [{ name: 'Fran Chisee' }], stores: [{ id: 4, name: 'Lehi', totalRevenue: 1.5 }] }] });
  });
  await loginAs(page, 'f@jwt.com', 'f');
  await page.getByRole('link', { name: 'Franchise' }).first().click();
  await expect(page.getByRole('main')).toContainText('LotaPizza');
  await expect(page.getByRole('main')).toContainText('Lehi');
  await expect(page.getByRole('main')).toContainText('1.5 ₿');
}

test('franchisee creates a store', async ({ page }) => {
  await franchiseeInit(page);
  await page.route('*/**/api/franchise/2/store', async (route) => {
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject({ name: 'Provo' });
    await route.fulfill({ json: { id: 8, name: 'Provo' } });
  });

  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByPlaceholder('store name').fill('Provo');
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByRole('main')).toContainText('Everything you need to run an JWT Pizza franchise');
});

test('franchisee closes a store', async ({ page }) => {
  await franchiseeInit(page);
  await page.route('*/**/api/franchise/2/store/4', async (route) => {
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: { message: 'store deleted' } });
  });

  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('main')).toContainText('Are you sure you want to close the LotaPizza store Lehi');
  await page.getByRole('button', { name: 'Close' }).click();

  await expect(page.getByRole('main')).toContainText('Everything you need to run an JWT Pizza franchise');
});


test('admin creates a franchise', async ({ page }) => {
  await adminInit(page);
  await page.route(/\/api\/franchise$/, async (route) => {
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject({ name: 'NewPizza', admins: [{ email: 'n@jwt.com' }] });
    await route.fulfill({ json: { id: 9, name: 'NewPizza', admins: [{ email: 'n@jwt.com' }], stores: [] } });
  });

  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByPlaceholder('franchise name').fill('NewPizza');
  await page.getByPlaceholder('franchisee admin email').fill('n@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByRole('main')).toContainText("Mama Ricci's kitchen");
});

test('admin closes a franchise', async ({ page }) => {
  await adminInit(page);
  await page.route('*/**/api/franchise/2', async (route) => {
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: { message: 'franchise deleted' } });
  });

  await page.getByRole('button', { name: 'Close' }).first().click();
  await expect(page.getByRole('main')).toContainText('Are you sure you want to close the LotaPizza franchise?');
  await page.getByRole('button', { name: 'Close' }).click();

  await expect(page.getByRole('main')).toContainText("Mama Ricci's kitchen");
});
