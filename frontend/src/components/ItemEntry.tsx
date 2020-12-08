import Entry from "../types/FilmEntry";

interface ItemEntryProps {
	entry: Entry;
	index: number;
}

const ItemEntry = (props: ItemEntryProps) => {
	const onClickHandler = () => {
		window.location.href = props.entry.download_link;
	};

	return (
		<div className={props.index === 0 ? "entry-item pa3" : "entry-item pa3 bt"} onClick={onClickHandler}>
			<p className="f5 b">
				<span>{props.entry.source_name}</span>
				<span className="pl3">-</span>
				{props.entry.resolution ? (
					<span className="pl3">Resolution: {props.entry.resolution}</span>
				) : (
					<span></span>
				)}
				{props.entry.quality ? (
					<span className="pl3">Quality: {props.entry.quality.toUpperCase()}</span>
				) : (
					<span></span>
				)}
				<span className="pl3">-</span>
				<span className="pl3">Language: {props.entry.language?.toUpperCase()}</span>
			</p>
			<p className="f6 i">
				<span>Size: {props.entry.size}</span>
				<span className="ph4">Seed: {props.entry.seed}</span>
				<span>Leech: {props.entry.leech}</span>
			</p>
		</div>
	);
};

export default ItemEntry;
