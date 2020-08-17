import CookieManager from "../cookie-manager";
import * as html from "node-html-parser";
import { fetcher } from "../util";

interface Settings {
	weight: string;
	distance: string;
}

interface User {
	id: number;
	name: string;
	display: string;
	weight: number;
	bodyFat: number;
	avatar: string;
	url: string;
	settings: Settings;
	manager?: CookieManager;
}

class User {
	public async build(manager: CookieManager): Promise<User> {
		this.manager = manager;

		this.id = await this.getId();
		this.url = await this.getUrl();
		this.display = await this.getDisplayName();
		this.avatar = await this.getAvatar();
		this.weight = await this.getWeight();
		this.bodyFat = await this.getBodyFat();
		this.settings = await this.getSettings();

		return this;
	}

	public async getId(): Promise<number> {
		const root = await this.avatarWidget();

		return parseInt(root.querySelector("[userId]").getAttribute("userId"));
	}

	public async getUrl(): Promise<string> {
		const root = await this.avatarWidget();
		
		return root.querySelector("[userUrl]").getAttribute("userUrl");
	}

	public async getAvatar(): Promise<string> {
		const root = await this.avatarWidget();

		return root.querySelector("img").getAttribute("src");
	}

	public async getBodyFat(): Promise<number> {
		const { totalBoxes: { PERCENT_BODY_FAT } } = await this.fitnessReport() as any;
		const fat = parseInt(PERCENT_BODY_FAT.value);

		return !Object.is(fat, NaN) ? fat : 0;
	}

	public async getSettings(): Promise<Settings> {
		const { totalBoxes: { WEIGHT, TOTAL_DISTANCE } } = await this.fitnessReport() as any;

		return {
			weight: WEIGHT.units,
			distance: TOTAL_DISTANCE.units
		};
	}

	public async getDisplayName(): Promise<string> {
		const root = await this.avatarWidget();

		return root.querySelector("img").getAttribute("title");
	}

	public async getWeight(): Promise<number> {
		const { totalBoxes } = await this.fitnessReport() as any;

		return parseInt(totalBoxes.WEIGHT.value);
	}

	private async fitnessReport(): Promise<unknown> {
		const cookie = this.manager.cookie("checker");

		const reportConfig = {
			"totalBoxes": {
				"WEIGHT": {
					"field": "WEIGHT",
					"showLatest": true
				},
				"PERCENT_BODY_FAT": {
					"field": "PERCENT_BODY_FAT",
					"showLatest": true
				},
				"TOTAL_DISTANCE": {
					"field": "TOTAL_DISTANCE"
				}
			}
		};

		const report = await fetcher.get("/user/jtbuter/fitnessReportsData", {
			"headers": {
				"content-type": "application/x-www-form-urlencoded",
				"cookie": `${cookie.name}=${cookie.value}`
			},
			"body": new URLSearchParams({
				startDate: "1-Aug-2020",
				endDate: "1-Aug-2020",
				timeframeOption: "CUSTOM",
				chartTimeBuckets: "DAY",
				reportConfigJson: JSON.stringify(reportConfig)
			}).toString(),
			"method": "POST"
		});

		return JSON.parse(report);
	}

	private async avatarWidget(): Promise<html.HTMLElement> {
		const cookie = this.manager.cookie("checker");
		const res = await fetcher.get("/settings?getAvatarWidget=", {
			"headers": {
				"cookie": "checker=" + cookie.value
			}
		});

		return html.parse(res);
	}
}

export default new User;