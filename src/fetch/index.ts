import fetch, { Response } from "node-fetch";

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

// export async function fitness(manager: CookieManager, user: string, start: string, end: string, timeframe: string, bucket: string, config?: Record<string, unknown>, type?: string): Promise<unknown> {
// 	const searchParams = new URLSearchParams({
// 		startDate: start,
// 		endDate: end,
// 		timeframeOption: timeframe,
// 		chartTimeBuckets: bucket
// 	});

// 	if (config !== undefined) {
// 		searchParams.append("reportConfigJson", JSON.stringify(config))
// 	}

// 	if (type !== undefined) {
// 		searchParams.append("activityType", type);
// 	}

// 	const url = new URL(`/user/${user}/fitnessReportsData`, base);
// 	const cookie = manager.cookie("checker");
// 	const res = await fetch(url.toString(), {
// 		"headers": {
// 			"content-type": "application/x-www-form-urlencoded",
// 			"cookie": "checker=" + cookie.value
// 		},
// 		"body": searchParams.toString(),
// 		"method": "POST",
// 	});

// 	return res.json();
// }

// export async function profile(manager: CookieManager): Promise<User> {
// 	let profile: User = null;

// 	if ((profile = util.read("../../cache/fetch/profile.json") as any)) return profile;

// 	const cookie = manager.cookie("checker");

// 	const widget = await fetch("https://runkeeper.com/settings?getAvatarWidget=", {
// 		"headers": {
// 			"cookie": "checker=" + cookie.value
// 		},
// 	});

// 	const root = html.parse(await widget.text());
// 	const avatar = root.querySelector("img").getAttribute("src");
// 	const id = root.querySelector("[userId]").getAttribute("userId");
// 	const url = root.querySelector("[userUrl]").getAttribute("userUrl");

// 	const { totalBoxes } = await fitness(
// 		manager, url, "17-Aug-2020", "17-Aug-2020", "CUSTOM", "DAY", {
// 			totalBoxes: {
// 				WEIGHT: {
// 					field: "WEIGHT",
// 					showLatest: "true"
// 				},
// 				PERCENT_BODY_FAT: {
// 					field: "PERCENT_BODY_FAT",
// 					showLatest: "true"
// 				}
// 			}
// 		}
// 	) as any;

// 	profile = {
// 		avatar: avatar,
// 		id: parseInt(id),
// 		url: url,
// 		weight: totalBoxes.WEIGHT.value,
// 		bodyFat: totalBoxes.PERCENT_BODY_FAT.value,

// 	};
	
// 	return profile;
// }
