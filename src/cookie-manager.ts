import * as fs from "fs";
import * as path from "path";

interface CookieManager {
	cookies: Record<string, unknown>[];
	target?: string;
}

class CookieManager {
	constructor(target?: string) {
		this.cookies = [];

		if (target !== undefined) {
			this.target = target;

			this._createCookieDir();

			fs.writeFileSync(this.target, JSON.stringify(this.cookies))
		}
	}

	public set(name: string, value: Record<string, unknown>): void {
		this.cookies[name] = value;
	}

	public save(target: string = null): void {
		this.target = target ?? this.target;

		this._createCookieDir();

		fs.writeFileSync(this.target, JSON.stringify(this.cookies));
	}

	public read(): Record<string, unknown> {
		if (!fs.existsSync(this.target)) return null;

		return JSON.parse(fs.readFileSync(this.target, "utf-8"));
	}

	public stat(): fs.Stats {
		return fs.statSync(this.target);
	}

	private _createCookieDir(): void {
		if (!fs.existsSync(this.target)) {
			fs.mkdirSync(path.dirname(this.target), { recursive: true });
		}
	}
}

export default CookieManager;