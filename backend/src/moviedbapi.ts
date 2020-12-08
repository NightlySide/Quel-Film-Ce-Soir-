import fetch from "node-fetch";
import { similarity } from "./misc/utils";

const api_key = "22505538861abed57976545d723cb6ea";
const poster_base_url = "https://image.tmdb.org/t/p/w500";
const backdrop_base_url = "https://image.tmdb.org/t/p/w1280";
const qualities = {
	poster: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
	backdrop: ["w300", "w780", "w1280", "original"]
};

export interface MovieDB {
	adult: boolean;
	backdrop_path: string | null;
	genre_id: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

class MovieDBAPI {
	static async searchMovie(movieName: string, threshold = 0.8): Promise<MovieDB | null> {
		let url =
			"https://api.themoviedb.org/3/search/movie?api_key=" +
			api_key +
			"&query=" +
			encodeURIComponent(movieName) +
			"&language=fr&include_image_language=fr,en,null";
		const data = await fetch(url);
		const res_json = JSON.parse(await data.text());

		// if there is only one, no need to filter
		if (res_json.results.length == 1) return res_json.results[0];

		let filtered_data = [];
		filtered_data = res_json.results.filter((res: MovieDB) => {
			return similarity(res.title, movieName) > threshold ? res : null;
		});

		if (filtered_data.length == 0) return null;

		return filtered_data.reduce(function (prev: MovieDB, current: MovieDB) {
			return prev.popularity > current.popularity ? prev : current;
		});
	}

	static getMoviePosterUrl(movie: MovieDB): string {
		return movie.poster_path ? poster_base_url + movie.poster_path : "";
	}

	static getMovieBackdropUrl(movie: MovieDB): string {
		return movie.backdrop_path ? backdrop_base_url + movie.backdrop_path : "";
	}
}

export default MovieDBAPI;
