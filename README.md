# Backend Dev Workshop
Workshop material built to teach some backend web development.

## Getting set up through Docker
### 1. Download Docker:
Windows:
https://store.docker.com/editions/community/docker-ce-desktop-windows<br>
Mac:
https://store.docker.com/editions/community/docker-ce-desktop-mac

Once downloaded, verify Docker works by opening a shell and simply typing `docker`. A list of help commands should show up. If it mentions something about needing a Docker daemon running, make sure the Docker program that you downloaded is actually running

### 2. Setting up Docker dev environment
Pull starter files, provided here: (insert link here later once we have starter files) <br>

In the root directory of the project (where the `docker-compose.yml` is), simply run:
`docker-compose up --build`

Sit back and give it a few minutes to install all the necessary dependencies. Docker is setting up Express and Mongo services that we will use in this workshop. Once it's finished installing, you should see a bunch of logs that show that the Express and Mongo database services have started.

**If there are many warnings, don't worry about it too much!**

To check that it's working, you'll see something like this near the end of the logs:
```
express_1     | [nodemon] 1.18.5
express_1     | [nodemon] to restart at any time, enter `rs`
express_1     | [nodemon] watching: *.*
express_1     | [nodemon] starting `node ./bin/www`
express_1     | Loading route: /places
```

You can also open up a browser and go to ```localhost:3000``` to see the starter template code.


### 3. Now you're all set to start the workshop :smile:
