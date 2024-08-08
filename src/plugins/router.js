/*************************
 **  plugins/router.js  **
 **  Vue Router         **
 *************************/
'use strict';

import { createRouter, createWebHistory } from 'vue-router';

import Home         from '@/views/Home.vue';
import Profile      from '@/views/Profile.vue';
import Registration from '@/views/Registration.vue';
import About        from '@/views/About.vue';
import Missing      from '@/views/Missing.vue';

const routes = [
    { path: '/',                           name: 'home',              component: Home         },
    { path: '/profile',                    name: 'profile',           component: Profile      },
    { path: '/registration',               name: 'registration',      component: Registration },
    { path: '/about',                      name: 'about',             component: About        },
    { path: '/:pathMatch(.*)*',            name: 'missing',           component: Missing      }
];

const router = createRouter( {
    history: createWebHistory( process.env.BASE_URL ),

    scrollBehavior ( to, from, savedPosition ) {

        /*document.querySelectorAll( '.face' ).forEach( item => {
            //item.scrollTo( { top: 0 } );
            item.scrollTop = 0;
            //item.scrollIntoView( { behavior: 'smooth', block: 'start', inline: 'nearest' } );
        } );*/

        /*const face = document.querySelector( `.face-${ to.name }` );
        if ( face ) face.scrollTop = 0;*/

        return savedPosition ? savedPosition : { top: 0, behavior: 'smooth' };
    },

    routes,
} );

export default router;
