import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { standardUser } from '../test-data/users';
import LoginPage from '../pom/pages/LoginPage';
import ProductsPage from '../pom/pages/ProductsPage';
import Header from '../pom/modules/Header';
import CartPage from '../pom/pages/CartPage';
import CheckoutPage from '../pom/pages/Checkout';
import { Urls } from '../test-data/urls';

test.describe('Test for Checkout functionality', () => {
    let loginPage: LoginPage;
    let productsPage: ProductsPage;
    let header: Header;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        header = new Header(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        await loginPage.navigate();
        await loginPage.loginWithCredentials(standardUser.username, standardUser.password);
        await expect(page).toHaveURL(Urls.PRODUCTS_PAGE);
        await expect(productsPage.productsTitle).toBeVisible();
    });

    test('Completing the checkout with valid data', async ({ page }) => {
        const product = await productsPage.addRandomProductToCart();

        await cartPage.clickShoppingCartLink();
        await expect(page).toHaveURL(Urls.CART_PAGE);

        const cartData = await cartPage.getCartItemData();
        expect(cartData).toEqual(product);

        await cartPage.clickCheckoutButton();
        await expect(checkoutPage.checkoutTitle).toBeVisible();
        await expect(page).toHaveURL(Urls.CHECKOUT_STEP_ONE_PAGE);

        await checkoutPage.fillFirstName(faker.person.firstName());
        await checkoutPage.fillLastName(faker.person.lastName());
        await checkoutPage.fillPostalCode(faker.location.zipCode());
        await checkoutPage.clickContinueButton();
        await expect(page).toHaveURL(Urls.CHECKOUT_STEP_TWO_PAGE);
        await expect(checkoutPage.overviewTitle).toBeVisible();

        const overviewData = await checkoutPage.getOverviewItemData();
        expect(overviewData).toEqual(product);

        await checkoutPage.clickFinishButton();
        await expect(page).toHaveURL(Urls.CHECKOUT_COMPLETE_PAGE);
        await checkoutPage.assertCheckoutIsComplete();
    });

    test('Completing the checkout fails without postal code', async ({ page }) => {
        await productsPage.addRandomProductToCart();

        await cartPage.clickShoppingCartLink();
        await expect(page).toHaveURL(Urls.CART_PAGE);

        await cartPage.clickCheckoutButton();
        await expect(checkoutPage.checkoutTitle).toBeVisible();

        await checkoutPage.fillFirstName(faker.person.firstName());
        await checkoutPage.fillLastName(faker.person.lastName());
        await checkoutPage.clickContinueButton();

        await checkoutPage.assertPostalCodeError();
        await expect(checkoutPage.errorBlock).toBeVisible();
    });
});

