import { Locator, Page } from "@playwright/test";
import { Urls } from "../../test-data/urls";
import BasePage from "../BasePage";

export default class ProductsPage extends BasePage {

    public readonly productsTitle: Locator = this.page.locator('.title', { hasText: 'Products' });
    public readonly productNames: Locator = this.page.locator('[data-test="inventory-item-name"]');
    public readonly addToCartButtons: Locator = this.page.locator('.btn_inventory');
    public readonly sortingDropdown: Locator = this.page.locator('[data-test="product-sort-container"]');
    public readonly productPrices: Locator = this.page.locator('[data-test="inventory-item-price"]');

    async navigate() {
        await this.page.goto(Urls.PRODUCTS_PAGE);
    }

    async getProductNameByIndex(index: number) {
        return this.productNames.nth(index).textContent();
    }

    async clickOnProductByIndex(index: number) {
        await this.productNames.nth(index).click();
    }


    async clickAddToCartButtonByIndex(index: number) {
        await this.addToCartButtons.nth(index).click();
    }

    async clickRemoveFromCartButtonByIndex(index: number) {
        await this.addToCartButtons.nth(index).click();
    }

    async getAllProductPricesByIndex() {
        const count = await this.productPrices.count();
        const prices: number[] = [];
        for (let i = 0; i < count; i++) {
            const text = await this.productPrices.nth(i).textContent();
            prices.push(parseFloat(text!.replace('$', '')));
        }
        return prices;
    }

    async selectSortingOption(optionValue: string) {
        await this.sortingDropdown.selectOption(optionValue);
    }

    async getProductDataByIndex(index: number) {
        const name = await this.productNames.nth(index).textContent();
        const price = await this.productPrices.nth(index).textContent();

        return {
            name: name?.trim(),
            price: price?.trim()
        };

    }
    async addRandomProductToCart() {
        const count = await this.productNames.count();
        const randomIndex = Math.floor(Math.random() * count);
        await this.clickAddToCartButtonByIndex(randomIndex);
        const productData = await this.getProductDataByIndex(randomIndex);
        return productData;
    }

}