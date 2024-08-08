/************************
 **  plugins/pinia.js  **
 **  Pinia Stores      **
 ************************/
'use strict';

/**
 * @typedef {Number} Integer
 */

import { createPinia, defineStore, mapStores, setMapStoreSuffix } from 'pinia';
import persistedstate                                             from 'pinia-plugin-persistedstate';

setMapStoreSuffix( '' ); // Completely remove the Store suffix, e.g. this.generalStore --> this.general

const pinia = createPinia();
pinia.use( persistedstate );

//pinia.use( ( { pinia, app, store, options } ) => {
    //store.$router = markRaw( router ); // A $ prefix csak konvenció, anélkül is működne
//} );
export default pinia;

export { mapStores };

export const useGeneral = defineStore( 'general', {
    persist: true,

    state: () => ( {
        canvasWidth:  800,
        canvasHeight: 450,
        finderLeft:   null, // 20,
        finderTop:    null, // 64,
        finderZ:      500,
        finderShow:   true,

        contentWidth:  800,
        contentHeight: 450,
        viewerLeft:    20,
        viewerTop:     64,
        viewerZ:       600,
        viewerShow:    false,

        //----------------------------------------------------------------------
        /*width:           0,
        height:          0,

        lg:              false,
        md:              false,
        sm:              false,
        xs:              false,

        light:           false, // Theme
        dark:            false, //

        drawer:          false, // Show/Hide navigation drawer
        login:           false, // Show/Hide login-logout modal
        settings:        false, // Show/Hide settings modal
        flash:           '',    // Show/Hide Flash and set its type: ''|message|success|failure
        flashMsg:        '',

        searchTerm:      '',    // A keresőmezőbe írt kifejezés
        token:           '',    // JWT

        resultsPgnum:    1,     // Pagination
        archivePgnum:    1,     //
        articlesPgnum:   1,     //
        bookletsPgnum:   1,     //
        bookletPgnum:    1,     //
        categoriesPgnum: 1,
        categoryPgnum:   1,     //

        topCategories:   []*/
    } ),


    getters: {
        //
    },


    // Unlike getters, actions can be asynchronous
    //
    actions: {
        /**
         * Centers the Finder
         *
         * @param {Renderer|WebGLRenderer} renderer
         */
        arrange ( renderer ) {
            const maxWidth  = window.innerWidth;
            const maxHeight = window.innerHeight - 45 * 4;

            // Ha a finder magasabb a viewportnál, lecsökkentjük a méretét
            while ( this.canvasHeight >= maxHeight || this.canvasWidth >= maxWidth ) {
                this.canvasWidth -= 128;
                this.canvasHeight = this.canvasWidth / 16 * 9;
                renderer.resize( this.canvasWidth, this.canvasHeight );
            }
            //const bcr = document.querySelector( '.finder' ).getBoundingClientRect(); // DOMRect
            this.finderLeft = Math.max( 0, ( window.innerWidth - this.canvasWidth ) / 2 );
            this.finderTop  = Math.max( 0, ( window.innerHeight - ( this.canvasHeight + 45 * 2 ) ) / 2 );


            while ( this.contentHeight >= maxHeight ) {
                this.contentHeight -= 72;
            }
            this.viewerLeft = 20;
            this.viewerTop  = Math.max( 0, ( window.innerHeight - ( this.contentHeight + 45 * 2 ) ) / 2 );


            //this.canvasZ = 500;
            //this.viewerZ = 600;
        },

        async updateTopCategories () {
            const re =  await this.rpc.call( 'get-top-categories', { limit: 3 } );
            this.topCategories = re.categories;
        },

        message ( msg ) {
            this.flashMsg = msg;
            this.flash    = 'message';
        },

        success ( msg ) {
            this.flashMsg = msg;
            this.flash    = 'success';
        },

        failure ( msg ) {
            this.flashMsg = msg;
            this.flash    = 'failure';
        }
    }

} );

//------------------------------------------------------------------------------

