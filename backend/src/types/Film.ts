import Entry from "./FilmEntry";
import MovieDBAPI, { MovieDB } from "../moviedbapi";
import { similarity } from "../misc/utils";

class Film {
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

	constructor() {
		this.id = -1;
		this.adult = false;
		this.genre_id = [];
		this.original_language = "";
		this.original_title = "";
		this.overview = "";
		this.popularity = 0.0;
		this.poster_path = "";
		this.backdrop_path = "";
		this.release_date = "";
		this.title = "";
		this.video = false;
		this.vote_average = 0.0;
		this.vote_count = 0;
		this.entries = [] as Entry[];
	}

	static async fromName(name: string, threshold = 0.8): Promise<Film | null> {
		const movieData = await MovieDBAPI.searchMovie(name, threshold);
		if (movieData == null) return null;

		let newFilm = new Film();

		newFilm.id = movieData.id;
		newFilm.adult = movieData.adult;
		newFilm.genre_id = movieData.genre_id;
		newFilm.original_language = movieData.original_language;
		newFilm.original_title = movieData.original_title;
		newFilm.overview = movieData.overview;
		newFilm.popularity = movieData.popularity;
		newFilm.poster_path = MovieDBAPI.getMoviePosterUrl(movieData);
		newFilm.backdrop_path = MovieDBAPI.getMovieBackdropUrl(movieData);
		newFilm.release_date = movieData.release_date;
		newFilm.title = movieData.title;
		newFilm.video = movieData.video;
		newFilm.vote_average = movieData.vote_average;
		newFilm.vote_count = movieData.vote_count;
		newFilm.entries = [] as Entry[];

		return newFilm;
	}

	static async updateEntries(init: Film[] = [], entries: Entry[], threshold = 0.7): Promise<Film[]> {
		let films = init;

		for (const entry of entries) {
			// if this is the first one, add it to the list
			if (films.length == 0) {
				let newFilm = await Film.fromName(entry.torrent_name, threshold);
				if (newFilm != null) {
					newFilm.entries.push(entry);
					films.push(newFilm);
				} else console.log("[-] Film not found in movieDB : " + entry.torrent_name);
			}
			// else first we try to find the film
			else {
				let found: Film | null = null;
				films.every((film) => {
					if (
						similarity(film.title, entry.torrent_name) > threshold ||
						similarity(film.original_title, entry.torrent_name) > threshold
					) {
						found = film;
						return false; // break from loop
					}
					return true; // continue to search
				});
				if (found != null) {
					// if found add to entries only if not already in the entries
					let notthere = true;
					(found as Film).entries.every((entry2) => {
						if (entry2.isEqual(entry)) {
							notthere = false;
							return false;
						}
						return true;
					});
					if (notthere) {
						(found as Film).entries.push(entry);
					}
				} else {
					// else its a new film
					let newFilm = await Film.fromName(entry.torrent_name, threshold);
					if (newFilm != null) {
						newFilm.entries.push(entry);
						films.push(newFilm);
					} else console.log("[-] Film not found in movieDB : " + entry.torrent_name);
				}
			}
		}

		return films;
	}

	toString(): string {
		return (
			"--===MOVIE===--" +
			"\nTitle: " +
			this.title +
			"\nPopularity: " +
			this.popularity +
			"\nNb entries: " +
			this.entries.length
		);
	}
}

export default Film;
