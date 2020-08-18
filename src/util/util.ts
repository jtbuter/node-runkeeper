import * as fs from "fs";
import * as path from "path";
import * as intl from "intl";

/**
 * Returns the contents of a .json file.
 *
 * @param  {string} target The location of the file.
 *
 * @return {any[]}         The parsed json.
 */
export function read(target: string): unknown | null {
	if (!fs.existsSync(target)) return null;

	return JSON.parse(fs.readFileSync(target, "utf-8"));
}

/**
 * Helper function that creates a directory and file if
 * target doesn't exist.
 */
export function createDir(target: string): void {
	if (!fs.existsSync(target)) {
		fs.mkdirSync(path.dirname(target), { recursive: true });
	}
}

/**
 * Helper that unconditionally writes all cookies to a file, checking
 * for a valid target should be done elsewhere.
 */
export function write(target: string, data: string): void {
	this.createDir();

	fs.writeFileSync(target, data);
}

/**
 * Converts a Javascript Date to a Runkeeper date.
 *
 * @param  {Date}   date The Date to convert.
 *
 * @return {string}      A Runkeeper date.
 */
export function runkeeperDate(date: Date = new Date(), format = "en-GB"): string {
	const dateString = intl.DateTimeFormat(format, {
		day: "numeric",
		month: "short",
		year: "numeric"
	}).format(date);

	return dateString.replace(/(, | )/g, "-");
}