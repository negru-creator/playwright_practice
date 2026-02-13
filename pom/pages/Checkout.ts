import { expect } from "@playwright/test";
import BasePage from "../BasePage";
import { Errors } from "../../test-data/errors";
import { SuccessMessages } from "../../test-data/successMessages";

export default class CheckoutPage extends BasePage {
    public readonly checkoutTitle = this.page.locator('.title', { hasText: 'Checkout: Your Information' });
    public readonly overviewTitle = this.page.locator('.title', { hasText: 'Checkout: Overview' });
    private readonly completeTitle = this.page.locator('.title', { hasText: 'Checkout: Complete!' });

    private readonly firstNameInput = this.page.locator('#first-name');
    private readonly lastNameInput = this.page.locator('#last-name');
    private readonly postalCodeInput = this.page.locator('#postal-code');
    private readonly postalCodeInputError = this.page.locator('#postal-code.input_error');
    private readonly postalCodeErrorIcon = this.page.locator('#postal-code + svg.error_icon');
    public readonly errorBlock = this.page.locator('[data-test="error"]', { hasText: Errors.EMPTY_POSTAL_CODE_ERROR });
    private readonly continueButton = this.page.locator('#continue');
    private readonly finishButton = this.page.locator('#finish');

    public readonly overviewItemName = this.page.locator('[data-test="inventory-item-name"]');
    public readonly overviewItemPrice = this.page.locator('[data-test="inventory-item-price"]');

    private successImageAltText = this.page.getByAltText('Pony Express');
    private backToProductsButton = this.page.locator('[data-test="back-to-products"]');
    private thankYouMessage = this.page.locator('[data-test="complete-header"]');
    private dispatchedOrderMessage = this.page.locator('[data-test="complete-text"]');


    async fillFirstName(firstName: string) {
        await this.firstNameInput.fill(firstName);
    }

    async fillLastName(lastName: string) {
        await this.lastNameInput.fill(lastName);
    }

    async fillPostalCode(postalCode: string) {
        await this.postalCodeInput.fill(postalCode);
    }

    async clickContinueButton() {
        await this.continueButton.click();
    }

    async clickFinishButton() {
        await this.finishButton.click();
    }

    async getOverviewItemData() {
        const name = await this.overviewItemName.textContent();
        const price = await this.overviewItemPrice.textContent();
        return {
            name: name?.trim(),
            price: price?.trim()
        };
    }


    async assertCheckoutIsComplete() {
        await expect(this.completeTitle).toBeVisible();
        await expect(this.successImageAltText).toBeVisible();
        await expect(this.thankYouMessage).toHaveText(SuccessMessages.THANK_YOU_MSG);
        await expect(this.dispatchedOrderMessage).toHaveText(SuccessMessages.DISPATCHED_ORDER_MSG);
        await expect(this.backToProductsButton).toBeVisible();
    }
    async assertPostalCodeError() {
        await expect(this.postalCodeInputError).toHaveCSS('border-bottom-color', 'rgb(226, 35, 26)');
        await expect(this.postalCodeErrorIcon).toBeVisible();
    }
}


