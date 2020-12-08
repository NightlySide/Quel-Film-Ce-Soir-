import { Alignment, Button, Classes, Icon, Navbar, NavbarDivider, NavbarGroup, NavbarHeading } from "@blueprintjs/core";
import React from "react";
import { useHistory } from "react-router-dom";
import SearchInput from "./SearchInput";

const TopNavbar = () => {
	const history = useHistory();
	const onFilmClick = () => history.push("/");

	return (
		<Navbar className="navbar">
			<NavbarGroup align={Alignment.LEFT}>
				<Button icon={<Icon icon="chevron-left" iconSize={Icon.SIZE_LARGE} onClick={history.goBack} />} />
				<Button icon={<Icon icon="chevron-right" iconSize={Icon.SIZE_LARGE} onClick={history.goForward} />} />
				<NavbarDivider />
			</NavbarGroup>
			<NavbarGroup align={Alignment.LEFT}>
				<NavbarHeading className="navbar-heading" onClick={onFilmClick}>
					Quel film ce soir ?
				</NavbarHeading>
			</NavbarGroup>
			<NavbarGroup align={Alignment.RIGHT}>
				<Button className={Classes.MINIMAL} icon="film" text="Films" onClick={onFilmClick} />
				<Button className={Classes.MINIMAL} icon="video" text="Series" />
				<NavbarDivider />
				<SearchInput />
			</NavbarGroup>
		</Navbar>
	);
};

export default TopNavbar;
