import React from "react";
import Entry from "../types/FilmEntry";
import ItemEntry from "./ItemEntry";

interface ItemEntriesHolderProps {
	entries: Entry[];
}

const ItemEntriesHolder = (props: ItemEntriesHolderProps) => {
	return (
		<>
			<p className="f2 bb">Sources</p>
			<div>
				{props.entries ? (
					props.entries.map((entry, index) => <ItemEntry key={index} entry={entry} index={index} />)
				) : (
					<div></div>
				)}
			</div>
		</>
	);
};

export default ItemEntriesHolder;
