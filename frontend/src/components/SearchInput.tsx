import { Popover, Menu, MenuItem, Position, Button, Classes, InputGroup } from "@blueprintjs/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const SearchInput = () => {
	const sources = ["Torrent9", "GKTorrent"];
	const [selected, setSelected] = useState(0);
	const [searchValue, setSearchValue] = useState("");
	const history = useHistory();

	const permissionsMenu = (
		<Popover
			content={
				<Menu>
					{sources.map((source, index) => {
						const onClick = () => {
							setSelected(index);
						};

						return <MenuItem key={index} text={source} onClick={onClick} />;
					})}
				</Menu>
			}
			position={Position.BOTTOM_RIGHT}>
			<Button className={Classes.MINIMAL} rightIcon="caret-down">
				{sources[selected]}
			</Button>
		</Popover>
	);

	const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.currentTarget.value);
	};

	const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			history.push("/search/" + searchValue);
		}
	};

	return (
		<>
			<InputGroup
				className={Classes.MINIMAL}
				placeholder="Search movie ..."
				rightElement={permissionsMenu}
				onKeyPress={onKeyPress}
				value={searchValue}
				onChange={onValueChange}
			/>
		</>
	);
};

export default SearchInput;
