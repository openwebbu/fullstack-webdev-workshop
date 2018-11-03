# Backend Dev Workshop
Workshop material built to teach some backend web development.

## Getting set up
### 1. Download Docker:
Windows:
https://store.docker.com/editions/community/docker-ce-desktop-windows<br>
Mac:
https://store.docker.com/editions/community/docker-ce-desktop-mac

Once downloaded, verify Docker works by opening a shell and simply typing `docker`. A list of help commands should show up. Additionally, make sure the Docker program that you just installed is running (this is a **must**). If you are on Windows and it gives an error about Hyper-V and Virtualization needing to be enabled, check the "Troubleshooting" section down below. 

### 2. Setting up Docker dev environment
Pull starter files, provided here: (insert link here later once we have starter files) <br>

Using a shell, cd into the root directory of the project (where the `docker-compose.yml` file is). Then, simply run:
`docker-compose up --build`

### 3. Sit back and relax :sunglasses:

Give Docker a few minutes to install all the necessary dependencies. Docker is setting up Express and Mongo services that we will use in this workshop. Once it's finished installing, you should see a bunch of logs that show that the Express and Mongo database services have started.

:exclamation:**If there are many warnings, don't worry about them they're (probably) fine!**:exclamation:

If it's working, you'll see something like this near the end of the logs:
```
express_1     | [nodemon] 1.18.5
express_1     | [nodemon] to restart at any time, enter `rs`
express_1     | [nodemon] watching: *.*
express_1     | [nodemon] starting `node ./bin/www`
express_1     | Loading route: /places
```

You can also open up a browser and go to ```localhost:3000``` to see the starter template code.


### 4. Now you're all set to start the workshop!

---
### Troubleshooting Docker
On Windows, some of you may need to enable **both** Hyper-V and virtualization.

#### To enable Hyper-V:
* In the Windows search menu, search “Turn windows features on or off”
* Select and enable "Hyper-V"

#### To enable virtualization:
You will need to enable virtualization in the BIOS menu. You will have get to this by restarting your computer. 

To get to the BIOS menu, when the computer initially boots up, hold F2. In the BIOS menu there will be an option in Advanced settings to enable Virtualization. 

**NOTE**: Before you start this process, we recommend googling `enable virualization <your computer manufacturer>` to see how to navigate your BIOS menu, since BIOS menus may vary by computer manufacturer. For example, do a quick search on `enable virtualization ASUS` to see how to enable virtualization on an ASUS computer before starting this process

Once you've enabled both Hyper-V and Virtualization, you can go back and start step #2 (Setting up Docker dev environment)

