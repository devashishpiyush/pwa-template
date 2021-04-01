if("serviceWorker" in navigator) {
    navigator.serviceWorker.register("ServiceWorker.js")
        .then((reg) => {console.log("Success: Service Worker Registered. ", reg);})
        .catch((error) => {console.log("Failed: Service Worker Not Registered. ", error);});
}