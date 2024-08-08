/******************************************
 **  ProcessWire Custom JSON-RPC Client  **
 **  Rev. 2023-12-07                     **
 **       2023-12-13                     **
 **       2024-05-26                     **
 **       2024-07-08                     **
 ******************************************/
'use strict';

import { ref }        from 'vue';
import { useGeneral } from '@/plugins/pinia.js';


export default {

    install: ( app, options ) => {

        const defaults = {
            endpoint:      '',
            progressDelay: 2000
        };

        const opts  = { ...defaults, ...options };
        const count = ref( 0 );


        async function call ( method, params ) {

            const general = useGeneral();

            const arr = new Uint32Array( 1 );
            crypto.getRandomValues( arr );
            const id = arr[ 0 ].toString( 36 ).slice( 0, 6 ).padStart( 6, '0' );


            count.value++;

            // NOTE https://developer.mozilla.org/en-US/docs/Web/API/Headers
            const headers = new Headers();
            headers.set( 'Content-Type', 'application/json' );
            if ( general.token ) headers.set( 'Authorization', `Bearer ${ general.token }` );


            let response;
            try {
                response = await fetch( opts.endpoint, {
                    method:      'POST',        // *GET | POST | PUT | DELETE | etc.
                    cache:       'no-cache',    // *default | no-cache | reload | force-cache | only-if-cached
                    credentials: 'same-origin', // *same-origin | omit | include
                    mode:        'cors',        // *cors | no-cors | same-origin -- NOTE https://stackoverflow.com/questions/36840396/fetch-gives-an-empty-response-body -- nem lehet no-cors
                    redirect:    'follow',      // *follow | manual | error
                    headers,
                    body:        JSON.stringify( { id, method, params } )
                } );

            } catch ( err ) {
                general.failure( "Fetch error" );
                return {};

            } finally {
                setTimeout( () => {
                    count.value--;
                }, opts.progressDelay );
            }

            //if ( !response?.ok ) throw "Response not OK";
            if ( !response?.ok ) {
                general.failure( "Bad response" );
                return {};
            }


            let re;
            try {
                re = await response.json();

            } catch ( err ) {
                general.failure( "Parse error" );
                return {};
            }

            if ( re?.id !== id ) {
                general.failure( "ID mismatch" );
                return {};
            }


            // ERROR
            // Az error code key létezik
            if ( typeof re?.code !== 'undefined' ) {

                // A code szigorúan integer értéket tartalmaz (pl. -7 | 0 | 42)
                if ( typeof re.code === 'number' && re.code === parseInt( re.code ) ) {
                    general.failure( typeof re?.error === 'string' ? `${ re.error } ID=${ re.code }` : `ID=${ re.code }` );

                } else {
                    general.failure( "Bad error code" ); // A szerver hibát jelez, de a küldött code nem integer
                }

                return {};
            }

            // ERROR
            // Nincs se error code key, se result key
            if ( typeof re?.result === 'undefined' ) {
                general.failure( "No result" );
                return {};
            }

            return re.result;
        }

        app.config.globalProperties.$rpc = { call, count };
    }
};
