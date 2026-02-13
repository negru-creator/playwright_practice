import { test, expect } from '@playwright/test';
import { standardUser } from '../test-data/users';
import { getRandomElementFromList } from '../test-data/utils/getElements';

test.describe('Tests for Cart functionality', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('');
        await page.locator('#user-name').fill(standardUser.username);
        await page.locator('#password').fill(standardUser.password);
        await page.locator('#login-button').click();
        await expect(page.locator('.title')).toContainText('Products');
        await expect(page).toHaveURL('/inventory.html');
    })

    test('Verifying an added item on Cart page', async ({ page }) => {
        const randomProductIndex = await getRandomElementFromList(page.locator('[data-test="inventory-item-name"]'));
        const productName = await page.locator('[data-test="inventory-item-name"]').nth(randomProductIndex).textContent();
        const productPrice = await page.locator('[data-test="inventory-item-price"]').nth(randomProductIndex).textContent();

        await page.locator('.btn_inventory').nth(randomProductIndex).click();
        await expect(page.locator('.btn_inventory').nth(randomProductIndex)).toHaveText('Remove');
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL('/cart.html');
        await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(productName!);
        await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(productPrice!);

    })

    test.only('Removing an item from the cart on Cart page', async ({ page }) => {
        const randomProductIndex = await getRandomElementFromList(page.locator('[data-test="inventory-item-name"]'));
        const productName = await page.locator('[data-test="inventory-item-name"]').nth(randomProductIndex).textContent();
        const productPrice = await page.locator('[data-test="inventory-item-price"]').nth(randomProductIndex).textContent();

        await page.locator('.btn_inventory').nth(randomProductIndex).click();
        await expect(page.locator('.btn_inventory').nth(randomProductIndex)).toHaveText('Remove');
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL('/cart.html');
        await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(productName!);
        await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(productPrice!);

        await page.locator('[data-test^="remove-"]').click();
        await expect(page.locator('[data-test="inventory-item-name"]')).not.toBeVisible();
    })

})