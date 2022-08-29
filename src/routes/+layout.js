
// asynchronous functions that establishes connection with firebase. returns app and db objects
import { initFirebase } from '../initFirebase';



export async function load() {
    
    let firebaseObjects;

    try {
        firebaseObjects = await initFirebase();
        
    } catch(e) {
        console.log(e);
        
        // TODO: throw error here? or in initFirebase..

    }
    
    
    return firebaseObjects;
}

