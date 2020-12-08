class Entry {
	static base_url = "http://127.0.0.1/";

	file_name: string;
	torrent_name: string;
	source_name: string;
	quality: string | undefined;
	resolution: string | undefined;
	download_link: string;
	language: string | undefined;
	seed: number;
	leech: number;
	size: string;

	constructor() {
		this.file_name = "";
		this.torrent_name = "";
		this.source_name = "Unknown site";
		this.quality = undefined;
		this.resolution = undefined;
		this.download_link = "";
		this.language = undefined;
		this.seed = -1;
		this.leech = -1;
		this.size = "0Mb";
	}

	static async fetchRecentMovies(limit = 100): Promise<Entry[]> {
		return [] as Entry[];
	}

	isEqual(other: Entry) {
		return this.file_name == other.file_name;
	}

	toString(): string {
		return (
			"--===MOVIE ENTRY===--" +
			"\nFile name: " +
			this.torrent_name +
			"\nSource: " +
			this.source_name +
			"\nQuality: " +
			this.quality +
			"\nResolution: " +
			this.resolution +
			"\nLanguage: " +
			this.language +
			"\nSeed/Leech: " +
			this.seed +
			"/" +
			this.leech +
			"\nFile size: " +
			this.size +
			"\n"
		);
	}
}

export default Entry;
