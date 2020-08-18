import * as constants from "./src/constants";
import CookieManager from "./src/cookie-manager";
import login from "./src/login";
import { User, ActivityList } from "./src/entities";

(async () => {
	const manager = new CookieManager(constants.cookies.target);

	if (manager.empty()) {
		const cookies = await login();

		manager.set(cookies);
		manager.save();
	}
	
	const user = await User.build(manager);
	const activities = await ActivityList.build(manager, user);
})();