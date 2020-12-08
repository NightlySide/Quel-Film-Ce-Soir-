import { IResolvers } from "graphql-tools";
import { Torrent9Search } from "./datasources/Torrent9";
import SharedVars from "./shared";
import Film from "./types/Film";

const resolverMap: IResolvers = {
	Query: {
		helloWorld(_: void): string {
			return `👋 Hello world! 👋`;
		},
		films(_: void): Film[] {
			return SharedVars.films;
		},
		film(_: void, args: any): Film | null {
			const id = args.id;
			for (let film of SharedVars.films) {
				if (film.id === args.id) return film;
			}

			return null;
		},
		async searchMovie(_: void, args: any): Promise<Film[]> {
			return await Torrent9Search.searchMovie(args.query);
		}
	}
};
export default resolverMap;
