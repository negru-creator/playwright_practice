import BasePage from "../BasePage";

export default class CartPage extends BasePage {
    private readonly shoppingCartLink = this.page.locator('[data-test="shopping-cart-link"]');
    private readonly removeFromCartButton = this.page.locator('[data-test^="remove-"]');
    private readonly checkoutButton = this.page.locator('#checkout');

    public readonly cartItemName = this.page.locator('[data-test="inventory-item-name"]');
    public readonly cartItemPrice = this.page.locator('[data-test="inventory-item-price"]');

    async clickShoppingCartLink() {
        await this.shoppingCartLink.click();
    }

    async getCartItemData() {
        const name = await this.cartItemName.textContent();
        const price = await this.cartItemPrice.textContent();

        return {
            name: name?.trim(),
            price: price?.trim()
        };
    }

    async clickRemoveFromCartButton() {
        await this.removeFromCartButton.click();
    }

    async clickCheckoutButton() {
        await this.checkoutButton.click();
    }
}
