import { createClient } from "@supabase/supabase-js";
// change the below import to data.js for testing in a local environment
import { resolve } from "path";
import { data } from "./data.production.js";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

// use __dirname in esm
// see https://stackoverflow.com/a/61723730/1123955
const __dirname = new URL(".", import.meta.url).pathname;

dotenv.config({ path: resolve(__dirname, "../../.env.production") });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// check if SUPABASE_URL is defined
if (!SUPABASE_URL) {
	console.error("SUPABASE_URL is not defined");
	process.exit(1);
}
if (!SUPABASE_ANON_KEY) {
	console.error("SUPABASE_ANON_KEY is not defined");
	process.exit(1);
}
console.info(SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
async function main() {
	for (const u of data) {
		console.info(`Creating user ${u.email}`);
		const { data: user, error } = await supabase.auth.signUp({
			email: u.email,
			password: u.password,
		});
		if (error) {
			console.error(error);
			throw error;
		}
		console.log(user);
	}
}

main().catch(console.error);
