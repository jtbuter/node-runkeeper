import CookieManager from "../cookie-manager";
import * as html from "node-html-parser";
import * as fetcher from "../fetch";

interface Preferences {
	weight: string;
	distance: string;
}

interface User {
	id: number;
	name: string;
	display: string;
	weight: number;
	avatar: string;
	url: string;
	bodyFat: string;
	preferences: Preferences;
	manager?: CookieManager;
}

class User {
	public async build(manager: CookieManager): Promise<User> {
		this.manager = manager;

		this.id = await this.getId();
		this.url = await this.getUrl();
		this.avatar = await this.getAvatar();

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

	private async avatarWidget() {
		const cookie = this.manager.cookie("checker");
		const res = await fetcher.get("settings?getAvatarWidget=", {
			"headers": {
				"cookie": "checker=" + cookie.value
			}
		});

		return html.parse(res);
	}
}

export default new User;