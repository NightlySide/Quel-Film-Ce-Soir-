import Entry from "../types/FilmEntry";
import { fetchHTML } from "../scraper";
import torrentNameParser from "parse-torrent-title";
import Film from "../types/Film";
import { addHandlerToParser } from "../misc/torrNameParsHandler";
import SharedVars from "../shared";

class Torrent9Entry extends Entry {
	static base_url = "https://www.torrent9.so/";

	constructor() {
		super();
		this.source_name = "Torrent9";
	}

	static async fromCheerioElement($: cheerio.Root, element: cheerio.Element): Promise<Torrent9Entry> {
		let newEntry = new Torrent9Entry();

		const link = $(element).find("a");

		newEntry.file_name = $(link).text();
		newEntry.download_link = await newEntry.getDownloadLinkFromDownloadPage($(link).attr("href") as string);
		newEntry.seed = parseInt($(element).find("td:nth-child(3)").text());
		newEntry.leech = parseInt($(element).find("td:nth-child(4)").text());
		newEntry.size = $(element).find("td:nth-child(2)").text();

		addHandlerToParser(torrentNameParser);
		const name_infos = torrentNameParser.parse(newEntry.file_name);
		newEntry.quality = name_infos.source;
		newEntry.resolution = name_infos.resolution;
		newEntry.torrent_name = name_infos.title;
		newEntry.language = name_infos.language;

		return newEntry;
	}

	async getDownloadLinkFromDownloadPage(download_page: string): Promise<string> {
		const $ = await fetchHTML(new URL(download_page, Torrent9Entry.base_url).href);

		return new Promise<string>((resolve, reject) => {
			$("script").each((index: number, element: cheerio.Element) => {
				const text = $(element).html();
				if (text != null && text.includes("redirect()")) {
					const matches = $(element)
						.html()
						?.match(/\/\btelecharger[a-zA-Z0-9\/]*'/);
					if (matches != null)
						resolve(new URL(matches[0].substring(0, matches[0].length - 1), Torrent9Entry.base_url).href);
				}
			});
			reject("[-] No link found in download page");
		});
	}

	static async fetchRecentMovies(limit = 100): Promise<Torrent9Entry[]> {
		let c = 0;
		let page = 1;
		let entries = [] as Torrent9Entry[];

		while (c < limit) {
			console.log("[Torrent9] Loading page : " + new URL("/torrents/films/" + page, Torrent9Entry.base_url).href);
			const $ = await fetchHTML(new URL("/torrents/films/" + page, Torrent9Entry.base_url).href);
			// getting the lines
			let lines = [] as cheerio.Element[];
			$(".table > tbody:nth-child(2) > tr").each((index: number, element: cheerio.Element) =>
				lines.push(element)
			);

			// fetching the data
			await Promise.all(
				lines.map(async (element) => {
					const entry = await this.fromCheerioElement($, element);
					if (entry.seed > 0 && entry.leech > 0) {
						entries.push(entry);
						c++;
					}
				})
			);

			page += 50;
		}

		console.log(`[Torrent9] \u{1F3A5} Loaded ${entries.slice(0, limit).length} movies !`);
		return entries.slice(0, limit);
	}
}

class Torrent9Search {
	static async fromCheerioElement($: cheerio.Root, element: cheerio.Element): Promise<Torrent9Entry> {
		let newEntry = new Torrent9Entry();

		const link = $(element).find("a");

		newEntry.file_name = $(link).text();
		newEntry.download_link = await newEntry.getDownloadLinkFromDownloadPage($(link).attr("href") as string);
		newEntry.seed = parseInt($(element).find("td:nth-child(3)").text());
		newEntry.leech = parseInt($(element).find("td:nth-child(4)").text());
		newEntry.size = $(element).find("td:nth-child(2)").text();

		const name_infos = torrentNameParser.parse(newEntry.file_name);
		newEntry.quality = name_infos.source;
		newEntry.resolution = name_infos.resolution;
		newEntry.torrent_name = name_infos.title;
		newEntry.language = name_infos.language;

		return newEntry;
	}

	static async searchMovie(query: string): Promise<Film[]> {
		console.log("[Torrent9] Searching : " + query);
		console.log("[Torrent9] Loading page : " + new URL("/recherche/" + query, Torrent9Entry.base_url).href);
		const $ = await fetchHTML(new URL("/recherche/" + query, Torrent9Entry.base_url).href);

		// getting the lines
		let lines = [] as cheerio.Element[];
		$(".table > tbody:nth-child(1) > tr").each((index: number, element: cheerio.Element) => lines.push(element));

		console.log("[Torrent9] Search : found " + lines.length + " elements!");

		let entries: Entry[] = [];
		// fetching the data
		await Promise.all(
			lines.map(async (element) => {
				if ($(element).find("td:nth-child(1) > i").attr("class") == "Films") {
					const entry = await this.fromCheerioElement($, element);
					entries.push(entry);
				}
			})
		);

		SharedVars.films = await Film.updateEntries(SharedVars.films, entries, 0.5);
		return await Film.updateEntries([], entries, 0.5);
	}
}

export { Torrent9Entry, Torrent9Search };
