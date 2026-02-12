import { test, expect } from '@playwright/test';
import { standardUser } from '../test-data/users';
import { getRandomElementIndexFromList } from '../test-data/utils/getElements';
import LoginPage from '../pom/pages/loginPage';
import ProductsPage from '../pom/pages/ProductsPage';
import ProductDetailsPage from '../pom/pages/ProductDetails';
import { Urls } from '../test-data/urls';
import Header from '../pom/modules/Header';


let loginPage: LoginPage;
let productsPage: ProductsPage;
let productDetailsPage: ProductDetailsPage;
let header: Header;
test.describe('Product List page tests', () => {

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        productDetailsPage = new ProductDetailsPage(page);
        header = new Header(page);

        await loginPage.navigate();
        await loginPage.loginWithCredentials(standardUser.username, standardUser.password);
        await expect(page).toHaveURL(Urls.PRODUCTS_PAGE);
        await expect(productsPage.productsTitle).toBeVisible();
    })

    test('Open PDP from PLP', async () => {
        const randomProductIndex = await getRandomElementIndexFromList(productsPage.productNames);
        const productName = await productsPage.getProductNameByIndex(randomProductIndex);
        await productsPage.clickOnProductByIndex(randomProductIndex);
        await expect(productDetailsPage.productName).toHaveText(productName!);
    })

    test('Add an item to the cart from PLP', async () => {
        const randomProductIndex = await getRandomElementIndexFromList(productsPage.productNames);
        await productsPage.clickAddToCartButtonByIndex(randomProductIndex);
        await expect(productsPage.addToCartButtons.nth(randomProductIndex)).toHaveText('Remove');
        await expect(header.shoppingCartBadge).toHaveText('1');

    })

    test('Remove an item from the cart from PLP', async () => {
        const randomProductIndex = await getRandomElementIndexFromList(productsPage.productNames);
        await productsPage.clickAddToCartButtonByIndex(randomProductIndex);
        await expect(productsPage.addToCartButtons.nth(randomProductIndex)).toHaveText('Remove');
        await expect(header.shoppingCartBadge).toHaveText('1');

        await productsPage.clickRemoveFromCartButtonByIndex(randomProductIndex);
        await expect(productsPage.addToCartButtons.nth(randomProductIndex)).toHaveText('Add to cart');
        await expect(header.shoppingCartBadge).not.toBeVisible();
        await expect(header.shoppingCartBadge).toHaveCount(0);

    })

})

test.describe('Tests for Sorting functionality on PLP', () => {

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        await loginPage.navigate();
        await loginPage.loginWithCredentials(standardUser.username, standardUser.password);
        await expect(page).toHaveURL(Urls.PRODUCTS_PAGE);
        await expect(productsPage.productsTitle).toBeVisible();
    })

    test('Test to verify default sorting is A-Z', async () => {
        await expect(productsPage.sortingDropdown).toHaveValue('az');

    })


    test('Applying price sorting from low to high', async () => {
        await expect(productsPage.sortingDropdown).toHaveValue('az');

        const initialPrices = await productsPage.getAllProductPricesByIndex();
        await productsPage.selectSortingOption('lohi');

        const pricesAfterSorting = await productsPage.getAllProductPricesByIndex();
        const expectedSortedArray = [...initialPrices].sort((a, b) => a - b);

        expect(pricesAfterSorting).toEqual(expectedSortedArray);

    });

})