export const useStack = defineStore( 'stack', {
    persist: true,

    state: () => ( {
        items:     [], // Deck

        nextKey:   0,  // Unique key
        activeIdx: 0,  // Az aktív card. A pinned card feature bevezetése óta nem biztos, hogy a deck legutolsó eleme.

        width:     0,  // Browser inner width
        height:    0   // Browser inner height
    } ),


    getters: {
        //
    },


    actions: {
        /**
         * Új card elhelyezése a stack tetején
         *
         * @param {Object}         options       - A card inicializáló adatai
         * @param {Integer|String} options.x     - Left pozíció | 'center'
         * @param {Integer|String} options.y     - Top  pozíció | 'center'
         * @param {Integer}        options.w     - Card szélesség normal state esetén
         * @param {Integer}        options.h     - Card magasság normal state esetén
         * @param {String}         options.state - A card méretezése, 'minimized' | 'normal' | 'maximized'
         * @param {String}         options.title - A card címe
         * @param {String}         options.color - Fejléc és lábléc színe
         * @param {String}         options.icon  - MDI icon név
         */
        addCard ( options ) {
            const defaults = {
                x: 'center',
                y: 'center',
                w: 800,
                h: 540, // 480 + 45 * 2
                state: 'normal',
                storedState: 'normal',
                title: "",
                color: '#68a',
                icon: 'window-maximize',
                pinned: false
            };
            const opts = { ...defaults, ...options };

            if ( opts.x === 'center' ) opts.x = Math.floor( ( this.width - opts.w ) / 2 );
            if ( opts.y === 'center' ) opts.y = Math.floor( ( this.height - opts.h ) / 2 );

            opts.key = this.nextKey++;
            this.items.push( opts );
        },

        /**
         * Topmost card eltávolítása a stackből
         */
        removeCard () {
            /* const item = */ this.items.pop();

            if ( this.items.length === 0 ) this.nextKey = 0;
        },

        /**
         * A stack tetejére mozgatja az idx-edik card-ot
         *
         * @param {Integer} idx
         */
        bringToFront ( idx ) {
            const slice = this.items.splice( idx, 1 );
            this.items.push( slice[ 0 ] ); // { ...slice[ 0 ] }
        },

        /**
         * A stack aljára mozgatja az idx-edik card-ot
         *
         * @param {Integer} idx
         */
        sendToBack ( idx ) {
            const slice = this.items.splice( idx, 1 );
            this.items.unshift( slice[ 0 ] );
        },

        /**
         * A maximized cardokat normalra állítja. Az összes normal kártyát a
         * bal felső sarokba rendezi úgy, hogy minden header olvasható legyen.
         * A minimized card-ok koordinátáit egymást fedve állítja a bal felső
         * sarokba (state változtatása nélkül).
         */
        arrangeAll () {
            let x = 16;
            let y = 60;

            for ( const item of this.items ) {
                if ( item.state === 'maximized' ) item.state = 'normal';

                switch ( item.state ) {
                    case 'normal':
                        item.x = x;
                        item.y = y;

                        x += 16;
                        y += 45;
                    break;

                    case 'minimized':
                        item.x = 16;
                        item.y = 60;
                    break;
                }
            }
        },

        /**
         * A stack topmost elemét az (x, y) helyre pozicionálja
         * @param {Integer} x
         * @param {Integer} y
         */
        setPosition ( x, y ) {
            const item = this.items.at( -1 );
            item.x = x;
            item.y = y;
        },

        /**
         * Átméretezi a stack topmost elemét
         *
         * @param {Integer} w - Szélesség
         * @param {Integer} h - Magasság
         */
        setSize ( w, h ) {
            const item = this.items.at( -1 );
            item.w = w;
            item.h = h;
        },

        /**
         * Megváltoztatja a topmost card state-et
         *
         * @param {String} state - maximized|normal|minimized|stored
         */
        setState ( state ) {
            const item = this.items.at( -1 );

            switch ( state ) {
                // Maximize from normal / Normal from maximized
                case 'maximized':
                case 'normal':
                    item.state = state;
                break;

                // Minimize from normal/maximized
                case 'minimized':
                    item.storedState = item.state;
                    item.state = 'minimized';

                    // Beállítja a minimized helyett a következő nem minimized cardot topmostnak
                    for ( let idx = this.items.length - 1; idx >= 0; idx-- ) {
                        if ( this.items.at( idx ).state !== 'minimized' ) {
                            this.bringToFront( idx );
                            break;
                        }
                    }
                break;

                // Restore to normal/maximized from minimized
                case 'stored':
                    item.state = item.storedState;
                break;
            }
        },

        togglePinned () {
            const item = this.items.at( -1 );
            item.pinned = !item.pinned;
        }
    }
} );
