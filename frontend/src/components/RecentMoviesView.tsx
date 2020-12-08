import { Spinner } from "@blueprintjs/core";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Film from "src/types/Film";
import ItemCard from "./ItemCard";

interface RecentMoviesViewData {
	films: Film[];
	mainRef: React.MutableRefObject<HTMLDivElement | undefined>;
}

const RecentMoviesView = (props: RecentMoviesViewData) => {
	const [toShow, setToShow] = useState([] as Film[]);
	const [lastIndex, setLastIndex] = useState(0);

	const nbToLoad = 15;

	const loadMore = (page: number) => {
		console.log("Loading more: " + page);
		console.log("Length : " + toShow.length);
		setToShow(props.films.slice(0, (page + 1) * nbToLoad));
		setLastIndex(lastIndex + nbToLoad);
	};

	const canLoad = () => {
		return toShow.length > 0 && toShow.length < props.films.length;
	};

	useEffect(() => {
		setToShow(props.films.slice(0, nbToLoad));
	}, [props.films]);

	return (
		<InfiniteScroll
			pageStart={0}
			loadMore={loadMore}
			hasMore={canLoad()}
			useWindow={false}
			getScrollParent={() => props.mainRef.current as HTMLElement | null}
			loader={<Spinner size={50} className="mt6 w-100" />}>
			{toShow.map((film: any, index: number) => (
				<div key={index} className="fl w-20 pa2">
					<ItemCard film={film} />
				</div>
			))}
		</InfiniteScroll>
	);
};

export default RecentMoviesView;
