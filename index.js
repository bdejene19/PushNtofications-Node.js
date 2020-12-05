// bring in required dependencies
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
// for webpush => we need to bring in our vapid keys (check documentation)
// we need to access the location of webpush before we can generate our vapid keys 
// in terminal, the location is: ./node_modules/.bin/web-push <command to run (e.g. generate-vapid-keys)>

// terminal has generated keys => therefore, want to place them in a variable (if deploying server => put any keys in some environment)
// NOTE: vapid keys identify who is sending the push notification
const publicVapidKey = "BOPGX75ExQZ9cfiXWwKjcPCckDkOAfukIy4TyCnvxvYEC_6fSuKlxRkoeddzYvvpUC4EBnRvH224cmYOSA6uPpY";
const privateVaidKey = "UA95eRqob2o6FSTOBloFss-Wnd2N-4BTYSvuT-ohTwQ";


//setting status files
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.json());


// now want to set vapid details for webpush => takes in a mailto parameter (put in address), then input your vapid keys (public then private)
webpush.setVapidDetails(
    "mailto:test@test.com", 
    publicVapidKey, 
    privateVaidKey);

// now want to create our subscribe route => what you send from yoru client to your route (what causes your notification to send to your service worker)

app.post('/subscribe', (req, res) => {
    // first want to get pushSubscription object
    const subscription = req.body;

    // now send back 201 status => meaning resource was created successfully
    res.status(201).json({});

    // create payload => can attach a payload if yo uwant
    // however, will be putting the title of the push notification as the payload
    const payload = JSON.stringify({title: "push test"}) // this will be the title of our notification (Push Testx`)

    // our object of payload has now been created and can be passed throug hthe sendNotification method
    webpush.sendNotification(subscription, payload)
    .catch(err => console.log(err));

})

const PORT = 5000 || process.env.PORT

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))