const addHandlerToParser = (parser: any) => {
	parser.addHandler("language", /\bTrufrench|VF(?:[FI])\b/i, { type: "lowercase" });
};

export { addHandlerToParser };
