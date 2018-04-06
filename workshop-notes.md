# Notes for the workshop

## 1. Installing Node/NPM
1. For MacOS
    - Installing through downloader
        - https://nodejs.org/en/download/
    - Installing directly through cURL
        ```bash
        curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
        ```
    - Installing through Homebrew
        1. Install Homebrew
            ```bash
            /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
            ```
        2. Install Node
            ```bash
            brew install node
            ```
2. For Windows
    - Installing through downloader
        - https://nodejs.org/en/download/

## 2. Installing MongoDB
1. For MacOS
    - Installing through Homebrew
        1. Update Homebrew
            ```bash
            brew update
            ```
        2. Install MongoDB
            ```bash
            brew install mongodb
            ```
    - Install manually
        1. Download the binaries from https://nodejs.org/en/download/
        2. Extract the files from the downloaded file. (Double click)
            ```bash
            tar -zxvf mongodb-osx-ssl-x86_64-3.6.3.tgz
            ```
        3. Copy the extracted archive to the target directory.
            ```bash
            mkdir -p mongodb
            cp -R -n mongodb-osx-ssl-x86_64-3.6.3/ mongodb
            ```
        4. Set environment variables
            ```bash
            export PATH=<mongodb-install-directory>/bin:$PATH
            ```
2. For Windows
    - Install through interactive installer
        1. Go to website
            ```bash
            https://www.mongodb.com/download-center#community
            ```
        2. Follow the steps :)
3. Failsafe (LAST RESORT)
    - If someone is having an issue with the installation of MongoDB, then setup a db user on mlab.
    - Instructions for workshop leaders to set up remote mongoDB instance:
        1. Go to https://mlab.com/
        2. Sign In
        3. Click on the mongoDB deployment dedicated for the workshop.
        4. Click on "Users" tab.
        5. Click on "Add database user"
        6. Create some dummy username and password.
        7. Give credentials to workshop participants.
    - **MAKE SURE TO DELETE THE DEPLOYMENT AFTERWARDS** 
    - If the workshop participant wants to keep the database created, do the following:
        1. Go to https://mlab.com/
        2. Sign In
        3. Click on the mongoDB deployment dedicated for the workshop.
        4. Click on "Backups" tab
        5. Click on "Take one-time mongodump"
        6. Send to the workshop participant.

## 3.1 Coding portion Introduction
1. Double check and make sure that everyone downloaded the starter code
2. Ask if anyone's having issues with the setup. (Node/NPM, )
3. Have everyone run the project
    ```bash
    npm install
    npm run dev
    ```
4. Check with everyone else that it is running properly without errors.
5. Tell everyone to navigate to **localhost:3000**
6. Explanation of Frontend.
    - Echo what Kailin mentioned earlier about the difference between backend and frontend.
    - Emphasize that the application is currently lacking logic...
7. Quick explanation of Pug
    - Pug is a template engine which takes a modified HTML document with some information left out, and a data that you want to use to fill those gaps, and generates a completed document.
    - Open views/places/search.pug
    - Everywhere you see a # (pound/hashtag) followed by opening curly brace, some text and a closing curly brace is an indication that you want pug to fill it with some information later.
