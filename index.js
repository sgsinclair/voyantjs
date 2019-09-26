import * as Corpus from "./src/corpus";
import * as Table from "./src/table";

const VoyantJS = {};

VoyantJS.Corpus = Corpus;
VoyantJS.Table = Table;

if (window !== undefined) {
	window.VoyantJS = VoyantJS;
} else if (global !== undefined) {
	global.VoyantJS = VoyantJS;
}
