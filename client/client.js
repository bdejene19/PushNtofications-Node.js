// our client file we need our public key (can be shown publicly => only truly need to hide private key)

const publicVapidKey = "BOPGX75ExQZ9cfiXWwKjcPCckDkOAfukIy4TyCnvxvYEC_6fSuKlxRkoeddzYvvpUC4EBnRvH224cmYOSA6uPpY";

// Checking for service worker
if ('serviceWorker' in navigator) {
    sendPushNotification().catch(err => console.log(err));
}

// to use away => need to call the function async
// our function will register, push and send the notification
async function sendPushNotification() {
    // registering service worker (just like service worker demo) => we are registering our worker.js file (it is our SW)
    const register = await navigator.serviceWorker.register('./sw_worker.js', {
        // pass a second parameter that is an object 
        // we are giving it a scope (where the service worker is applied) => slash implies page you are on and any child pages
        scope: "/"
    })
    console.log('Service Worker registered')
    // now want to register the push 
    console.log('Beginning to register the push')
    // to do so, we are creating a subcription variable that holds the promise of our register variable above
    // wil lthen call pushManager to then subscribe
    // subscribe takes in an object with:
    /**
     * userVisibility, application server key (the public vapid key, but converted => check webpush documentation if ever confused)
     *      - publicVapidKey needs to be converted from safe URL base64 string to a Unit8Array to pass it into the subscribe call
     */
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });
    console.log('push has been registered');

    //last thing we want to do is send push notification
    // Send Push Notification
    console.log('sending push...');
    // we essentially need to send our subscription in our client file to our server as the body in our 'subscription' post request
    await fetch('/subscribe', {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "content-type": "application/json"
        }
    });
    console.log('push notification sent');
    // last thing to do is actually create the service worker to handle the push event
}

// copy and pasted base64 to unit8array converter function
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }