import { expect, Locator, Page } from "@playwright/test";
import { Urls } from "../../test-data/urls";
import BasePage from "../BasePage";

export default class LoginPage extends BasePage {

    private readonly userNameField: Locator = this.page.locator('#user-name');
    private readonly passwordField: Locator = this.page.locator('#password');
    private readonly loginButton: Locator = this.page.locator('#login-button');
    private readonly userNameInputFieldError: Locator = this.page.locator('#user-name.input_error');
    private readonly userNameErrorIcon: Locator = this.page.locator('#user-name + svg.error_icon');
    private readonly passwordInputFieldError: Locator = this.page.locator('#password.input_error');
    private readonly passwordErrorIcon: Locator = this.page.locator('#password + svg.error_icon');
    public readonly errorBlock: Locator = this.page.locator('[data-test="error"]');

    async navigate() {
        await this.page.goto(Urls.LOGIN_PAGE);
    }

    async enterUsername(username: string) {
        await this.userNameField.fill(username);
    }

    async enterPassword(password: string) {
        await this.passwordField.fill(password);
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }


    async loginWithCredentials(username: string, password: string) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }

    async assertUserNameFieldInvalid() {
        await expect(this.userNameErrorIcon).toBeVisible();
        await expect(this.userNameInputFieldError).toHaveCSS('border-bottom-color', 'rgb(226, 35, 26)');
    }

    async assertPasswordFieldInvalid() {
        await expect(this.passwordErrorIcon).toBeVisible();
        await expect(this.passwordInputFieldError).toHaveCSS('border-bottom-color', 'rgb(226, 35, 26)');
    }

}