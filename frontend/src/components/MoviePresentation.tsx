import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Film from "../types/Film";
import { BackendContext } from "../backend-context";
import BackendRequest from "../backend-requests";
import ItemEntriesHolder from "./ItemEntriesHolder";

interface MatchParam {
	movieId: string;
}

const MoviePresentation = () => {
	const { api } = useContext(BackendContext);
	const [film, setFilm] = useState({} as Film);
	const { movieId } = useParams<MatchParam>();

	useEffect(() => {
		BackendRequest.getFilm(api, parseInt(movieId)).then((film) => {
			setFilm(film);
		});
	}, [api, movieId]);

	return (
		<div
			className="present-container pa5"
			style={{
				background: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8) ), url(${
					film.backdrop_path ? film.backdrop_path : film.poster_path
				}) center no-repeat`
			}}>
			<div className="present-infos ph5 fl w-60">
				<p className={film.title ? "f1" : "f1 bp3-skeleton"}>{film.title}</p>
				<p className={film.overview ? "f4 mt5" : "f4 mt5 bp3-skeleton"}>{film.overview}</p>
				<p className={film.vote_average ? "f4 mt5" : "f4 mt5 bp3-skeleton"}>Note: {film.vote_average}/10</p>
			</div>
			<div className={film.entries ? "present-sources pa2 fl w-40" : "present-sources pa2 fl w-40 bp3-skeleton"}>
				<ItemEntriesHolder entries={film.entries} />
			</div>
		</div>
	);
};

export default MoviePresentation;
