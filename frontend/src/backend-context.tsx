import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import React, { useState } from "react";

export interface BackendContextData {
	api: ApolloClient<NormalizedCacheObject>;
	setApi: Function;
}

export const BackendContext = React.createContext({
	api: new ApolloClient({ uri: "", cache: new InMemoryCache() }),
	setApi: () => {}
} as BackendContextData);

const BackendContextProvider = (props: any) => {
	const client = new ApolloClient({
		uri: "http://127.0.0.1:4000/graphql",
		cache: new InMemoryCache()
	});
	const [api, setApi] = useState(client);

	const store: BackendContextData = {
		api: api,
		setApi: setApi
	};

	return <BackendContext.Provider value={store}>{props.children}</BackendContext.Provider>;
};

export default BackendContextProvider;
