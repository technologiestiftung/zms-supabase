import { setupDB, tearDownDB } from "./utils/db";
import { createUsersSupabaseClient, supabaseSDKSignIn, supabaseSDKSignUp } from "./utils/supabase";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	throw new Error("Missing environment variables");
}

describe("Supabase API", () => {
	test("should get open api response from supabase api ", async () => {
		const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
			method: "GET",
			headers: {
				apikey: SUPABASE_ANON_KEY,
			},
		});
		expect(response.status).toBe(200);
	});

	test("should get response from supabase api using client SDK ", async () => {
		await setupDB();
		const { user, email, password } = await supabaseSDKSignUp();
		await supabaseSDKSignIn(email, password);
		const usersClient = createUsersSupabaseClient(user.data.session?.access_token);
		const { data, error } = await usersClient.from("profiles").select("*");
		expect(error).toBe(null);
		expect(data).toHaveLength(1);
		await tearDownDB();
	});
});
