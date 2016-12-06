const SortedMap = require('./SortedMap.js')

const NS = [[1000,1000], [10000,100], [100000,10], [1000000,1], [10000000,1]]

const timeof = ( f, n, m = 1 ) => {
	let dt = 0
	for ( let i = 0; i < m; i++ ) {
		global.gc()
		const t1 = Date.now()
		f()
		dt += (Date.now() - t1)
	}
	dt /= m
	return "OPS:" + 1000*N/dt + " T:" + 1000*dt 
}

for ( [N,M] of NS) {
	const map = new Map()
	let paat = SortedMap.Nil

	console.log( "N: ", N )

	console.log( "Adding to map", timeof( () => {
		for ( let i = 0; i < N; i++ ) {
			map.set( i, i )
		}
	}, N, M  ))

	console.log( "Adding to paat", timeof( () => {
		for ( let i = 0; i < N; i++ ) {
			paat = paat.set( i, i )
		}
	}, N, M ))

	console.log( "Deleting from map", timeof( () => {
		for ( let i = 0; i < N; i++ ) {
			map.delete( i )
		}
	}, N, M ))

	console.log( "Setting to undefined paat", timeof( () => {
		for ( let i = 0; i < N; i++ ) {
			paat = paat.set( i, undefined )
		}
	}, N, M ))

	console.log()
}

for ( [N,M] of NS ) {
	let paat = SortedMap.Nil
	for ( let i = 0; i < N; i++ ) {
		paat = paat.set( i, i );
	}

	console.log( "N: ", N )
	console.log( "Deleting from paat", timeof( () => {
		for ( let i = 0; i < N; i++ ) {
			paat = paat.delete( i )
		}
	}, N, M ))
	console.log()
}
