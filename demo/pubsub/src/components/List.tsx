import { ListItem } from "./ListItem";
import { Process } from "../App";

export const List: React.FC<{ data: Process[]; loading: boolean }> = ({ data, loading }) => {
	return (
		<ul>
			{loading ? (
				<ListItem service_id={"Loading"} score={null} scheduled_time={null} check_in_time={null} />
			) : (
				data.map((item) => (
					<ListItem
						key={item.id}
						service_id={item.service_id}
						check_in_time={item.check_in_time}
						scheduled_time={item.scheduled_time}
						score={item.score}
					/>
				))
			)}
		</ul>
	);
};
