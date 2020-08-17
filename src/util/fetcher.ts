import fetch from "node-fetch";

interface Entry {
	name: string;
	created: Date;
	expires: number;
	response: string;
}

const base = "https://runkeeper.com";
let entries: Entry[] = [];

/**
 * Clears any entries that are older than their expiration time.
 */
function checker(): void {
	if (entries.length === 0) {
		clearInterval(this);

		return;
	}

	const current = (new Date()).getTime();

	entries = entries.filter((entry: Entry) => {
		const expires = entry.created.getTime() + entry.expires;

		return expires > current;
	});
}

export async function get(endpoint: string, params?: Record<string, unknown>, cache = true, expires = 1000): Promise<string> {
	const index = cache ? entries.findIndex(c => c.name === endpoint) : -1;

	if (index >= 0) {
		const entry = entries[index];
		entry.created = new Date();

		return entry.response;
	}

	const url = new URL(endpoint, base);
	const res = await fetch(url.toString(), params);
	const text = await res.text();

	const entry: Entry = {
		name: endpoint,
		created: new Date(),
		expires: expires,
		response: text
	};

	entries.push(entry);

	if (entries.length === 1) setInterval(function () { checker.bind(this)() }, 1000);

	return text;
}