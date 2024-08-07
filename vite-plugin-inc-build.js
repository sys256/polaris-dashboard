/*************************************
 **  IncBuild Vite Plugin           **
 **  Incrementing The Build Number  **
 *************************************/

import { readFile, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual }   from 'node:util';
//import { resolve }           from 'node:path';

export default async function incBuild( command ) {
    if ( command === 'build' ) {
        const tabs    = 4;
      //const pkgPath = resolve( __dirname, 'package.json' );
      //const pkg     = await import( './package.json', { assert: { type: 'json' } } );
        const pkgPath = process.env.npm_package_json;
        const pkg     = JSON.parse( await readFile( pkgPath ) );
        const pkgOrig = JSON.parse( JSON.stringify( pkg ) ); // Deep copy

        if ( typeof pkg.version !== 'string' ) pkg.version = '';
        let [ v0, v1, v2 ] = pkg.version.split( '.' );
        v0 = parseInt( v0 ) || 0,
        v1 = parseInt( v1 ) || 0,
        v2 = parseInt( v2 ) || 0

        if ( v2++ < 1000 ) v2 = 1001; // Az első build száma mindig 1001
        console.log( `Build ${ v2 }` );

        pkg.version = [ v0, v1, v2 ].join( '.' );

        // Update package.json
        if ( !isDeepStrictEqual( pkg, pkgOrig ) ) {
            console.log( `Update ${ pkgPath }` );
            await writeFile( pkgPath, JSON.stringify( pkg, null, tabs ) );
        }
    }

    return {
        name: 'inc-build'
    };
};
