import * as fs from "fs";
import { util } from "./util";
import * as constants from "./constants";
import login from "./login";

type CallbackFunction = (...args: any[]) => void;

interface Cookie {
	name: string;
	value: string;
	[key: string]: string
}

interface CookieManager {
	cookies: Cookie[];
	target: string | null;
}

class CookieManager {
	constructor(target: string = null) {
		this.cookies = [];
		this.target = null;
		
		if (target !== null) {
			this.target = target;

			// Try to read cookie file, and if it doesn't exist make one.
			try {
				const cookies = this.read();

				this.cookies = cookies;
			} catch (error) {
				util.write(this.target, JSON.stringify([]));
			}
		}
	}

	/**
	 * Clears the CookieManager.
	 */
	public clear(): void {
		this.cookies = [];
		util.write(this.target, JSON.stringify([]));
	}

	public empty(): boolean {
		return this.cookies.length === 0;
	}

	/**
	 * Set a cookie value.
	 *
	 * @param  {Cookie} value Cookie containing headers.
	 */
	public append<T>(...args: T[]): void {
		const cookies = [...this.cookies];

		for (let i = 0, l = args.length; i < l; i++) {
			const cookie: any = args[i];
			const index = cookies.findIndex(c => c.name === cookie.name);

			if (index > -1) {
				this.cookies[index] = cookie;
			} else {
				this.cookies.push(cookie);
			}
		}
	}

	/**
	 * Sets an entire cookie array.
	 *
	 * @param  {Cookie[]} array The cookie array.
	 */
	public set<T>(array: T[]): void {
		this.cookies = array as any;
	}

	/**
	 * Saves a cookie to a target file. Throws error if no target
	 * was specified for this instance and no target is passed to
	 * save().
	 *
	 * @param  {string} target The location of the target file
	 * @throws {error}  Errors if no target is specified.
	 */
	public save(target: string = null): void {
		this.target = target ?? this.target;

		if (!fs.existsSync(this.target)) throw new Error("Target not specified");

		util.write(this.target, JSON.stringify(this.cookies));
	}

	/**
	 * Find a cookie matching a signature.
	 *
	 * @param  {CallbackFunction} filter Cookie signature definition.
	 *
	 * @return {Cookie}                  The cookie.
	 */
	public find(filter: CallbackFunction): Cookie {
		return this.cookies.find(filter);
	}

	/**
	 * Returns all cookies.
	 *
	 * @return {Cookie[]} The cookies.
	 */
	public all(): Cookie[] {
		return this.cookies;
	}

	public cookie(name: string): Cookie | undefined {
		return this.find((c: Cookie) => c.name === name);
	}
	
	/**
	 * Reads cookies from a target. Throws error if target doesn't exist.
	 *
	 * @return {Cookie[]} Array containing all the cookies.
	 */
	public read(): Cookie[] {
		return util.read(this.target) as any;
	}
	
	/**
	 * Fetches stats about a cookie file.
	 *
	 * @return {Stats} The file stats.
	 */
	public stat(): fs.Stats {
		return fs.statSync(this.target);
	}
}

const manager = new CookieManager(constants.cookies.target);

const init = async function(): Promise<void> {
	if (!manager.empty()) return;

	const cookies = await login();

	manager.set(cookies);
	manager.save();
}

export {
	CookieManager, Cookie, manager, init
}