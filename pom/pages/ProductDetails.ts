import { Locator } from "@playwright/test";
import BasePage from "../BasePage";

export default class ProductDetailsPage extends BasePage {

    public readonly productName: Locator = this.page.locator('.inventory_details_name');

    async getProductName() {
        return this.productName.textContent();
    }
}