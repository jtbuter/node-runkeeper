import { Page } from "puppeteer";
import * as dotenv from "dotenv";
import * as helper from "./helper";

dotenv.config();

async function login (page: Page): Promise<void> {
	await page.setRequestInterception(true);
		
	page.on("request", request => {
		// Override headers
		const headers = Object.assign({}, request.headers(), {
			"sec-ch-ua": undefined,
			"sec-ch-mobile": undefined,
		});
		
		request.continue({ headers });
	});
	
	await page.goto("https://runkeeper.com/login");
	await page.waitForSelector("input[data-fieldid=a_email]");
	await page.waitForSelector("input[data-fieldid=a_password]");

	await page.type("input[data-fieldid=a_email]", process.env.runkeeper_username);
	await page.type("input[data-fieldid=a_password]", process.env.runkeeper_password);

	await page.click("button[data-clickaction=login]");

	await page.waitForNavigation();

	await page.waitForSelector("#onetrust-accept-btn-handler");
	await page.click("#onetrust-accept-btn-handler");
}

export default async function run(page: Page): Promise<void> {
	const cookies = helper.readCookies();

	if (cookies === null) {
		await login(page);

		helper.writeCookies(await page.cookies());
	} else {
		await page.setCookie(...cookies);
	}
}
