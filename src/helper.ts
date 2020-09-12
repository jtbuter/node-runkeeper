import puppeteer from "puppeteer-extra";
import stealth = require("puppeteer-extra-plugin-stealth");
import { Page, Browser } from "puppeteer";

type CallbackFunction = (...args: any[]) => void;

export async function init(): Promise<[Browser, Page]> {
	puppeteer.use(stealth());

	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	await page.setViewport({ width: 1280, height: 800 });

	return [browser, page];
}

/**
 * From https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace
 *
 * @param  {string} data String that must be normalized
 *
 * @return {string}      Normalized string
 */
export function normalize(data: string): string {
	// Use ECMA-262 Edition 3 String and RegExp features
	data = data.replace(/[\t\n\r ]+/g, " ");

	if (data.charAt(0) == " ") {
		data = data.substring(1, data.length);
	}

	if (data.charAt(data.length - 1) == " ") {
		data = data.substring(0, data.length - 1);
	}

	return data;
}

export async function sleep(ms: number): Promise<void> {
	return new Promise(r => setTimeout(r, ms));
}

export async function timeout(callback: () => Promise<any>, ms: number): Promise<any> {
	return new Promise(function (resolve, reject) {
		sleep(ms).then(() => reject(new Error("Function timed-out")));
		
		callback().then(r => resolve(r));
	});
}

export function parseCookies(string: string): string[] {
	string = string.toLocaleLowerCase();

	const cleaned = string.split(/httponly|secure/);
	const parts = cleaned.map(v => {
		const r = v.split(/(?<=^[^;]+);/).shift();

		return r.split(/(?<=^\S+)\s/).pop();
	});

	return parts.filter(Boolean);
}