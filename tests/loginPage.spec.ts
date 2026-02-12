import { test, expect } from '@playwright/test';
import { lockedOutUser, problemUser, standardUser } from '../test-data/users';
import { Errors } from '../test-data/errors';
import { faker } from '@faker-js/faker';
import LoginPage from '../pom/pages/loginPage';
import ProductsPage from '../pom/pages/ProductsPage';
import { Urls } from '../test-data/urls';


let loginPage: LoginPage;
let productsPage: ProductsPage;

test.describe('Tests for Login page', () => {

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        await loginPage.navigate();
    })

    test('Successful authorization test for a standard user', async ({ page }) => {
        await loginPage.loginWithCredentials(standardUser.username, standardUser.password);
        await expect(productsPage.productsTitle).toBeVisible();
        await expect(page).toHaveURL(Urls.PRODUCTS_PAGE);
    })


    test('Authorization fails without username', async ({ page }) => {
        await loginPage.enterPassword(standardUser.password);
        await loginPage.clickLoginButton();

        await expect(page).toHaveURL(Urls.LOGIN_PAGE);
        await loginPage.assertUserNameFieldInvalid();
        await expect(loginPage.errorBlock).toBeVisible();
        await expect(loginPage.errorBlock).toHaveText(Errors.EMPTY_USERNAME_ERROR);

    })

    test('Authorization fails without password', async ({ page }) => {
        await loginPage.enterUsername(standardUser.username);
        await loginPage.clickLoginButton();

        await expect(page).toHaveURL(Urls.LOGIN_PAGE);
        await loginPage.assertPasswordFieldInvalid();

        await expect(loginPage.errorBlock).toBeVisible();
        await expect(loginPage.errorBlock).toHaveText(Errors.EMPTY_PASSWORD_ERROR);

    })


    test('Authorization fails with incorrect password', async ({ page }) => {
        await loginPage.loginWithCredentials(standardUser.username, faker.internet.password());

        await expect(page).toHaveURL(Urls.LOGIN_PAGE);

        await loginPage.assertPasswordFieldInvalid();
        await loginPage.assertUserNameFieldInvalid();
        await expect(loginPage.errorBlock).toBeVisible();
        await expect(loginPage.errorBlock).toHaveText(Errors.INVALID_CREDS_ERROR);

    })


    test('Authorization fails for a locked-out user', async ({ page }) => {
        await loginPage.loginWithCredentials(lockedOutUser.username, lockedOutUser.password);

        await expect(page).toHaveURL(Urls.LOGIN_PAGE);
        await loginPage.assertPasswordFieldInvalid();
        await loginPage.assertUserNameFieldInvalid();
        await expect(loginPage.errorBlock).toBeVisible();
        await expect(loginPage.errorBlock).toHaveText(Errors.LOCKEDOUT_USER_ERROR);
    })


    test('Successful authorization test for a problem user', async ({ page }) => {
        await loginPage.loginWithCredentials(problemUser.username, problemUser.password);
        await expect(productsPage.productsTitle).toBeVisible();
        await expect(page).toHaveURL(Urls.PRODUCTS_PAGE);
    })

})



