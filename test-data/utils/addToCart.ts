import { Page } from "@playwright/test";
import { expect } from '@playwright/test';
import { getRandomElementFromList } from "./getElements";

export async function addRandomProductToCart(page: Page) {
    const productNames = page.locator('[data-test="inventory-item-name"]');
    const productPrices = page.locator('[data-test="inventory-item-price"]');

    const randomIndex = await getRandomElementFromList(productNames);

    const name = await productNames.nth(randomIndex).textContent();
    const price = await productPrices.nth(randomIndex).textContent();

    await page.locator('.btn_inventory').nth(randomIndex).click();
    await expect(page.locator('.btn_inventory').nth(randomIndex)).toHaveText('Remove');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    return { name: name!, price: price! };
}
