import { Card, Elevation } from "@blueprintjs/core";
import React, { useCallback } from "react";
import Film from "../types/Film";
import { useHistory } from "react-router-dom";

interface ItemCardProps {
	film: Film;
}

const ItemCard = (props: ItemCardProps) => {
	const history = useHistory();

	const handleOnClick = useCallback(() => history.push("/movie/" + props.film.id), [history, props.film.id]);

	return (
		<Card
			interactive={true}
			onClick={handleOnClick}
			elevation={Elevation.TWO}
			className="item-card"
			style={{
				background: `url(${props.film.poster_path ? props.film.poster_path : ""}) center no-repeat`
			}}>
			<p className="card-title f4">{props.film.title}</p>
		</Card>
	);
};

export default ItemCard;
