import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { addRandomProductToCart } from '../test-data/utils/addToCart';
import { standardUser } from '../test-data/users';
import { Errors } from '../test-data/errors';
import { SuccessMessages } from '../test-data/successMessages';

test.describe('Test for Checkout functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('');
        await page.locator('#user-name').fill(standardUser.username);
        await page.locator('#password').fill(standardUser.password);
        await page.locator('#login-button').click();

        await expect(page.locator('.title')).toHaveText('Products');
        await expect(page).toHaveURL('/inventory.html');
    });

    test('Completing the checkout with valid data', async ({ page }) => {
        const product = await addRandomProductToCart(page);

        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL('/cart.html');
        await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(product.name);
        await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(product.price);

        await page.locator('#checkout').click();
        await expect(page.locator('.title')).toHaveText('Checkout: Your Information');


        await page.locator('#first-name').fill(faker.person.firstName());
        await page.locator('#last-name').fill(faker.person.lastName());
        await page.locator('#postal-code').fill(faker.location.zipCode());
        await page.locator('#continue').click();


        await expect(page.locator('.title')).toHaveText('Checkout: Overview');
        await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(product.name);
        await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(product.price);

        await page.locator('#finish').click();
        await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
        await expect(page.getByAltText('Pony Express')).toBeVisible();
        await expect(page.locator('[data-test="complete-header"]')).toHaveText(SuccessMessages.THANK_YOU_MSG);
        await expect(page.locator('[data-test="complete-text"]')).toHaveText(SuccessMessages.DISPATCHED_ORDER_MSG);
        await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
    });

    test('Completing the checkout fails without postal code', async ({ page }) => {
        const product = await addRandomProductToCart(page);

        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL('/cart.html');
        await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(product.name);
        await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(product.price);

        await page.locator('#checkout').click();
        await expect(page.locator('.title')).toHaveText('Checkout: Your Information');


        await page.locator('#first-name').fill(faker.person.firstName());
        await page.locator('#last-name').fill(faker.person.lastName());
        await page.locator('#continue').click();

        await expect(page).toHaveURL('/checkout-step-one.html');
        await expect(page.locator('#first-name.input_error')).toHaveCSS('border-bottom-color', 'rgb(226, 35, 26)');
        await expect(page.locator('#last-name.input_error')).toHaveCSS('border-bottom-color', 'rgb(226, 35, 26)');
        await expect(page.locator('#postal-code.input_error')).toHaveCSS('border-bottom-color', 'rgb(226, 35, 26)');

        await expect(page.locator('#first-name + svg.error_icon')).toBeVisible();
        await expect(page.locator('#last-name + svg.error_icon')).toBeVisible();
        await expect(page.locator('#postal-code + svg.error_icon')).toBeVisible();

        await expect(page.locator('[data-test="error"]')).toBeVisible();
        await expect(page.locator('[data-test="error"]')).toHaveText(Errors.EMPTY_POSTAL_CODE_ERROR);
    })

})
