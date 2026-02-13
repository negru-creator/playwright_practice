import { Locator } from "@playwright/test";

export async function getRandomElementFromList(list: Locator) {
    const numberOfItems = await list.count();
    const randomProductIndex = Math.floor(Math.random() * (numberOfItems));
    return randomProductIndex;
}


