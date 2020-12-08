import { fetchHTML } from "../scraper";

class Film {
	name: string;
	base_url: string;
	download_page: string;
	download_link: string | null;
	quality_rip: string | null;
	quality_p: string | null;
	seed: number;
	leech: number;
	size: string;

	constructor() {
		this.name = "";
		this.base_url = "";
		this.download_page = "";
		this.download_link = null;
		this.quality_rip = "";
		this.quality_p = "";
		this.seed = 0;
		this.leech = 0;
		this.size = "";
	}

	static fromTorrent9(base_url: string, $: cheerio.Root, element: cheerio.Element): Film {
		const link = $(element).find("a");
		const quality_rip_match = $(link)
			.text()
			.match(/[A-Z]*RIP\b/gi);
		const quality_p_match = $(link)
			.text()
			.match(/[0-9][0-9]*p\b/gi);

		const newFilm = new Film();
		newFilm.base_url = base_url;
		newFilm.name = $(link)
			.text()
			.split(/[ A-Z]*FRENCH\b/)[0];
		newFilm.download_page = $(link).attr("href") as string;
		newFilm.quality_rip = quality_rip_match ? quality_rip_match[0] : null;
		newFilm.quality_p = quality_p_match ? quality_p_match[0] : null;
		newFilm.seed = parseInt($(element).find("td:nth-child(3)").text());
		newFilm.leech = parseInt($(element).find("td:nth-child(4)").text());
		newFilm.size = $(element).find("td:nth-child(2)").text();

		return newFilm;
	}

	async getDownloadLinkFromDownloadPage() {
		const $ = await fetchHTML(new URL(this.download_page, this.base_url).href);
		//console.log(f_$.html());
		$("script").each((index: number, element: cheerio.Element) => {
			const text = $(element).html();
			if (text != null && text.includes("redirect()")) {
				const matches = $(element)
					.html()
					?.match(/\/\btelecharger[a-zA-Z0-9\/]*'/);
				if (matches != null)
					this.download_link = new URL(matches[0].substring(0, matches[0].length - 1), this.base_url).href;
			}
		});
	}

	// implement zooqle

	toString(): string {
		return `Film : {Name: ${this.name}, Quality: ${this.quality_rip + " " + this.quality_p}, Size: ${
			this.size
		}, Seed: ${this.seed}, Leech: ${this.leech}}`;
	}
}

export default Film;
