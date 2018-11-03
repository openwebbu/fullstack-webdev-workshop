FROM mongo

COPY places.json /places.json
CMD mongoimport --host database --db open-reviews --collection places --type json --file /places.json --jsonArray