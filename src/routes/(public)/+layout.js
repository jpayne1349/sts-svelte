
// asynchronous functions that establishes connection with firebase. returns app and db objects
import { initFirebaseClient } from '../../initFirebaseClient';



export async function load() {
    
    let firebaseObjects;

    try {
        firebaseObjects = await initFirebaseClient();
        
    } catch(e) {
        console.log(e);
        
        // TODO: throw error here? or in initFirebaseClient..

    }
    
    
    return firebaseObjects;
}

