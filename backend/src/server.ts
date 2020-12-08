import express from "express";
import { ApolloServer } from "apollo-server-express";
import depthLimit from "graphql-depth-limit";
import compression from "compression";
import cors from "cors";
import schema from "./schema";

import Film from "./types/Film";
import SharedVars from "./shared";

import { Torrent9Entry } from "./datasources/Torrent9";
import Entry from "./types/FilmEntry";

const app = express();
const server = new ApolloServer({
	schema,
	validationRules: [depthLimit(7)]
});

app.use("*", cors());

app.use(compression());

server.applyMiddleware({ app });

app.listen({ port: 4000 }, (): void =>
	console.log(`\n🚀      GraphQL is now running on http://localhost:4000/graphql\n`)
);

async function fetchFilms<E extends typeof Entry>(Classe: E): Promise<Film[]> {
	let entries = await Classe.fetchRecentMovies(1000);
	return await Film.updateEntries(SharedVars.films, entries);
}

const main = async () => {
	let sources = [Torrent9Entry];

	for (let source of sources) SharedVars.films = await fetchFilms(source);

	console.log("[+] Ready to go ;)");
};
main();
