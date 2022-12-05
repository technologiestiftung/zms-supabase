import React, { useEffect, useState } from "react";
import { Auth, Typography, Button, Alert } from "@supabase/ui";
import { SupabaseClient } from "@supabase/supabase-js";
import { Process } from "../App";
import { List } from "./List";

// make sure to add a subscribtion to the table you want to receive updates from
// sql => `alter publication supabase_realtime add table public.processes`;

interface ContainerProps {
	supabaseClient: SupabaseClient;
	children: JSX.Element | JSX.Element[];
}
export const Container = ({ supabaseClient, children }: ContainerProps): JSX.Element => {
	const [change, setChange] = useState<number>(0);
	const [data, setData] = useState<Process[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const { user } = Auth.useUser();

	useEffect(() => {
		if (!user) {
			return;
		}
		const sub = supabaseClient
			.from("processes")
			.on("*", (payload) => {
				console.info("change detected!", payload);
				setChange((prev) => prev + 1);
			})
			.subscribe();
		// This  would be the solution for the v2 of the SDK
		// const sub = supabaseClient
		// 	.channel("public:processes")
		// 	.on("postgres_changes", { event: "*", schema: "public", table: "processes" }, (payload) => {
		// 		console.info("change detected!", payload);
		// 		setChange((prev) => prev + 1);
		// 	});
		// return () => {
		// 	supabaseClient.removeAllChannels();
		// };
	}, [supabaseClient, user]);

	useEffect(() => {
		if (!user) {
			return;
		}
		const fetch = async () => {
			setLoading(true);
			const { data: processes, error } = await supabaseClient
				.from<Process>("processes")
				.select("*");
			if (error) {
				console.error(error);
				throw error;
			}
			// console.info(processes);
			// sort array processes by object key score in descending order

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			processes.sort((a, b) => {
				if (a.score === null) {
					return 1;
				}
				if (b.score === null) {
					return -1;
				}
				if (a.score > b.score) {
					return -1;
				}
				if (a.score < b.score) {
					return 1;
				}
				return 0;
			});
			setData(processes);
			setLoading(false);
		};
		fetch().catch(console.error);
	}, [change, user, supabaseClient]);

	// useEffect(() => {
	// 	if (!user) return;
	// }, [user]);

	if (user) {
		return (
			<>
				<div>
					<Alert title="Change Detected">
						<Typography.Text> Number of changes: {change}</Typography.Text>
					</Alert>
				</div>
				<List data={data} loading={loading} />
				<Typography.Text>Signed in: {user.email}</Typography.Text>
				<Button block={true} onClick={() => supabaseClient.auth.signOut()}>
					Sign out
				</Button>
			</>
		);
	}
	return Array.isArray(children) ? ((<>children</>) as JSX.Element) : children;
};
