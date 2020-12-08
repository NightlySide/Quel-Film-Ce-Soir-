import Entry from "../types/FilmEntry";
import { fetchHTML } from "../scraper";
import torrentNameParser from "parse-torrent-title";

class GKTorrentEntry extends Entry {
	static base_url = "https://vww.gktorrent.pw";

	constructor() {
		super();
		this.source_name = "GKTorrent";
	}

	static async fromCheerioElement($: cheerio.Root, element: cheerio.Element): Promise<GKTorrentEntry> {
		let newEntry = new GKTorrentEntry();

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

	async getDownloadLinkFromDownloadPage(download_page: string): Promise<string> {
		const $ = await fetchHTML(new URL(download_page, GKTorrentEntry.base_url).href);

		return new Promise<string>((resolve, reject) => {
			$("script").each((index: number, element: cheerio.Element) => {
				const text = $(element).html();
				if (text != null && text.includes("redirect()")) {
					const matches = $(element)
						.html()
						?.match(/\/\btelecharger[a-zA-Z0-9\/]*'/);
					if (matches != null)
						resolve(new URL(matches[0].substring(0, matches[0].length - 1), GKTorrentEntry.base_url).href);
				}
			});
			reject("[-] No link found in download page");
		});
	}

	static async fetchRecentMovies(limit = 100): Promise<GKTorrentEntry[]> {
		let c = 0;
		let page = 1;
		let entries = [] as GKTorrentEntry[];

		while (c < limit) {
			console.log(
				"[GKTorrent] Loading page : " + new URL("/torrents/films/" + page, GKTorrentEntry.base_url).href
			);
			const $ = await fetchHTML(new URL("/torrents/films/" + page, GKTorrentEntry.base_url).href);
			// getting the lines
			let lines = [] as cheerio.Element[];
			$(".table > tbody:nth-child(1) > tr").each((index: number, element: cheerio.Element) =>
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

		console.log(`[GKTorrent] \u{1F3A5} Loaded ${entries.slice(0, limit).length} movies !`);
		return entries.slice(0, limit);
	}
}

export default GKTorrentEntry;
