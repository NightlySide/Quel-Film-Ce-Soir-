import { Divider, Spinner } from "@blueprintjs/core";
import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BackendContext } from "../backend-context";
import BackendRequests from "../backend-requests";
import Film from "../types/Film";
import ItemCard from "./ItemCard";

interface MatchParam {
	query: string;
}

const SearchView = () => {
	const { query } = useParams<MatchParam>();
	const { api } = useContext(BackendContext);
	const [films, setFilms] = useState([] as Film[]);

	useEffect(() => {
		const fetchData = async () => {
			const res = await BackendRequests.searchFromName(api, query);
			setFilms(res);
		};
		fetchData();

		return () => {
			setFilms([]);
		};
	}, [api, query]);

	return (
		<div className="cf w-100 ph3 pv3">
			<p className="f1 ph4 w-100">Searching : {query}</p>
			<Divider />
			{films.length === 0 ? (
				<Spinner size={100} className="mt6" />
			) : (
				films.map((film: any, index: number) => (
					<div key={index} className="fl w-20 pa2">
						<ItemCard film={film} />
					</div>
				))
			)}
		</div>
	);
};

export default SearchView;
