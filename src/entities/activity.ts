import CookieManager from "../cookie-manager";
import { fetcher, util } from "../util";
import { User } from "./user";
import * as html from "node-html-parser";

interface Activity {
	id: number;
	uuid: string;
	type: string;
	user: User;
	day: number;
	month: string;
	year: number;
	start_time: string;
	distance: number;
	duration: string;
	calories: number;
	heart_rate: number;
	elevation: number;
	entry_type: string;
	previous: Activity | null;
	next: Activity | null;
}

class Activity {
	manager: CookieManager;
	user: User;

	public async build(manager: CookieManager, user: User, id: number): Promise<Activity> {
		this.manager = manager;
		this.user = user;
		this.id = id;

		await util.sleep(500);

		return this;
	}

	private async activityRoot(id: number) {
		const cookie = this.manager.cookie("checker");

		const body = await fetcher.get(`/user/${this.user.url}/activity/${id}`, {
			headers: {
				cookie: `${cookie.name}=${cookie.value}`
			}
		});

		const root = html.parse(body);
		const meta: HTMLMetaElement = root.querySelector("[name~='twitter:app:url:iphone']") as any;
		const uuid = meta.content.match(/tripuuid=(.*)&/).pop();

		console.log(uuid);
		
		// const text = document.querySelector(".activitySubTitle");
		// const time = text.textContent.match()
	}

	private async activityPoints() {
		return;
	}
}

export default new Activity;
export { Activity };