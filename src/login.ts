import { Cookie } from "puppeteer";
import * as dotenv from "dotenv";
import * as helper from "./helper";

dotenv.config();

export default async function(): Promise<Cookie[]> {
	const [browser, page] = await helper.init();

	await page.goto("https://runkeeper.com/login");

	await page.waitForSelector("input[name=a_email]");
	await page.type("input[name=a_email]", process.env.runkeeper_username);
	await page.waitForSelector("input[name=a_password]");
	await page.type("input[name=a_password]", process.env.runkeeper_password);

	await page.waitForSelector("button[data-clickaction=login]");
	await page.click("button[data-clickaction=login]");

	await page.waitForNavigation();

	const cookies: Cookie[] = await new Promise(res => {
		setInterval(async function() {
			const cookies = await page.cookies();

			if (cookies.find(c => c.name === "checker")) {
				clearInterval(this);

				res(cookies);
			}
		}, 500);
	})

	await browser.close();

	return cookies;
}