const SortedMap = require('./SortedMap.js')

const NS = [1000, 10000, 100000, 1000000, 10000000]

const timeof = ( f, n ) => {
	const t1 = Date.now()
	f()
	const dt = Date.now() - t1
	return "OPS:" + dt/N + " T:" + dt 
}

for ( N of NS) {
	const map = new Map()
	let paat = SortedMap.Nil

	console.log( "N: ", N )

	console.log( "Adding to map", timeof( () => {
		for ( let i = 0; i < N; i++ ) {
			map.set( i, i )
		}
	}, N ))

	console.log( "Adding to paat", timeof( () => {
		for ( let i = 0; i < N; i++ ) {
			paat = paat.set( i, i )
		}
	}, N ))

	console.log( "Deleting from map", timeof( () => {
		for ( let i = 0; i < N; i++ ) {
			map.delete( i )
		}
	}, N ))

	console.log( "Setting to undefined paat", timeof( () => {
		for ( let i = 0; i < N; i++ ) {
			paat = paat.set( i, undefined )
		}
	}, N ))

	console.log()
}

for ( N of NS ) {
	let paat = SortedMap.Nil
	for ( let i = 0; i < N; i++ ) {
		paat = paat.set( i, i );
	}

	console.log( "N: ", N )
	console.log( "Deleting from paat", timeof( () => {
		for ( let i = 0; i < N; i++ ) {
			paat = paat.delete( i )
		}
	}, N ))
	console.log()
}
