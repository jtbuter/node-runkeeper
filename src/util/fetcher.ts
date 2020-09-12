import fetch, { Response } from "node-fetch";

interface Entries {
	[key: string]: string;
}

const base = "https://runkeeper.com";
let entries: Entries = {};

export async function get(endpoint: string, params?: Record<string, unknown>, cache = true, expires = 1000): Promise<string> {
	const entry = cache ? entries[endpoint] : undefined;

	if (entry !== undefined) return entry;

	const url = new URL(endpoint, base);
	const res = await fetch(url.toString(), params);

	entries[endpoint] = await res.text();

	return entries[endpoint];
	// const text = await res.text();

	// const entry: Entry = {
	// 	name: endpoint,
	// 	created: new Date(),
	// 	expires: expires,
	// 	response: text
	// };

	// entries.push(entry);

	// if (entries.length === 1) setInterval(function () { checker.bind(this)() }, 1000);

	// return text;
}