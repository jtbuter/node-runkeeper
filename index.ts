const puppeteer = require('puppeteer');
const fs = require('fs');

const cookieTarget = './cookies.json';
const Hours24 = 24 * 60 * 60 * 1000;

const cookieLogin = async function (page) {
	const cookiesString = fs.readFileSync(cookieTarget);
	const cookies = JSON.parse(cookiesString);

	await page.setCookie(...cookies);
};

const userLogin = async function (username, password, page) {
	await page.goto('https://runkeeper.com/login');
	await page.type('input[data-fieldid=a_email]', username);
	await page.type('input[data-fieldid=a_password]', password);
	await page.click('button[data-clickaction=login]');

	await page.waitForNavigation();

	await page.waitForSelector('#onetrust-accept-btn-handler');
	await page.click('#onetrust-accept-btn-handler');
}

const login = async (username, password) => {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	await page.setViewport({ width: 1280, height: 800 });

	const creationDate = await new Promise(resolve => {
		fs.stat(cookieTarget, (err, stats) => {
			resolve(err ? null : stats.birthtime);
		});
	});

	if (creationDate === null || (new Date() - creationDate) > Hours24) {
		await userLogin(username, password, page);

		fs.writeFileSync(cookieTarget, JSON.stringify(await page.cookies()));
	} else {
		await cookieLogin(page);
	}

	return { browser: browser, page: page };
};


(async () => {
	const getActivity = (a, b) => {
		console.log(a, b);
		// const str = e.querySelector('.mainText').lastChild.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
		// const regex = `completed a (.*) ${type} activity`;
	
		// const match = str.match(new RegExp(regex));
	
		// return match ? match[1] : null;
	};

	const { browser, page } = await login('blaazkaak@hotmail.com', 'Maandag02!');

	await page.goto('https://runkeeper.com/home');

	
	const data = await page.evaluate(((callback) => {
		callback('a', 'b');
	})(getActivity));
		// () => {
		// const act = Array.from(document.querySelectorAll('.feedItem')).filter(e => {
		// 	return /\/activity_redirect\/.*/.test(e.dataset.link);
		// });

		// return act.map(e => getActivity(e, 'running'));

		// return activities.map(e => {

		// 	let type = 'running';
		// 	const str = e.querySelector('.mainText').lastChild.textContent;
		// 	const regex = `completed a (.*) ${type} activity`;

		// 	const match = str.match(new RegExp(regex));

		// 	return match ? match[1] : null;
		// });
	

	console.log(data);
})()