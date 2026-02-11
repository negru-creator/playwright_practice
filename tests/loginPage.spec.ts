import { test, expect } from '@playwright/test';
import { lockedOutUser, problemUser, standardUser } from '../test-data/users';
import { Errors } from '../test-data/errors';
import { faker } from '@faker-js/faker';


test.describe('Tests for Login page', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('');
    })

    test('Successful authorization test for a standard user', async ({ page }) => {
        await page.locator('#user-name').fill(standardUser.username);
        await page.locator('#password').fill(standardUser.password);
        await page.locator('#login-button').click();

        await expect(page.locator('.title')).toHaveText('Products');
        await expect(page).toHaveURL('/inventory.html');
    })


    test('Authorization fails without username', async ({ page }) => {
        await page.locator('#password').fill(standardUser.password);
        await page.locator('#login-button').click();

        await expect(page).toHaveURL('/');
        await expect(page.locator('#user-name.input_error')).toHaveCSS('border-bottom-color', 'rgb(226, 35, 26)');
        await expect(page.locator('#user-name + svg.error_icon')).toBeVisible();
        await expect(page.locator('[data-test="error"]')).toBeVisible();
        await expect(page.locator('[data-test="error"]')).toHaveText(Errors.EMPTY_USERNAME_ERROR);

    })

    test('Authorization fails without password', async ({ page }) => {
        await page.locator('#user-name').fill(standardUser.username);
        await page.locator('#login-button').click();

        await expect(page).toHaveURL('/');
        await expect(page.locator('#password.input_error')).toHaveCSS('border-bottom-color', 'rgb(226, 35, 26)');
        await expect(page.locator('#password + svg.error_icon')).toBeVisible();
        await expect(page.locator('[data-test="error"]')).toBeVisible();
        await expect(page.locator('[data-test="error"]')).toHaveText(Errors.EMPTY_PASSWORD_ERROR);

    })


    test('Authorization fails with incorrect password', async ({ page }) => {
        await page.locator('#user-name').fill(standardUser.username);
        await page.locator('#password').fill(faker.internet.password());
        await page.locator('#login-button').click();

        await expect(page).toHaveURL('/');
        await expect(page.locator('#user-name.input_error')).toHaveCSS('border-bottom-color', 'rgb(226, 35, 26)');
        await expect(page.locator('#password.input_error')).toHaveCSS('border-bottom-color', 'rgb(226, 35, 26)');
        await expect(page.locator('#user-name + svg.error_icon')).toBeVisible();
        await expect(page.locator('#password + svg.error_icon')).toBeVisible();
        await expect(page.locator('[data-test="error"]')).toBeVisible();
        await expect(page.locator('[data-test="error"]')).toHaveText(Errors.INVALID_CREDS_ERROR);

    })


    test('Authorization fails for a locked-out user', async ({ page }) => {
        await page.locator('#user-name').fill(lockedOutUser.username);
        await page.locator('#password').fill(lockedOutUser.password);
        await page.locator('#login-button').click();

        await expect(page).toHaveURL('/');
        await expect(page.locator('#user-name.input_error')).toHaveCSS('border-bottom-color', 'rgb(226, 35, 26)');
        await expect(page.locator('#password.input_error')).toHaveCSS('border-bottom-color', 'rgb(226, 35, 26)');
        await expect(page.locator('#user-name + svg.error_icon')).toBeVisible();
        await expect(page.locator('#password + svg.error_icon')).toBeVisible();
        await expect(page.locator('[data-test="error"]')).toBeVisible();
        await expect(page.locator('[data-test="error"]')).toHaveText(Errors.LOCKEDOUT_USER_ERROR);

    })


    test('Successful authorization test for a problem user', async ({ page }) => {
        await page.locator('#user-name').fill(problemUser.username);
        await page.locator('#password').fill(problemUser.password);
        await page.locator('#login-button').click();

        await expect(page.locator('.title')).toContainText('Products');
        await expect(page).toHaveURL('/inventory.html');
    })

})



