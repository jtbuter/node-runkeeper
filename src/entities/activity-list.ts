import { User } from "./user";
import { manager } from "../cookie-manager";
import { fetcher, util } from "../util";

interface ActivityList {
	list: ShallowActivity[];
}

interface ShallowActivity {
	activity_id: number;
	[key: string]: any
}

class ActivityList {
	user: User;

	constructor() {
		this.list = [];
	}

	public async get(user: User): Promise<ActivityList> {
		this.user = user;

		const months = await this.activityMonths();
		const list = await Promise.all(months.map(month => this.activityDateRange(month)));

		this.list = list.flat();

		return this;
	}

	public getList(): ShallowActivity[] {
		return this.list;
	}

	private async activityDateRange(date: Date): Promise<ShallowActivity[]> {
		const cookie = manager.cookie("checker");
		
		const query = new URLSearchParams({
			userName: this.user.url,
			startDate: util.runkeeperDate(date, "en-US")
		}).toString();

		const res = await fetcher.get(`/activitiesByDateRange?${query}`, {
			headers: {
				cookie: `${cookie.name}=${cookie.value}`
			}
		}, false);

		const activities = this.processActivities(JSON.parse(res));
		
		return activities.map(a => this.deserialize(a)).reverse();
	}

	private deserialize(shallow: ShallowActivity): ShallowActivity {
		const activity: ShallowActivity = {
			activity_id: shallow.activity_id,
			date: new Date(`${shallow.dayOfMonth} ${shallow.month} ${shallow.year}`),
			unit: shallow.distanceUnits,
			type: shallow.mainText,
			time: shallow.elapsedTime,
			distance: shallow.distance
		};

		return activity;
	}

	private async activityMonths(): Promise<Date[]> {
		const cookie = manager.cookie("checker");

		const startDate = util.runkeeperDate(new Date("1-Jun-2009")); // Runkeeper release date
		const endDate = util.runkeeperDate(new Date());

		const configJson = JSON.stringify({
			charts: {
				all: {
					field: "TOTAL_DISTANCE",
					stacked: true
				}
			}
		});
		
		const body = new URLSearchParams({
			startDate: startDate,
			endDate: endDate,
			timeframeOption: "CUSTOM",
			chartTimeBuckets: "MONTH",
			reportConfigJson: configJson
		}).toString();

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