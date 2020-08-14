import * as puppeteer from "puppeteer";
import { Cookie, Page, Browser } from "puppeteer";
import * as fs from "fs";
import { cookies } from "./constants";
import * as path from "path";

type CallbackFunction = (...args: any[]) => void;

export function writeCookies(data: Cookie[]): void {
	if (!fs.existsSync(cookies.target)) {
		fs.mkdirSync(path.dirname(cookies.target), { recursive: true });
	}

	fs.writeFileSync(cookies.target, JSON.stringify(data));
}

export function readCookies(): Cookie[] {
	if (!fs.existsSync(cookies.target)) return null;

	const current = new Date().getTime();
	const modified = fs.statSync(cookies.target).mtime.getTime();
	
	// Cookie has expired
	if (current - modified > cookies.expires) return null;
	
	return JSON.parse(fs.readFileSync(cookies.target, "utf-8"));
}

export async function init(): Promise<[Browser, Page]> {
	const browser = await puppeteer.launch({ headless: false, devtools: true });
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