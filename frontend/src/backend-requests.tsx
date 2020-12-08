import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import Film from "./types/Film";

const getFilms = async (api: ApolloClient<NormalizedCacheObject>): Promise<Film[]> => {
	const results = await api.query({
		query: gql`
			query {
				films {
					id
					adult
					genre_id
					original_language
					original_title
					overview
					popularity
					poster_path
					backdrop_path
					release_date
					title
					video
					vote_average
					vote_count
					entries {
						file_name
						torrent_name
						source_name
						quality
						resolution
						download_link
						language
						seed
						leech
						size
					}
				}
			}
		`
	});

	return results.data.films;
};

const getFilm = async (api: ApolloClient<NormalizedCacheObject>, id: number): Promise<Film> => {
	const results = await api.query({
		query: gql`
			query {
				film(id: ${id}) {
					id
					adult
					genre_id
					original_language
					original_title
					overview
					popularity
					poster_path
					backdrop_path
					release_date
					title
					video
					vote_average
					vote_count
					entries {
						file_name
						torrent_name
						source_name
						quality
						resolution
						download_link
						language
						seed
						leech
						size
					}
				}
			}
		`
	});
	return results.data.film as Film;
};

const searchFromName = async (api: ApolloClient<NormalizedCacheObject>, queryName: string): Promise<Film[]> => {
	const results = await api.query({
		query: gql`
			query {
				searchMovie(query: "${queryName}") {
					id
					adult
					genre_id
					original_language
					original_title
					overview
					popularity
					poster_path
					backdrop_path
					release_date
					title
					video
					vote_average
					vote_count
					entries {
						file_name
						torrent_name
						source_name
						quality
						resolution
						download_link
						language
						seed
						leech
						size
					}
				}
			}
		`
	});
	return results.data.searchMovie as Film[];
};

const obj = { getFilms, getFilm, searchFromName };
export default obj;
