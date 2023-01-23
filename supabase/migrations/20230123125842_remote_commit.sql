ALTER TABLE "public"."service_types"
	DROP CONSTRAINT "service_types_text_id_key";

ALTER TABLE "public"."service_types"
	DROP CONSTRAINT "service_types_text_key";

DROP INDEX IF EXISTS "public"."service_types_text_id_key";

DROP INDEX IF EXISTS "public"."service_types_text_key";

ALTER TABLE "public"."service_types" RENAME COLUMN "text" TO "name";

CREATE UNIQUE INDEX service_types_text_id_key ON public.service_types USING btree (name, id);

CREATE UNIQUE INDEX service_types_text_key ON public.service_types USING btree (name);

ALTER TABLE "public"."service_types"
	ADD CONSTRAINT "service_types_text_id_key" UNIQUE USING INDEX "service_types_text_id_key";

ALTER TABLE "public"."service_types"
	ADD CONSTRAINT "service_types_text_key" UNIQUE USING INDEX "service_types_text_key";

SET check_function_bodies = OFF;

CREATE OR REPLACE FUNCTION public.calculate_weighted_score (input_scheduled_time timestamp with time zone, input_checkin_time timestamp with time zone, input_weight_score integer, input_weight_waiting_score integer)
	RETURNS integer
	LANGUAGE plpgsql
	AS $function$
DECLARE
	weight_score int := input_weight_score;
	--20;
	weight_waiting_score int := input_weight_waiting_score;
	--80;
	curr_time timestamptz := CURRENT_TIMESTAMP;
	-- '2022-12-01 13:15:00.00+00';
	combined_score int;
BEGIN
	SELECT
		(((t.score * weight_score) + (t.waiting_score * weight_waiting_score)) / (weight_score + weight_waiting_score)) INTO combined_score
	FROM (
		SELECT
			(
				CASE WHEN (EXTRACT(EPOCH FROM (curr_time - input_scheduled_time))::integer / 60) >= 0 THEN
					TRUE
				ELSE
					FALSE
				END) AS is_waiting,
			(EXTRACT(EPOCH FROM (input_scheduled_time - input_checkin_time))::integer / 60) AS score,
			(
				CASE WHEN (EXTRACT(EPOCH FROM (input_scheduled_time - input_checkin_time))::integer / 60) < - 15 THEN
					-15
				ELSE
					(EXTRACT(EPOCH FROM (curr_time - input_scheduled_time))::integer / 60)
				END) AS waiting_score) t;
	RETURN combined_score;
END;
$function$;

CREATE OR REPLACE FUNCTION public.test_scoring ()
	RETURNS TABLE (
		_id integer,
		_service_id text,
		_notes text,
		_scheduled_time timestamp with time zone,
		_check_in_time timestamp with time zone,
		_curr_time timestamp with time zone,
		"is over due" boolean,
		"scheduled time - check in time in min score" integer,
		"current time - scheduled time in min waiting_score" integer,
		"combined weighted score in min (only positiv waiting)" integer)
	LANGUAGE plpgsql
	AS $function$
DECLARE
	-- weights in percent
	weight_1 int := 20;
	weight_2 int := 80;
	curr_time timestamptz := CURRENT_TIMESTAMP;
	-- '2022-12-01 13:15:00.00+00';
BEGIN
	RETURN query
	SELECT
		*,
		(((t.score * weight_1) + (t.waiting_score * weight_2)) / (weight_1 + weight_2)) AS combined_score
	FROM (
		SELECT
			id, -- not needed
			service_id, -- not needed
			notes, -- not needed
			scheduled_time, -- not needed
			check_in_time, -- not needed
			curr_time, -- should be CURRENT_TIMESTAMP
			(
				CASE WHEN (EXTRACT(EPOCH FROM (curr_time - scheduled_time))::integer / 60) >= 0 THEN
					TRUE
				ELSE
					FALSE
				END) AS is_waiting,
			(EXTRACT(EPOCH FROM (scheduled_time - check_in_time))::integer / 60) AS score,
			(
				CASE WHEN (EXTRACT(EPOCH FROM (scheduled_time - check_in_time))::integer / 60) < - 15 THEN
					-15
				ELSE
					(EXTRACT(EPOCH FROM (curr_time - scheduled_time))::integer / 60)
				END) AS waiting_score
		FROM
			public.processes) t;
END;
$function$;

CREATE OR REPLACE FUNCTION public.compute_scores ()
	RETURNS void
	LANGUAGE plpgsql
	AS $function$
BEGIN
	UPDATE
		public.processes
	SET
		score = "public".calculate_weighted_score (scheduled_time, check_in_time, 20, 80)
		-- (EXTRACT(EPOCH FROM (scheduled_time - check_in_time))::integer / 60) + (EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - scheduled_time))::integer / 60)
	WHERE
		start_time IS NULL
		AND end_time IS NULL
		AND date_trunc('day', scheduled_time) > date_trunc('day', CURRENT_TIMESTAMP) - INTERVAL '1day';
END;
$function$;

