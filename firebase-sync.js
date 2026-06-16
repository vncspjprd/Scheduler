// firebase-sync.js - Cross-device sync via Firebase Firestore
//
// How it works:
// - Each browser signs in anonymously to Firebase (gets a random uid).
// - Your data is stored in Firestore at: syncGroups/{syncCode}
// - A "sync code" is a 6-character code that links multiple devices/browsers
//   to the SAME Firestore document, so they all read/write the same data.
// - On first run, generate a code on Device A (Settings page), then enter
//   that same code on Device B to link it.

const firebaseConfig = {
  apiKey: "AIzaSyD79yIQ4NEOCjhMhfEElMbCOgSmBnt7AiU",
  authDomain: "vincent-os.firebaseapp.com",
  projectId: "vincent-os",
  storageBucket: "vincent-os.firebasestorage.app",
  messagingSenderId: "964978402774",
  appId: "1:964978402774:web:0778a30234ea55b0bd3077"
};

const SYNC_CODE_KEY = "vincentOSSyncCode";

const CloudSync = {
  db: null,
  auth: null,
  ready: false,
  syncCode: null,
  unsubscribe: null,
  // Called by app.js when remote data changes (so UI can update)
  onRemoteUpdate: null,
  // Avoid feedback loop: ignore the next snapshot if it's caused by our own write
  _suppressNextSnapshot: false,

  init() {
    try {
      firebase.initializeApp(firebaseConfig);
      this.auth = firebase.auth();
      this.db = firebase.firestore();

      return new Promise((resolve) => {
        this.auth.onAuthStateChanged((user) => {
          if (user) {
            this.ready = true;
            this.syncCode = localStorage.getItem(SYNC_CODE_KEY);
            resolve(true);
          }
        });
        this.auth.signInAnonymously().catch((err) => {
          console.warn("Firebase anonymous sign-in failed:", err);
          resolve(false);
        });
      });
    } catch (e) {
      console.warn("Firebase init failed:", e);
      return Promise.resolve(false);
    }
  },

  hasSyncCode() {
    return !!this.syncCode;
  },

  getSyncCode() {
    return this.syncCode;
  },

  // Generate a new random 6-character code and create the doc with current state
  generateSyncCode(initialState) {
    const code = this._randomCode();
    return this.db.collection("syncGroups").doc(code).set({
      data: JSON.stringify(initialState),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
      this.syncCode = code;
      localStorage.setItem(SYNC_CODE_KEY, code);
      this._startListening();
      return code;
    });
  },

  // Link this device to an existing sync code. Returns the remote data (or null if not found).
  linkToSyncCode(code) {
    code = (code || "").trim().toUpperCase();
    return this.db.collection("syncGroups").doc(code).get().then((doc) => {
      if (!doc.exists) {
        return null;
      }
      this.syncCode = code;
      localStorage.setItem(SYNC_CODE_KEY, code);
      this._startListening();
      const raw = doc.data().data;
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    });
  },

  // Unlink this device (stops syncing, keeps local data)
  unlink() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.syncCode = null;
    localStorage.removeItem(SYNC_CODE_KEY);
  },

  // Push current state to Firestore
  push(state) {
    if (!this.ready || !this.syncCode) return Promise.resolve();
    this._suppressNextSnapshot = true;
    return this.db.collection("syncGroups").doc(this.syncCode).set({
      data: JSON.stringify(state),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }).catch((err) => {
      console.warn("Cloud push failed:", err);
    });
  },

  // Pull current state from Firestore once
  pull() {
    if (!this.ready || !this.syncCode) return Promise.resolve(null);
    return this.db.collection("syncGroups").doc(this.syncCode).get().then((doc) => {
      if (!doc.exists) return null;
      try {
        return JSON.parse(doc.data().data);
      } catch (e) {
        return null;
      }
    });
  },

  // Start listening for remote changes (called after generating/linking a code)
  _startListening() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.unsubscribe = this.db.collection("syncGroups").doc(this.syncCode)
      .onSnapshot((doc) => {
        if (this._suppressNextSnapshot) {
          this._suppressNextSnapshot = false;
          return;
        }
        if (!doc.exists) return;
        try {
          const remoteState = JSON.parse(doc.data().data);
          if (this.onRemoteUpdate) this.onRemoteUpdate(remoteState);
        } catch (e) {
          console.warn("Failed to parse remote data:", e);
        }
      }, (err) => {
        console.warn("Cloud listener error:", err);
      });
  },

  // Resume listening on page load if a sync code is already saved
  resumeListening() {
    if (this.syncCode) {
      this._startListening();
    }
  },

  _randomCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // avoid ambiguous chars (0/O, 1/I)
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  },
};