import React, { useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./App.css";

import { BackendContext } from "./backend-context";
import BackendRequests from "./backend-requests";
import MoviePresentation from "./components/MoviePresentation";
import TopNavbar from "./components/TopNavbar";
import Film from "./types/Film";
import SearchView from "./components/SearchView";
import { Spinner } from "@blueprintjs/core";
import RecentMoviesView from "./components/RecentMoviesView";

function compareReleaseDate(a: Film, b: Film) {
	if (a.release_date > b.release_date) return -1;
	if (a.release_date < b.release_date) return 1;
	return 0;
}

function App() {
	const { api } = useContext(BackendContext);
	const [films, setFilms] = useState([] as Film[]);
	const mainRef = useRef<HTMLDivElement>();

	useEffect(() => {
		const fetchData = async () => {
			const res = await BackendRequests.getFilms(api);
			setFilms(res);
		};
		fetchData();

		return () => {
			setFilms([]);
		};
	}, [api]);

	let sortedFilms = films ? [...films] : null;
	if (sortedFilms) sortedFilms.sort(compareReleaseDate);

	return (
		<Router>
			<div className="App bp3-dark">
				<TopNavbar />
				<div
					className="main"
					ref={(ref) => {
						if (ref != null) mainRef.current = ref;
					}}>
					<Route path="/" exact={true}>
						<div className="cf w-100 ph3 pv3">
							{sortedFilms == null ? (
								<Spinner size={100} className="mt6" />
							) : (
								<RecentMoviesView films={sortedFilms} mainRef={mainRef} />
							)}
						</div>
					</Route>
					<Route path="/movie/:movieId">
						<MoviePresentation />
					</Route>
					<Route path="/search/:query">
						<SearchView />
					</Route>
				</div>
			</div>
		</Router>
	);
}

export default App;
