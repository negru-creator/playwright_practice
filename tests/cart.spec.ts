import { test, expect } from '@playwright/test';
import { standardUser } from '../test-data/users';
import { getRandomElementIndexFromList } from '../test-data/utils/getElements';
import LoginPage from '../pom/pages/loginPage';
import ProductsPage from '../pom/pages/ProductsPage';
import Header from '../pom/modules/Header';
import CartPage from '../pom/pages/CartPage';
import { Urls } from '../test-data/urls';

test.describe('Tests for Cart functionality', () => {
    let loginPage: LoginPage;
    let productsPage: ProductsPage;
    let header: Header;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        header = new Header(page);
        cartPage = new CartPage(page);

        await loginPage.navigate();
        await loginPage.loginWithCredentials(standardUser.username, standardUser.password);
        await expect(page).toHaveURL(Urls.PRODUCTS_PAGE);
        await expect(productsPage.productsTitle).toBeVisible();
    });

    test('Verifying an added item on Cart page', async ({ page }) => {
        const randomIndex = await getRandomElementIndexFromList(productsPage.productNames);
        await productsPage.clickAddToCartButtonByIndex(randomIndex);

        const productData = await productsPage.getProductDataByIndex(randomIndex);

        await cartPage.clickShoppingCartLink();
        await expect(page).toHaveURL(Urls.CART_PAGE);

        const cartData = await cartPage.getCartItemData();
        expect(cartData).toEqual(productData);
    });

    test('Removing an item from the cart on Cart page', async ({ page }) => {
        const productData = await productsPage.addRandomProductToCart();

        await cartPage.clickShoppingCartLink();
        await expect(page).toHaveURL(Urls.CART_PAGE);

        const cartData = await cartPage.getCartItemData();
        expect(cartData).toEqual(productData);

        await cartPage.clickRemoveFromCartButton();
        await expect(cartPage.cartItemName).toHaveCount(0);
    });
});
