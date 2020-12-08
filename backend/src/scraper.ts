import cheerio from "cheerio";
import fetch from "node-fetch";

const fetchHTML = async (url: string) => {
	const res = await fetch(url, {
		method: "GET",
		headers: {},
		body: undefined,
		redirect: "follow",
		compress: true
	});
	return cheerio.load(await res.text());
};

export { fetchHTML };
