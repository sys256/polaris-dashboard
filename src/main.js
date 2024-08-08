
/**
 * main.js
 *
 */

import { createApp, markRaw }  from 'vue';

import Scene    from '@/world/Scene.js';
import Renderer from '@/world/Renderer.js';
import Controls from '@/world/Controls.js';
import World    from '@/world/World.js';

import pinia  from '@/plugins/pinia.js';
import router from '@/plugins/router';
//import rpc    from '@/plugins/rpc';

//import { useGeneral } from '@/plugins/general';

import 'ress/ress.css';     // CSS reset
import '@/mdi-custom.scss'; // MDI iconfont, custom CSS
import '@/main.scss';       // CSS common

import fontMdi      from '@mdi/font/fonts/materialdesignicons-webfont.woff2'         assert { type: 'file' };
import fontUbuntu   from 'ubuntu-fontface/fonts/ubuntu-regular-webfont.woff2'        assert { type: 'file' };
import fontUbuntuI  from 'ubuntu-fontface/fonts/ubuntu-regular-italic-webfont.woff2' assert { type: 'file' };
import fontUbuntuB  from 'ubuntu-fontface/fonts/ubuntu-bold-webfont.woff2'           assert { type: 'file' };
import fontUbuntuBI from 'ubuntu-fontface/fonts/ubuntu-bold-italic-webfont.woff2'    assert { type: 'file' };
import fontMenlo    from '@/fonts/menlo.woff2'                                       assert { type: 'file' };

import App        from '@/App.vue';
//import Icon       from '@/components/Icon.vue';
//import Btn        from '@/components/Btn.vue';
//import Pict       from '@/components/Pict.vue';
//import Fab        from '@/components/Fab.vue';
//import Gap        from '@/components/Gap.vue';
//import Breadcrumb from '@/components/Breadcrumb.vue';
//import Pagination from '@/components/Pagination.vue';

const html  = document.documentElement;
const clist = html.classList;

const fontFaces = [
    new FontFace( 'MDI',    `url('${ fontMdi }')`,      { weight: '400', style: 'normal' } ),
    new FontFace( 'Ubuntu', `url('${ fontUbuntu }')`,   { weight: '400', style: 'normal' } ),
    new FontFace( 'Ubuntu', `url('${ fontUbuntuB }')`,  { weight: '700', style: 'normal' } ),
    new FontFace( 'Ubuntu', `url('${ fontUbuntuI }')`,  { weight: '400', style: 'italic' } ),
    new FontFace( 'Ubuntu', `url('${ fontUbuntuBI }')`, { weight: '700', style: 'italic' } ),
    new FontFace( 'Menlo',  `url('${ fontMenlo }')`,    { weight: '400', style: 'normal' } ),
];

for ( const fontFace of fontFaces ) {
    document.fonts.add( fontFace );
    await fontFace.load();
}

//------------------------------------------------------------------------------
// App létrehozása. Plugin-ek beindítása. Hozzáférés ebből a kódból a General
// Store-hoz (Pinia state managerhez).

const app = createApp( App );

//app
    //.component( 'Pict',       Pict )
    //.component( 'Icon',       Icon )
    //.component( 'Btn',        Btn )
    //.component( 'Fab',        Fab )
    //.component( 'Gap',        Gap )
    //.component( 'Breadcrumb', Breadcrumb )
    //.component( 'Pagination', Pagination )

    //.use( router )
    //.use( pinia )
    //.use( rpc, { endpoint: RPC_ENDPOINT, debug: 0 } )
;

//const general = useGeneral();
//console.log( "A general store elérhető...", general );

app.use( router );
app.use( pinia );

//------------------------------------------------------------------------------
// Dark/Light téma kezelés. Az operációs rendszer dark/light appearance
// beállítását figyeli és követi.

/*const matchTheme = window.matchMedia( '(prefers-color-scheme: light)' ); // theme

function handleTheme ( ev ) {
    general.dark = !( general.light = ev.matches );
    clist[ general.dark  ? 'add' : 'remove' ]( 'dark'  );
    clist[ general.light ? 'add' : 'remove' ]( 'light' );
}

matchTheme.addEventListener( 'change', handleTheme );
handleTheme( matchTheme ); // Init
*/

//------------------------------------------------------------------------------
// Adaptív layout breakpoint-ok

/*const BP_LG = 1146;
const BP_MD =  906;
const BP_SM =  666;

const resizeObserver = new ResizeObserver( handleResize );
resizeObserver.observe( html );

function handleResize ( entries ) {
    for ( const entry of entries ) {
        if ( entry.target !== html ) continue;

        general.drawer = false;

        general.width  = entry?.borderBoxSize[ 0 ].inlineSize ?? entry.contentRect.width;
        general.height = entry?.borderBoxSize[ 0 ].blockSize  ?? entry.contentRect.height; // Nem használjuk fel

        general.lg = BP_LG <= general.width;                          // Large
        general.md = BP_MD <= general.width && general.width < BP_LG; // Medium
        general.sm = BP_SM <= general.width && general.width < BP_MD; // Small
        general.xs =                           general.width < BP_SM; // Extra small

        for ( const size of [ 'lg', 'md', 'sm', 'xs' ] ) {
            clist[ general[ size ] ? 'add' : 'remove' ]( size );
        }
    }
}
*/

//------------------------------------------------------------------------------

/*document.addEventListener( 'click', ( ev ) => {

    let a = ev?.target?.closest( 'a[href^="http"]' );
    if ( a ) return;

    a = ev?.target?.closest( 'a[href^="/@"]' );
    if ( a ) {
        ev.preventDefault();
        console.log( "click:", a.getAttribute( 'href' ) );

        const r = markRaw( router );
        r.push( { path: a.getAttribute( 'href' ).replace( '/@', '/' ) } );
    }
} );*/

//------------------------------------------------------------------------------

const scene = new Scene();
app.provide( 'scene', scene );

const renderer = new Renderer( scene );
app.provide( 'renderer', renderer );

const controls = new Controls( renderer );
app.provide( 'controls', controls );

const world = new World();
app.provide( 'world', world );

//------------------------------------------------------------------------------
// Geronimo!

app.mount( '#app' );
