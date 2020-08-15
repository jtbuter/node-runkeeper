// import * as cookie from "js-cookie";

// const cookie = "ak_bmsc=E463A8128E2131AA587DFEE8D28A83C55F654F4C9D2C000028C3365F5BF92E28~plvtXYkGjPcUKr4vyeQyHuIS/vxDoc3NA8TLILyTewyZaRDq2j6ExAiz/oMNZOmxTt2f2HclTQU+zj4D57c90H+jTtRiHK3Iv+zpSldOiTnmiZk2uOG4vsqzVFro2fuOA8YFMhlhF4epcekBzg1xlFSYp4C4YGUfjIJxYpDowWs1TKJTetxYvo1LLTIBWKLpef93CGZpf5tfhbskFf+DmQ2j0mrfd86HaVIS+Nlne415I=; expires=Fri, 14 Aug 2020 19:00:24 GMT; max-age=7200; path=/; domain=.asics.com; HttpOnly, bm_mi=63247378B377134B343C36221DC5298C~K6RsiWDSKJ0NS3DcipBHMzNJalWS+CpPs8wc48neqh8NmGUQU60QWddQabJV1Brk0pxDickOpg/AspB/OXIvl1TDDMsID3xyYIhL126mPVBOSbxm9ygnJYIGZZfSWlu3qm9Stef03sZAKtV5dzK0ge+hflxzEp+8OAu/zFxvfW9kVEm7MuNmfIFky6DgweQjX0yD9UgucaPEvIK21R+os0M4GVLfWcredwqnQucHjx4=; Domain=.asics.com; Path=/; Max-Age=0; HttpOnly, bm_sz=451509633ECE3501CF2F842911ECC960~YAAQTE9lXy5oPeRzAQAAxlTq7QhqAC3VOla28g0TYL7ePjpPIVxGZAXzPPoUMk0IovdPs3a+q5oNm2/PAY6/P+MSLOYugyULnMppjfNoxFZqLJckm/Zu6hMrAhcOQVBtbIrpXhBKka0bU+7oZrhhZt1Eaetyu6qfKtrhOdI9VD8qqFC/qjhQNJOxEaYzM7o=; Domain=.asics.com; Path=/; Expires=Fri, 14 Aug 2020 21:00:23 GMT; Max-Age=14399; HttpOnly, _abck=9FF909453142A69F2FC965488E3386A9~-1~YAAQTE9lXy9oPeRzAQAAxlTq7QSns0mHl8U+0/DI+epveSEgbVzhTFP+ZndUugGKdnXBK3FvD2wURCIuSRnBWvkdeqAyM+txAnV2/qQf6EH+JNfvWg3hiYQsVce+s4ZM5xB9mGT6JCP2pJOm/aDrLYndsy1tIRxAsP3OZQg3s2cgPz68VkiAR07zE6PSwBBPg9+1CnIWldmMAwnivthjQi0xKyLuI3hkO+x7+nSDBRwtIG/ewK2ybwM7NtlBBLky+2hI3+P0i9+cuf6d7jU1lSUzUgr1x2trxBrf09WOY9Obibl62tDczSk=~-1~-1~-1; Domain=.asics.com; Path=/; Expires=Sat, 14 Aug 2021 17:00:24 GMT; Max-Age=31536000; Secure";

// document.cookie = cookie;

// console.log(document.cookie);

// console.log(cookie.split(";").reduce((cookies, cookie) => {
// 	const [name, value] = cookie.split("=").map(c => c.trim());
// 	cookies[name] = value;
// 	return cookies;
// }, {}));

// // import * as helper from "./src/helper";
// // import login from "./src/login";
import fetch from "node-fetch";

(async () => {
	const url = new URL("/login", "https://id.asics.com");

	url.searchParams.append("style", "runkeeper");
	url.searchParams.append("client_id", "runkeeper");

	const headers = {
		"mode": "cors",
		"credentials": "include"
	};

	const res = await fetch(url.toString(), headers);
	const cookie = res.headers.get("set-cookie");

	console.log(cookie);

	const res2 = await fetch("https://id.asics.com/oauth2/token/auth", {
		"headers": {
			"accept": "application/json, text/javascript, */*; q=0.01",
			"accept-language": "nl,nl-NL;q=0.9,en-US;q=0.8,en;q=0.7",
			"cache-control": "no-cache",
			"content-type": "application/x-www-form-urlencoded",
			"pragma": "no-cache",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"x-requested-with": "XMLHttpRequest",
			"cookie": cookie
		},
		"body": "username=blaazkaak%40hotmail.com&password=Maandag02!&language=en&locale=en-US&grant_type=password&client_id=runkeeper&style=runkeeper&max_cookie_timeout=&platform=web",
		"method": "POST",
		"mode": "cors",
		"credentials": "include"
	});

	console.log(res2.status);
	
})();

// import * as cookie from "cookie";
// import { Cookie } from "set-cookie-parser";
// import * as cookieParser from "cookie-parser";

// const parseCookie = str =>
// 	str
// 		.split(';')
// 		.map(v => v.split('='))
// 		.reduce((acc, v) => {
// 			acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
// 			return acc;
// 		}, {});

// async function fetchCookies(): Promise<Cookie[]> {
// 	const url = new URL("/login", "https://id.asics.com");

// 	url.searchParams.append("style", "runkeeper");
// 	url.searchParams.append("client_id", "runkeeper");

// 	const headers = {
// 		"mode": "cors",
// 		"credentials": "include"
// 	};

// 	const res = await fetch(url.toString(), headers);

// 	console.log(res.headers.get("set-cookie"));
	
// 	console.log(parseCookie(res.headers.get("set-cookie")));
	
// 	// @ts-ignore
// 	return cookieParser.JSONCookie(res.headers.get("set-cookie"));
// }

// async function launch() {
// 	// const [browser, page] = await helper.init();

// 	// await login(page);
	
// 	// const cookies = await helper.timeout(, 5000);
// 	// const cookies = (await fetchCookies()).map((cookie: Cookie) => {
// 	// 	return `${cookie.name}=${cookie.value}`
// 	// });

// 	await fetchCookies();
// 	// console.log(await fetchCookies());
	

// 	return;

// 	// const url = new URL("/ajax/pointData", "https://runkeeper.com");
	
// 	// url.searchParams.append("tripUuid", "7e479ddb-37ae-419c-bced-5be83e2578cc");

// 	// const params = {
// 	// 	headers: {
// 	// 		"sec-fetch-dest": "empty",
// 	// 		"sec-fetch-mode": "cors",
// 	// 		"sec-fetch-site": "same-origin",
// 	// 		"cookie": cookies
// 	// 	},
// 	// 	method: "GET",
// 	// 	mode: "cors",
// 	// };

// 	// const json = await fetch(url.toString(), params).then(r => r.json());

// 	// console.log(json);

// 	// browser.close();
// }

// launch();