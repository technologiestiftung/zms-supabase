UPDATE
	profiles
SET
	description = sub.email
FROM (
	SELECT
		REGEXP_REPLACE((
			SELECT
				REGEXP_REPLACE((
					SELECT
						REGEXP_REPLACE(email, '@.*?$', '')), 'zms', '')), '\.', ' ', 'g') AS email,
		id
	FROM
		auth.users
	WHERE
		email LIKE 'zms%' and email_confirmed_at >= '2023-01-20'::TIMESTAMPTZ) AS sub
WHERE
	profiles.id = sub.id;


SELECT email, pp.description from auth.users au join "public".profiles pp on au.id = pp.id where email like 'zms%' and email_confirmed_at >= '2023-01-20'::TIMESTAMPTZ;


update "public".profiles set description = initcap(description);
