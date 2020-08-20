import activity, { Activity } from "./activity";
import { User } from "./user";
import { CookieManager } from "../cookie-manager";
import { fetcher, util } from "../util";

interface ActivityList {
	list: typeof Activity[];
}

interface ShallowActivity {
	activity_id: number;
	[key: string]: any
}

class ActivityList {
	manager: CookieManager;
	user: User;

	constructor() {
		this.list = [];
	}

	public async build(manager: CookieManager, user: User): Promise<ActivityList> {
		this.manager = manager;
		this.user = user;

		const months = await this.activityMonths();
		const list = await Promise.all(months.map(month => this.activityDateRange(month)));
		const activities = list.flat().map(a => activity.build(manager, user, a.activity_id));

		this.list = await Promise.all(activities) as any;

		return this;
	}

	public getList(): typeof Activity[] {
		return this.list;
	}

	private async activityDateRange(date: Date): Promise<ShallowActivity[]> {
		const cookie = this.manager.cookie("checker");
		
		const query = new URLSearchParams({
			userName: this.user.url,
			startDate: util.runkeeperDate(date, "en-US")
		}).toString();

		const res = await fetcher.get(`/activitiesByDateRange?${query}`, {
			headers: {
				cookie: `${cookie.name}=${cookie.value}`
			}
		}, false);

		return this.processActivities(JSON.parse(res));
	}

	private async activityMonths(): Promise<Date[]> {
		const cookie = this.manager.cookie("checker");

		const startDate = util.runkeeperDate(new Date("1-Jun-2009")); // Runkeeper release date
		const endDate = util.runkeeperDate(new Date());

		const configJson = JSON.stringify({
			charts: {
				all: {
					field: "TOTAL_DISTANCE",
					stacked: true
				}
			}
		})
		
		const body = new URLSearchParams({
			startDate: startDate,
			endDate: endDate,
			timeframeOption: "CUSTOM",
			chartTimeBuckets: "MONTH",
			reportConfigJson: configJson
		}).toString()

		const report = await fetcher.get(`/user/${this.user.url}/fitnessReportsData`, {
			method: "POST",
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				cookie: `${cookie.name}=${cookie.value}`
			},
			body: body
		}, false);
		
		return this.processReport(JSON.parse(report));
	}

	private processActivities(json: any): ShallowActivity[] {
		const year = Object.keys(json.activities).pop();
		const month = Object.keys(json.activities[year]).pop();

		return json.activities[year][month];
	}

	private processReport(report: any): Date[] {
		const { charts } = report;
		const { all } = charts;
		const { series }: { series: Record<string, unknown>[] } = all;

		const full = [];

		for (const element of series) {
			const points = element.dataPointsList as Record<string, number>[];
			const dates = points.reduce((f, p) => {
				if (p.numSamples > 0) f.push(new Date(p.x));

				return f;
			}, []);

			full.push(dates);
		}

		return full.flat();
	}
}

export default new ActivityList;
export { ActivityList };