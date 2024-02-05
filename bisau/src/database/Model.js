import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import 'firebase/compat/firestore';

class Firebase {
    constructor() {
        this.showRoute = 0;
        this.app = firebase.initializeApp({
            apiKey: "AIzaSyAlVuCn8e0KyTGKWIYx_4-qwKYQglvCTJw",
            authDomain: "bisau-6f778.firebaseapp.com",
            projectId: "bisau-6f778",
            storageBucket: "bisau-6f778.appspot.com",
            messagingSenderId: "555537688765",
            appId: "1:555537688765:web:35933b629e1a657f4dafd4",
            measurementId: "G-B1SNM164FR"
          });

        this.auth = this.app.auth();
        this.currentUser = NaN;

        this.auth.onAuthStateChanged((user)=>{
            this.setCurrentUser(user);
            if (this.callback) {
                this.callback(user);
            }
        });

        // firebase database
        this.db = firebase.firestore();

        // firebase collections
        this.userCollection = this.db.collection('user');
        this.parkingCollection = this.db.collection('parkingSpot');

        // precompiled datas
        this.parkingSpots = [];
        this.setParkingLocationListener = ()=>{};
        this.parkingSpotsCallBack = ()=>{};
        this.setToggleVechicleState = ()=>{};
    }

    setCurrentUser(user) {
        this.currentUser = user;
    }
    setAuthCallBack(callback) {
        this.callback = callback;
    }
    

    /*
           _____          __  .__                 .__                __  .__               
          /  _  \  __ ___/  |_|  |__   ___________|__|____________ _/  |_|__| ____   ____  
         /  /_\  \|  |  \   __\  |  \ /  _ \_  __ \  \___   /\__  \\   __\  |/  _ \ /    \ 
        /    |    \  |  /|  | |   Y  (  <_> )  | \/  |/    /  / __ \|  | |  (  <_> )   |  \
        \____|__  /____/ |__| |___|  /\____/|__|  |__/_____ \(____  /__| |__|\____/|___|  /
                \/                 \/                      \/     \/                    \/ 
    */
   
    authChanged(auth) {
        console.log(auth);
    }
    
    async signUp(username, email, phone, password) {
        var user = await this.auth.createUserWithEmailAndPassword(email, password);
        this.createNewUser(username, email, phone, user.user.uid);
        return user;
    }
    
    logIn(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password)
    }

    logOut() {
        return this.auth.signOut();
    }

    resetPassword(email) {
        return this.auth.sendPasswordResetEmail(email)
    }


    /*
            .___                                         __                                 __  .__               
          __| _/____   ____  __ __  _____   ____   _____/  |_    ___________   ____ _____ _/  |_|__| ____   ____  
         / __ |/  _ \_/ ___\|  |  \/     \_/ __ \ /    \   __\ _/ ___\_  __ \_/ __ \\__  \\   __\  |/  _ \ /    \ 
        / /_/ (  <_> )  \___|  |  /  Y Y  \  ___/|   |  \  |   \  \___|  | \/\  ___/ / __ \|  | |  (  <_> )   |  \
        \____ |\____/ \___  >____/|__|_|  /\___  >___|  /__|    \___  >__|    \___  >____  /__| |__|\____/|___|  /
             \/           \/            \/     \/     \/            \/            \/     \/                    \/ 
    */
    createNewUser(username, email, phone, userID) {
        try {
            const result = this.userCollection.doc(userID).set({
                username: username,
                email: email,
                phone: phone,
                parkingSpots: [],
            });
        }
        catch (err) {
            console.error(err);
        }
    }
    // test required
    async createParkingSpot(userId, XCoor, YCoor, noBikes, noCars, priceBike=25, priceCar=25) {
        try {
            let temp = await this.parkingCollection.add({
                userId: userId,
                XCoor: XCoor,
                YCoor: YCoor,
                // number of free slots
                noBikes: noBikes,
                noCars: noCars,
                // price of parking time (PH)
                priceBike: priceBike,
                priceCars: priceCar,
                // number of booked time
                noBikesBooked: 0,
                noCarsBooked: 0,
            });
            let temp2 = this.userCollection.doc(userId).update({
                parkingSpots: firebase.firestore.FieldValue.arrayUnion(temp.id),

            });
            return temp;
        }
        catch (err) {
            console.error(err);
        }
    }

    /*
            .___                                         __      _____              __         .__    .__                
          __| _/____   ____  __ __  _____   ____   _____/  |_  _/ ____\____   _____/  |_  ____ |  |__ |__| ____    ____  
         / __ |/  _ \_/ ___\|  |  \/     \_/ __ \ /    \   __\ \   __\/ __ \_/ ___\   __\/ ___\|  |  \|  |/    \  / ___\ 
        / /_/ (  <_> )  \___|  |  /  Y Y  \  ___/|   |  \  |    |  | \  ___/\  \___|  | \  \___|   Y  \  |   |  \/ /_/  >
        \____ |\____/ \___  >____/|__|_|  /\___  >___|  /__|    |__|  \___  >\___  >__|  \___  >___|  /__|___|  /\___  / 
             \/           \/            \/     \/     \/                  \/     \/          \/     \/        \//_____/  
    */
    async getAllParkingSpots() {
        var temp = await this.parkingCollection.get();
        this.parkingSpots = [];

        temp.forEach(snapshot => {
            this.parkingSpots.push(snapshot.data());
        });

        return this.parkingSpots;
    }

    setParkingCallback(callback) {
        this.parkingSpotsCallBack = callback;
        if (this.parkingSpots.length > 0) {
            this.parkingSpotsCallBack();
        }
    }

}

export default Firebase;