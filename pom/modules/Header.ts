import BasePage from "../BasePage";

export default class Header extends BasePage {
    public readonly shoppingCartBadge = this.page.locator('[data-test="shopping-cart-badge"]');


}