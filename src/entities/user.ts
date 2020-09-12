import { manager } from "../cookie-manager";
import * as html from "node-html-parser";
import { fetcher, util } from "../util";

interface Settings {
	weight: string;
	distance: string;
}

interface User {
	url: string;
	display: string;
	avatar: string;
	weight: number;
	body_fat: number;
	settings: Settings;
	started: Date;
}

class User {
	public async get(url: string): Promise<User> {
		this.url = url;
		this.display = await this.getDisplayName();
		this.avatar = await this.getAvatar();
		this.weight = await this.getWeight();
		this.body_fat = await this.getBodyFat();
		this.settings = await this.getSettings();
		this.started = await this.getStartDate();

		return this;
	}

	// public async getId(): Promise<number> {
	// 	const root = await this.avatarWidget();

	// 	return parseInt(root.querySelector("[userId]").getAttribute("userId"));
	// }

	public async getAvatar(): Promise<string> {
		const root = await this.profilePage();

		return root.querySelector(".avatar img").getAttribute("src");
	}

	public async getBodyFat(): Promise<number> {
		const { totalBoxes: { body_fat } } = await this.fitnessReport() as any;
		const fat = parseInt(body_fat.value);

		return !Object.is(fat, NaN) ? fat : 0;
	}

	public async getStartDate(): Promise<Date> {
		const cookie = manager.cookie("checker");
		const startDate = new Date("1-Jan-2008");
		const endDate = new Date();
		const reportConfig = {
			charts: {
				all: {
					field: "TOTAL_DISTANCE",
					stacked: true
				}
			}
		};

		const report = await fetcher.get(`/user/${this.url}/fitnessReportsData`, {
			"headers": {
				"content-type": "application/x-www-form-urlencoded",
				"cookie": `${cookie.name}=${cookie.value}`
			},
			"body": new URLSearchParams({
				startDate: util.runkeeperDate(startDate),
				endDate: util.runkeeperDate(endDate),
				timeframeOption: "CUSTOM",
				chartTimeBuckets: "MONTH",
				reportConfigJson: JSON.stringify(reportConfig)
			}).toString(),
			"method": "POST"
		}, false);

		const json = JSON.parse(report);

		const { charts: { all: { series } } } = json;
		const points = series.find((e: Record<string, unknown>) => e.maxYValue > 0).dataPointsList;
		const epoch = points.find((c: Record<string, number>) => c.numSamples > 0).x;
		
		return new Date(epoch);
	}

	public async getSettings(): Promise<Settings> {
		const { totalBoxes: { weight, distance } } = await this.fitnessReport() as any;

		return {
			weight: weight.units,
			distance: distance.units
		};
	}

	public async getDisplayName(): Promise<string> {
		const root = await this.profilePage();

		return root.querySelector(".userName").innerHTML;
	}

	public async getWeight(): Promise<number> {
		const { totalBoxes: { weight } } = await this.fitnessReport() as any;

		return parseInt(weight.value);
	}

	private async fitnessReport(): Promise<unknown> {
		const cookie = manager.cookie("checker");

		const reportConfig = {
			totalBoxes: {
				weight: {
					field: "WEIGHT",
					showLatest: true
				},
				body_fat: {
					field: "PERCENT_BODY_FAT",
					showLatest: true
				},
				distance: {
					field: "TOTAL_DISTANCE"
				}
			}
		};

		const report = await fetcher.get(`/user/${this.url}/fitnessReportsData`, {
			"headers": {
				"content-type": "application/x-www-form-urlencoded",
				"cookie": `${cookie.name}=${cookie.value}`
			},
			"body": new URLSearchParams({
				timeframeOption: "LIFETIME",
				reportConfigJson: JSON.stringify(reportConfig)
			}).toString(),
			"method": "POST"
		});

		return JSON.parse(report);
	}

	private async profilePage(): Promise<html.HTMLElement> {
		const cookie = manager.cookie("checker");
		const res = await fetcher.get(`/user/${this.url}`, {
			"headers": {
				"cookie": `${cookie.name}=${cookie.value}`
			}
		});

		return html.parse(res);
	}

	// private async avatarWidget(): Promise<html.HTMLElement> {
	// 	const cookie = manager.cookie("checker");
	// 	const res = await fetcher.get("/settings?getAvatarWidget=", {
	// 		"headers": {
	// 			"cookie": `${cookie.name}=${cookie.value}`
	// 		}
	// 	});

	// 	return html.parse(res);
	// }
}

export default new User;
export { User };