8. Explain the project structure.
    - bin: contains start up instruction. i.e. what to do when we say "npm start" or "npm run dev"
    - models: contains schemas (structures to data that we're gonna need to keep track of in our application)
    - node_modules: contains every modules (small snippets of code) that other people wrote in order to make our life easier. Installed when we executed "npm install"
    - public: contains static files (files that do not change, like CSS, images and Javascript) that will be served to the client when requested.
    - routes: defines routers. Routers detect when a user opened "/accounts/login" for example and does something appropriately.
    - views: contains all the templates used in the project.
    - .env file: contains information/variables that we want to keep it a secret.
    - app.js: It's usually a bad idea to write all of your code into 1 file because it's hard to manage. So like we'll do today, it's more common to split the code up into bunch of files. app.js file pulls in those snippets together to create a single app.
    - package.json: contains some meta data (information about our application) that can be useful. When we ran "npm install" to install all the technologies we're using today, "Node Package Manager" looked through our package.json file and installed all the modules defined in there.
9. Let's talk about .env
    - There's a term in software engineering called "Hard-coding". Usually a bad idea!
    - In the .env file, there's a variable I defined called DB_HOST. This variable tells the server the location of the database.
    - If I hardcoded this datbase location and I sent it out to you guys, then someone could delete my entire database.
    - So I would want to keep it a secret. 
    - We will be defining secrets like this in .env file and one of the module we installed called "dotenv" will keep track of this.
10. Adding some .env variables
    - Let's add the location of our database.
        - If you were successful in installing mongodb on your own laptop, then likely, your host will be "mongodb://localhost/open-reviews" If you couldn't and you came to talk to me about it, I should've given you a special host for it.
    - Session secret. Session secrets must be set in order to encrypt information about users who are currently using our application. It doesn't matter what it is for the purpose of this workshop but when you're using it in a real product, make sure you set it to something unpredictable.
    - google cloud project id. You should've downloaded the google cloud private key file and moved it into somewhere convenient like the Desktop. Inside of this file is a field called "project_id". Copy and past this in here.
    - google cloud keyfile location. You should've also moved the private key file to the project directory. If you don't know much about unix path syntax then make sure you copied your key into the project directory and type "./gcloud-key.json" For those who know how to navigate the path system, make sure you write a string to point to this private key file.
11. The application is very barebones right now, so let's beef it up with some basic authentication.
12. Pretty much every application needs a sign-in and sign-up feature, let's add it!

## 3.2 User schema to Authentication
### 3.2.1 What the heck is a schema
1. Database is simply a storage for bunch of data. Data is most commonly represented by bunch of numbers of characters.
2. If I gave you 012-345-6789 without any context, you might be able to figure out from experience that it's most likely a phone number but the computer doesn't have that contextual awareness.
3. Schema is a very convenient and explicit way of defining this structure or context.
4. In our case, we need to define a User schema and users typically have the following fields.
    - username: String of characters that must be unique and required for every user.
    - email: String of characters that must be unique and required for every user.
    - password: String of characters that is required. (It's okay if 2 users have the same password)
    - joined: Date that is by default set to the date when this user was created.

### 3.2.2 Our User Schema
1. Here's our schema!
    ```javascript
    const User = new Schema({
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        joined: {
            type: Date,
            default: Date.now,
        }
    })
    ```
2. Explain that each of these class of information is called a "field."
3. Explain **very** briefly the options we've used.
    - type: Type of the data stored
    - required: this field is required (i.e. cannot be left empty)
    - unique: this field must be unique (i.e. there cannot be another user with the same email or username)
    - default: the default value stored.
4. Right now, password is stored raw, **NO BUENO**

### 3.2.3 Encryption
1. It's important but not the focus of the workshop so go quickly and let them know workshop leaders can answer questions after the workshop.
2. Mongoose (the tool we use to interact with the our database) allows for defining a routine before (pre) some event happens.
3. In this case, we write a function that runs everytime a save action is performed.
4. Let the participants know that we are more than happy to talk about it more if they have more questions.

### 3.2.4 Routing for authentication
1. Now that we've defined what a user looks like, we need to set up a way of interacting with the schema.
2. Explain, very simply, how routing works with express.
    - Imagine that you are standing in a lunch line at your middleschool or your highschool.
    - You and everyone else are super decisive and you know 100% what you want by the time you approach the lunch lady.
    - You know you want /food/apple, but the lunch lady doesn't know that and she has to ask you whether you want /drink/milk. You kindly decline, and you move on to the next lunch lady.
    - The next lunch lady asks if you want /food/spaghetti. You say "nah fam" and again, you move on.
    - Finally you get to the correct lunch lady and she asks "Would you like some /food/apple?" and you say "heck yes I do, gimme that."
3. That is how routing works in Express. Every request (you standing in the line with a tray) gets put through a line of middleware (dozens of lunch ladies) and only when there's no more middlewares (lunch ladies) then is the request allowed to leave the server (lunch line).
4. We will begin defining some lunch ladies to take care of authentication (sign in/sign up).
5. We have already defined a lunch lady for if you want "/register".
6. Right now this "/register" lunch lady can only handle GET requests.
7. If you say "Hello lunch lady, I would like a GET request to '/accounts/register'" then the lunch lady will happily serve you bunch of resources.
8. **DEMO GET REQUEST TO /accounts/register**
9. If you take a closer look, this route "/accounts/register" knows what to do when you want to send a POST request, but it doesn't do anything useful.
10. If you say "Hello lunch lady, I have a POST request to '/account/register'" The lunch lady panics and tells you to go talk to "/oops" lunch lady.
11. **DEMO POST REQUEST TO /accounts/register** 
12. Instead we want it to do something useful when a POST request is made. Specifically, we want it to create a new user upon a POST.
13. Replace the body of router.route('/accounts/register').post(...) by the following:
    - First we extract the user-submitted information from the request and we define a variable called "data" which will be used by Pug to fill out a template.
        ```javascript
        router.route('/register')
            .post(function(req, res) {
                const {username, email, password, password2} = req.body
                let data = {
                    title: 'Open Reviews - Sign Up',
                }
            })
        ```
    - Then we will check to make sure all the fields were filled out
        ```javascript
        if (username === "" || 
            email === "" || 
            password === "" || 
            password2 === "") {
            data.message = 'Some field is missing'
            return res.render('accounts/sign-up', data)
        }
        ```
    - Next we need to ensure that the password and the re-typed password match to make sure that the user did not make a mistake in typing up the password
        ```javascript
        if (password !== password2) {
            data.message = 'The passwords must match'
            return res.render('accounts/sign-up', data)
        }
        ```
    - If the two validations above passed, then we can begin to create a new User.
        ```javascript
        const newUser = new User({
            username: username,
            email: email,
            password: password,
        })
        ```
    - Creating a new user is not enough, so we need to actually save the new user to our database.
        ```javascript
        newUser.save(function(err, user) {
            if (err) {
                if (err.code === 11000) {
                    data.message = 'User with the given information already exists'
                    return res.render('accounts/sign-up', data)
                }
                data.message = 'Something went wrong on our end...'
                return res.render('accounts/sign-up', data)
            }
            req.session.user = user
            req.session.flash = {
                type: 'success',
                message: 'Successfully registered! Welcome!',
            }
            return res.redirect('/')
        })
        ```
14. Quick explanation of sessions
    - Session is a storage of information about a user that you want it to persist throughout the user's interaction with our web application.
    - It would be very undesirable to have to login to Facebook every time you opened the website. Facebook and many many many web applications use sessions to improve the user experience by removing the hassle of logging in multiple times.
    - What is req.session.flash?
    - That is a mechanism used to show a flash notification upon completion of some action. In this case, we are flashing a message "Successfully registered! Welcome!" upon registration. It's a one-time message that gets shown to the user and we will continue to use this throughout the rest of the workshop.
15. **DEMO THE NEW REGISTRATION ENDPOINT**
16. **Make a note that adding "req.session.user = user" to the code above makes it such that the user is automatically logged in upon registration.**
17. But currently there's no way to sign out, let's fix it. All that logging out really means, is to delete the session we created.
    - Check to make sure that the user is really logged in. i.e. there's a session for this user and the user has a cookie set on his/her browser
    ```javascript
    router.get('/logout', function(req, res) {
        if (req.session.user && req.cookies.user_sid) {
            /*
                Delete the session here
            */
        } else {
            return res.redirect('/accounts/login')
        }
    })
    ```
    - Destroy the session and clear the cookie!
    ```javascript
    req.session.destroy(function(err) {
        if (err) {
            return res.redirect('/accounts/login')
        }
        res.clearCookie('user_sid')
        return res.redirect('/')
    })
    ```
18. Try logging out of the application through the collapsed menu.
19. Once we sign out though, there's no way of signing back in.
20. Let's make that happen
    - Mostly the same steps as registration. First extract some user-submitted data
        ```javascript
        router.route('/login')
            .post(function(req, res) {
                const {username, password} = req.body
                let data = {
                    title: 'Open Reviews - Sign In',
                }
            })
        ```
    - Then make sure that we received all the relevant data
        ```javascript
        if (username === "" ||
            password === "" ) {
            data.message = 'Username or password is missing'
            return res.render('accounts/sign-in', data)
        }
        ```
    - Here's where it differs a little bit. Instead of creating a new user, we need to look up whether the user exists and then make sure that the submitted password is correct.
        ```javascript
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                data.message = 'Something went wrong on our end...'
                return res.render('accounts/sign-in', data)
            }
            if (!user) {
                data.message = "We couldn't find a user with the given username"
                return res.render('accounts/sign-in', data)
            }

            // ....MORE BELOW
        })
        ```
    - Check that the password is correct, attach the user information to the session and redirect to either a home page or a url in "returnTo" session variable if it exists.
        ```javascript
        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                data.message = 'Something went wrong on our end...'
                return res.render('accounts/sign-in', data)
            }
            if (isMatch) {
                req.session.user = user
                req.session.flash = {
                    type: 'success',
                    message: 'Successfully signed in! Welcome back!',
                }
                const returnTo = req.session.returnTo || '/'
                delete req.session.returnTo
                return res.redirect(returnTo)
            }
            data.message = 'The password you entered is wrong or the user does not exist'
            return res.render('accounts/sign-in', data)
        })
        ```
21. **DEMO SIGN IN**
22. If you have not yet signed out, sign out by hovering over the collapsed menu on the top right of the page.
23. Click on "Sign In"
24. You should be able to sign back in by visiting "/accounts/login"
25. Questions?

## 3.3 Place schema to represent locations
### 3.3.1 Going over pre-defined Place Schema and some methods
1. As a review application, we will need to store places.
2. Open up models/place.js
3. Explain the general structure of the pre-defined schema
    - name: name of the string
    - slug: unique and human readable string that can be used in the URL. More detailed writing is in the bottom portion of the file.
    - description: description of the location
    - address: address of the location
    - phone: phone number of the location
    - website: website of the location
    - created: the timestamp of when the place was added to the system.
    - color: random colors that are chosen for a place to mimic having images of the locations
    - **reviews: ** list that contains ID of every review written for the location. Having the IDs of reviews stored here makes it convenient when we want to see all the reviews written specifically for the place. Alternative would be to check every single review and see if the review was written for a specific place which would be very inefficient.
    - sentimentScoreAvg: Running average of the sentiment score. sentiment score is a number that ranges from -1 to 1 that describes how negative or positive a text is. Having a field here is more efficient than calculating the average on the fly.
    - sentimentMagAvg: Running average of the sentiment magnitude. Sentiment magnitude tells you how expressive the review was. This data is not really used in this application but might be useful in the future.
    - numReviews: just counts how many reviews there are. Mostly used just to calculate the running average.
4. Describe some functions defined for Place schema
    - Similar to how we can define some functions to run before some action is taken (like .pre(...)), mongoose allows us to add useful functions that we can run anytime we want. These are called "methods"
    - Place.methods.normalizeSentiment is a function that takes the average sentiment score of the place which I mentioned earlier ranges from -1 to 1, and spreads it in a range of 0 to 100.
        - Why? Range of -1 to 1 is unintuitive. We are more familiar with a scale that ranges from 0 to 100 and we can easily associate it to scores that we receive in our own lives. Basically just convenient.
    - Place.methods.gradient is a function that takes a place's randomly assigned colors and creates a CSS value to display a gradient.
    - Finally, I defined a pre('save') function for Place. Essentially, it just generates a slug which can be used to look up a location. I tried to write an explanation of what a slug is, so feel free to read it in your own time. In addition to creating the slug, this function also assigns random colors to newly created Place.
5. Any questions?
### 3.3.2 Creating a new Place
1. I've defined what should happen when a GET request to '/places/new/' received. Simply renders a web page.
2. **DEMO REALLY QUICKLY WHAT /places/new DOES**
3. Similar to creating a new user, we need to add the logic to process user data and create a new location.
    - Extract user submitted data
        ```javascript
        .post(function(req, res) {
            const {name, address, phone, website, description} = req.body
        })
        ```
    - The only data that is required is the name of the place
        ```javascript
        if (!name) {
            return res.render('places/new-place', {
                title: 'Add a new place!',
                flash: {
                    type: 'error',
                    message: 'Place must have a name'
                }
            })
        }
        ```
    - Create a new instance of Place
        ```javascript
        const newPlace = new Place({
            name: name,
            address: address,
            phone: phone,
            website: website,
            description: description,
        })
        ```
    - Save the instance and redirect the user
        ```javascript
        newPlace.save(function(err, place) {
            if (err) {
                req.session.flash = {
                    type: 'error',
                    message: 'Something terrible happened on our end, try in a bit!'
                }
                return res.render('places/new-place', { title: 'Add a new place!'})
            }
            req.session.flash = {
                type: 'success',
                message: 'New place successfully added! Thanks for helping us out!'
            }
            return res.redirect('/')
        })
        ```
4. Though none of these should be too much of a surprise but does anyone need clarifications?
5. **DEMO THE NEW PLACE FUNCTION**
6. Right now, anyone can create a new place even if you're not logged in. This is a bit of an issue. We want to make sure that the new place was added by a trust-worthy person. We need to protect this endpoint.
7. We could just check if the user is signed in and if not redirect the request to somewhere else. 
    ```javascript
    .post(function(req, res) {
        if (!req.session.user) {
            return res.redirect('/accounts/login')
        }
    })
    ```
8. However, since protecting an endpoint is a common procedure, it's more convenient to use a function that we can reuse.
9. Remember the lunch lady metaphor? Well now, we can add a special middleware (lunch lady) that will slap your tray out of your hands if you're not authenticated.
10. If you locate to "middleware/auth.js" we can see the middleware I wrote called "isAuthenticated." The logic goes something like this:
    - If the session says the user is signed in, move to the next middleware (lunch lady)
    - else, set a session variable called "returnTo" to the current URL and redirect the user to the login page.
11. setting the returnTo variable is a nice touch to ensure that if a user tried to access a protected endpoint and was redirected, he or she would be able to come back to where he/she was before being redirected.
12. How do we apply this middleware? Simple:
    ```javascript
    .post(auth.isAuthenticated, function(req, res) {
        if (!req.session.user) {
            return res.redirect('/accounts/login')
        }
    })
    ```
    - Reads like "When a post request is made to '/places/new', first check if the user is authenticated, and if the user is authenticated, the regular function is applied.
13. Any questions?

### 3.3.3 Reading a new location
1. Now that we created a way to add a new location to our database, we need to give users a nice way to view the newly added location.
2. Here, the slug we talked about briefly comes in to help
3. So far, all of our URLs have been defined statically. Meaning, you had to match every character in the URL in order to be navigated to the desired location.
    - e.g. In order to create a new location, you have to go to /places/new. In order to login you have to go to /accounts/login etc.
4. Sometimes, however, we want to dynamically define our URL. What does that mean? Instead of defining exactly what we're looking for (like the case of /places/new), we can instead define the rule that the server should use to match requests to their corresponding endpoint.
5. Going back to the lunch lady metaphor, imagine that instead of having dozens of lunch ladies asking "Hello do you want an apple?", "hello do you want an apricot?", "hello do you want Anchovies?" and so on, you just have one lunch lady that asks "Hello, does the food you want start with the letter A?" We are defining a rule instead of actual URLs that we want to match.
6. To do this in express, we use the following code:
    ```javascript
    router.get('/:slug', function(req, res) {
        res.redirect('/oops')
    })
    ```
7. Whatever follows the ":" (colon mark) can then be retrieved and processed upon.
    - Retrieve the portion of the URL that was matched. This is called a URL parameter. Similar to how we have been retrieving user-defined data.
        ```javascript
        router.get('/:slug', function(req, res) {
            const slug = req.params.slug
        })
        ```
    - Use the Place Schema defined in our project to look for a place that matches the slug that was passed in as a URL parameter.
        ```javascript
        Place
            .findOne({ slug: slug })
            .populate({
                path: 'reviews',			
                populate: { 
                    path: 'by'
                }
            })
            .exec(function(err, place) {

                if (err) {
                    res.render('error')
                }
                
                if (!place) {
                    res.render('places/search')
                }
                res.render('places/place', { place: place, title: place.name })
            })
        ```
    - That last part might look tricky for those who have not had too much experience with Javascript.
    - Mongoose gives us a really nice set up functions that we can use to look things up, add conditions and what not. One of the most powerful thing to do with those functions is to chain those functions together. In our example, we chain three functions together.
    - First function: findOne({...}) looks up an instance of Place with the given slug.
    - Second function: populate({...}) will try to populate fields in Place that are references to other information in the database. If you look at the Place Schema and specifically at the reviews field, we can see that the reviews field stores Reviews about this place in a form of an ID.
    ```javascript
    {
        reviews: [ID(3912301238), ID(1239809123), ...]
    }
    ```
    Those IDs are just numbers and don't mean much to us. So the populate function will look up what those IDs are referring to and replace them with the actual data.
    - Third function: exec(...) will execute the chained functions.
8. If you haven't added a location, try adding it and if you were successful, go to 'localhost:3000/places/:slug' and checkout what it looks like.
9. Pretty inconvenient to have to type the slug in the search bar right? Let's add a searching functionality.

### 3.3.4 Really inefficient and stoopit search function
1. I have pre-defined the URL for searching called "/search/:q." Here we see another "dynamic URL."
    - First retrieve the q parameter. q stands for query but you could've named it anything you want.
        ```javascript
        router.get('/search/:q', function(req, res, next) {
            const q = req.params.q
        })
        ```
    - Then use mongoose to look up and chain functions!
        ```javascript
        Place
            .find({ name: { $regex: new RegExp(q,'gi') } })
            .populate('reviews')
            .exec(function(err, places) {
                if (err || !places) {
                    req.session.flash = {
                        type: 'error',
                        message: 'Something went wrong on our end...',
                    }
                    return res.redirect('/')
                }
                else {
                    res.render('places/search', {title: 'Search', places: places})
                }
            })
        ```
2. Now check our application and try out the search bar in the menu box, should work.
3. Any questions?

### 3.3.5 Defining Review Schema
1. The whole point of this application is to review places right? Let's make that happen
2. First let's check out the schema definition for Reviews
3. Navigate to models/review.js
4. Again, to save you from the boredom of typing a lot of repetitive code, I created the schema. Let's quickly go through what they are:
    - by: reference to a User instance that wrote the review.
    - text: the actual review
    - place: reference to a Place to which this review is directed towards.
    - sentimentScore: how negative or positive was this review?
    - sentimentMag: how expressive was the review?
    - created: field to store when this review was created.
5. I've also added 2 methods
    - ago: ago is a function that takes some timestamp and calculates how long ago that time was. So if you feed it some Date in the past, it will return "13 minutes ago" or "5 days ago" and etc.
    - normalizeSentiment: same as the normalizeSentiment function from the Place schema except now instead of calculating it at the Place level, we're normalizing the score for each review.
6. The pre function that gets ran before a save is pretty involved for this review. Here's where the text is sent to Google to have it analyzed by their super fast and large computer.
7. Try to follow along and I will explain what is happening afterwards:
    - First go to the top of the file and write the following code to import some functions written by Google to make sending data back and forth to Google's server a little easier:
        ```javascript
        const language = require('@google-cloud/language')
        ```
    - Initialize the Google client. We are creating a client because we are consuming some service that Google is offering.
        ```javascript
        const client = new language.LanguageServiceClient({
            projectId: process.env.GCLOUD_PROJECT_ID,
            keyFilename: process.env.GCLOUD_KEYFILE_PATH,
        })
        ```
    - In the pre save function, set up the necessarily variables. Also if the text was not modified then there's no point to updating the sentimentScore.
        ```javascript
        Review.pre('save', function(next) {
            const review = this

            if (!review.isModified('text')) next()
        })
        ```
    - Send the data to Google and handle the response from Google
        ```javascript
        client
            .analyzeSentiment({document: document})
            .then(results => {
                const sentiment = results[0].documentSentiment;

                review.sentimentScore = sentiment.score
                review.sentimentMag = sentiment.magnitude
                next()
            })
            .catch(err => {
                next(err)
            })
        ```
8. Unfortunately, there's no way to test this right now. But let's add a way to interact with the Review schema so we can test this function out.

### 3.3.6 Getting to the new Review page
1. Now that we added some useful functions for Reviews, we need to add a way for users to interact with it.
2. The get function for '/:slug/new-review' is a little bit more complicated so let's write it together.
    - First we need to retrieve the URL param called "slug." Here we use the middleware "isAuthenticated" that we defined earlier in order to make sure that only authenticated users can leave reviews.
        ```javascript
        router.route('/:slug/new-review')
            .get(auth.isAuthenticated, function(req, res) {
                const slug = req.params.slug
            }
        ```
    - Then we need to look up in our database to make sure that the Place with the given slug exists. Only if it exists, render some HTML.
        ```javascript
        Place.findOne({ slug: slug }, function(err, place) {
            if (err || !place) {
                req.session.flash = {
                    type: 'error',
                    message: "Oops... Looks like we couldn't find a place you were trying to review",
                }
                return res.redirect('/')
            }
            res.render('places/new-review', { place: place, title: place.name })
        })
        ```
3. Test this new endpoint out. You should be able to navigate to the page for a place you added earlier, click on a button that says "Add a new review!"
4. Just like in the past, we need to add a way to post data to this endpoint so that we can store it into the database.

### 3.3.7 Creating a new review! Final stretch!
1. The following code is a little bit longer but it's nothing scary. We're following the same procedure as before.
    - First retrieve some user-given data
        ```javascript
        .post(function(req, res) {
            const slug = req.params.slug
            const user = req.session.user
            const { text } = req.body
        })
        ```
    - Look up if the slug given in the URL is legitimate (i.e. the place exists in our database)
        ```javascript
        Place.findOne({ slug: slug }, function(err, place) {
            if (err) {
                return res.render('error')
            }
        })
        ```
    - Create a new instance of Review
        ```javascript
        const newReview = new Review({
            by: user,
            text: text,
            place: place,
        })
        ```
    - Save the review instance 
        ```javascript
        newReview.save(function(err, review) {
            if (err) {
                return res.render('error')
            }
        })
        ```
    - Do some math on the place
        ```javascript
        place.reviews.push(review)
        let scoreSum = place.sentimentScoreAvg * place.numReviews + newReview.sentimentScore
        let magSum = place.sentimentMagAvg * place.numReviews + newReview.sentimentMag
        place.numReviews += 1
        place.sentimentScoreAvg = scoreSum / place.numReviews
        place.sentimentMagAvg = magSum / place.numReviews
        ```
    - Save the place instance & Done!
        ```javascript
        place.save(function(err, place) {
            if (err) {
                req.session.flash = {
                    type: 'error',
                    message: 'Something went wrong on our side...'
                }
                return res.render(`/places/${slug}/new-review`, {
                    text: review,
                })
            }
            req.session.flash = {
                type: 'success',
                message: 'New review posted! Thanks for helping us out!'
            }
            return res.redirect(`/places/${slug}`)
        })
        ```
2. As usual, I recommend testing it out. Go to the place we created earlier, navigate to the add a new review page, and either write some human readable text or copy and paste some review from yelp or something.
3. Any questions?

## 4 Conclusion
1. That basically wraps up our workshop.
2. I know it was super long but you now know the basics to make different kinds of cool applications.
3. The tip to improving is to keep trying no matter how long it takes. 
4. Don't be afraid to Google, you'll realize very soon that a website called StackOverflow will be your best friend for life.
5. Open Web would like to thank you for your time today and I hope we were helpful in teaching you some stuff you didn't know before.
6. We will stay afterwards to answer any questions you may have, so please feel free to come talk to us! 
7. Thank you!