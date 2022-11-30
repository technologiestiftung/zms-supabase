import { Typography } from "@supabase/ui";

interface ListItemProps {
	service_id: string | number;
	score: number | null;
	scheduled_time: string | null;
	check_in_time: string | null;
}

const fontStyle = { color: "white" };
export const ListItem = ({
	service_id,
	score,
	check_in_time,
	scheduled_time,
}: ListItemProps): JSX.Element => {
	return (
		<li>
			<p>
				<span style={{ paddingRight: "10px" }}>
					Service ID:{" "}
					<Typography.Text strong={true} style={fontStyle}>
						{service_id}
					</Typography.Text>
				</span>{" "}
				<span>{"\t\t"}</span>
				{score ? (
					<>
						Score:{" "}
						<Typography.Text strong={true} style={fontStyle}>
							{score}
						</Typography.Text>
					</>
				) : null}{" "}
			</p>
			<p>
				{check_in_time ? (
					<>
						Check In Time:{" "}
						<Typography.Text strong={true} style={fontStyle}>
							{check_in_time}
						</Typography.Text>
					</>
				) : null}
				{""}
			</p>
			<p>
				<span>{"\t\t"}</span>
				{scheduled_time ? (
					<>
						Scheduled Time:{" "}
						<Typography.Text strong={true} style={fontStyle}>
							{scheduled_time}
						</Typography.Text>
					</>
				) : null}
			</p>
		</li>
	);
};
