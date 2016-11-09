const Paat = require('./Paat.js')

const NS = [1000, 10000, 100000, 1000000, 10000000]

const timeof = ( f, n ) => {
	const t1 = Date.now()
	f()
	const dt = Date.now() - t1
	return "OPS:" + dt/N + " T:" + dt 
}

for ( N of NS) {
	const map = new Map()
	let paat = Paat.Nil

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

	console.log( "Deleting from paat", timeof( () => {
		for ( let i = 0; i < N; i++ ) {
			paat = paat.delete( i )
		}
	}, N ))
	console.log()
}
