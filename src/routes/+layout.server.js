


export const load = async function ({ locals }) {
	
    if(locals.policyCookieSet) {
        return { policyCookieSet: true }
    }

    return { policyCookieSet: false }

};