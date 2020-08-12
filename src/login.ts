import { Page } from 'puppeteer';
import * as helper from './helper';
import * as dotenv from 'dotenv';

dotenv.config();

async function login (page: Page): Promise<void> {
	await page.goto('https://runkeeper.com/login');

	await page.waitForSelector('input[data-fieldid=a_email]');
	await page.waitForSelector('input[data-fieldid=a_password]');

	await page.type('input[data-fieldid=a_email]', process.env.runkeeper_username);
	await page.type('input[data-fieldid=a_password]', process.env.runkeeper_password);

	await page.click('button[data-clickaction=login]');

	await page.waitForNavigation();

	await page.waitForSelector('#onetrust-accept-btn-handler');
	await page.click('#onetrust-accept-btn-handler');
}

export default async function (page: Page): Promise<void> {
	const cookies = helper.readCookies();

	if (cookies === null) {
		await login(page);

		helper.writeCookies(await page.cookies());
	} else {
		await page.setCookie(...cookies);
	}
}
