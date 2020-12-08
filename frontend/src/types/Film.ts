import Entry from "./FilmEntry";

export default interface Film {
	id: number;
	adult: boolean;
	genre_id: number[];
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	backdrop_path: string | null;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
	entries: Entry[];
}
