console.log('SW loaded');
self.addEventListener('push', (e => {
    // inside our event => want to be be able to get our payload 
    const data = e.data.json();
    console.log('push has been received');
    // now to show notification:
    self.registration.showNotification(data.title, {
        body: 'This is the body of my push notification',
        icon: 'https://www.iconsdb.com/icons/preview/white/photo-xxl.png'
        
    })
}))


