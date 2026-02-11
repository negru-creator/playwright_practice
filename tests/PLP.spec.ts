import { test, expect } from '@playwright/test';
import { standardUser } from '../test-data/users';
import { getRandomElementFromList } from '../test-data/utils/getElements';



test.describe('Product List page tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('');
        await page.locator('#user-name').fill(standardUser.username);
        await page.locator('#password').fill(standardUser.password);
        await page.locator('#login-button').click();
        await expect(page.locator('.title')).toHaveText('Products');
        await expect(page).toHaveURL('/inventory.html');
    })

    test('Open PDP from PLP', async ({ page }) => {
        const randomProductIndex = await getRandomElementFromList(page.locator('[data-test="inventory-item-name"]'));
        const productName = await page.locator('[data-test="inventory-item-name"]').nth(randomProductIndex).textContent();

        await page.locator('[data-test="inventory-item-name"]').nth(randomProductIndex).click();
        await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(productName!);

    })

    test('Add an item to the cart from PLP', async ({ page }) => {
        const randomProductIndex = await getRandomElementFromList(page.locator('[data-test="inventory-item-name"]'));
        await page.locator('.btn_inventory').nth(randomProductIndex).click();
        await expect(page.locator('.btn_inventory').nth(randomProductIndex)).toHaveText('Remove');
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    })

    test('Remove an item from the cart from PLP', async ({ page }) => {
        const randomProductIndex = await getRandomElementFromList(page.locator('[data-test="inventory-item-name"]'));
        await page.locator('.btn_inventory').nth(randomProductIndex).click();
        await expect(page.locator('.btn_inventory').nth(randomProductIndex)).toHaveText('Remove');
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

        await page.locator('.btn_inventory').nth(randomProductIndex).click();
        await expect(page.locator('.btn_inventory').nth(randomProductIndex)).toHaveText('Add to cart');
        await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);

    })

})

test.describe('Tests for Sorting functionality on PLP', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('');
        await page.locator('#user-name').fill(standardUser.username);
        await page.locator('#password').fill(standardUser.password);
        await page.locator('#login-button').click();
        await expect(page.locator('.title')).toHaveText('Products');
        await expect(page).toHaveURL('/inventory.html');
    })

    test('Test to verify default sorting is A-Z', async ({ page }) => {
        await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('az');

    })


    test('Applying price sorting from low to high', async ({ page }) => {
        await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('az');

        const pricesLocator = page.locator('[data-test="inventory-item-price"]');
        const getPrices = async () => {
            const count = await pricesLocator.count();
            const prices: number[] = [];

            for (let i = 0; i < count; i++) {
                const text = await pricesLocator.nth(i).textContent();
                prices.push(parseFloat(text!.replace('$', '')));
            }
            return prices;
        };

        const initialPrices = await getPrices();

        await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

        const pricesAfterSorting = await getPrices();

        const expectedSortedArray = [...initialPrices].sort((a, b) => a - b);

        expect(pricesAfterSorting).toEqual(expectedSortedArray);
    });

})
