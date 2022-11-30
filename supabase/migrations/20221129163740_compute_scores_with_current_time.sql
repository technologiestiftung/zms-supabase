set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.compute_scores()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
	UPDATE
		public.processes
	SET
		score = (EXTRACT(EPOCH FROM (scheduled_time - check_in_time))::integer / 60) + (EXTRACT(EPOCH from (CURRENT_TIMESTAMP - scheduled_time))::integer / 60)
	WHERE
		start_time is null and end_time is null;
END;
$function$
;


