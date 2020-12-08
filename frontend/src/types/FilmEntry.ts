export default interface Entry {
	base_url: string;
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
}
