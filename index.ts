import * as CookieManager from "./src/cookie-manager";
import { User } from "./src/entities";
import resources, { db } from "./src/util/resources";

(async () => {
	await CookieManager.init();

	await resources.init();

	const collection = db.collection('activities');

	await collection.insertOne({
		"activity_id": 3
	});

	a

	

	console.log(await collection.findOne({activity_id: 3}));
	
	// const user = await User.get("jtbuter");


	// console.log(user);
	

	// const activities = await ActivityList.get(user);

	// console.log(activities.getList());
})();