import CookieManager from "../cookie-manager";
import { fetcher } from "../util";

interface Activity {
	id: number;
	uuid: string;
	type: string;
	user_id: number;
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

	public async build(manager: CookieManager, id: number): Promise<Activity> {
		console.log(id);

		return this;
	}
}

export default new Activity;
export { Activity };