import React from "react";
import ReactDOM from "react-dom";

import BackendContextProvider from "./backend-context";
import "./index.css";

import App from "./App";

ReactDOM.render(
	<React.StrictMode>
		<BackendContextProvider>
			<App />
		</BackendContextProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
