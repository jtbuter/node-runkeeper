import * as helper from "./src/helper";
import login from "./src/login";

// const evaluator = async (): Promise<string[]> => {
// 	const feeds = Array.from(document.querySelectorAll(".feedItem"));
// 	const activities = feeds.filter((e: HTMLElement) => {
// 		return /^\/activity/.test(e.dataset.link);
// 	});

// 	const running = activities.map(async (e: HTMLElement): Promise<string> => {
// 		const content = e.querySelector(".mainText").lastChild.textContent;

// 		// @ts-ignore
// 		return window.normalize(content);
// 	});

// 	return Promise.all(running);
// }

async function startProject() {
	const [browser, page] = await helper.init();

	await login(page);

	await page.goto("https://runkeeper.com/home");
	await page.exposeFunction("normalize", helper.normalize);

	// const data = await page.evaluate(evaluator);

	browser.close();
}

startProject();