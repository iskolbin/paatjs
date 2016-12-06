const hasEqualMethod = (obj) => Object.prototype.hasOwnProperty( obj, 'equal' )

const hasToJSMethod = (obj) => Object.prototype.hasOwnProperty( obj, 'toJS' )

const skew = (self) => {
	if ( !self.isNil()) {
		const {k, v, l, r, lvl} = self
		const {k: lk, v: lv, l: ll, r: lr, lvl: llvl} = l
		if ( !l.isNil() && lvl === llvl ) {
			const rr = new SortedMap( k, v, lr, r, lvl )
			return new SortedMap( lk, lv, ll, rr, lvl )
		}
	}
	return self
}

const split = (self) => {
	if ( !self.isNil()) {
		const {k, v, l, r, lvl} = self
		if ( !r.isNil()) {
			const {k: rk, v: rv, l: rl, r: rr, lvl: rlvl} = r
			const {lvl: rrlvl} = rr
			if ( !rr.isNil() && lvl === rrlvl ) {
				const ll = new SortedMap( k, v, l, rl, lvl )
				return new SortedMap( rk, rv, ll, rr, lvl + 1 )
			}
		}
	}
	return self
}

const setBalance = (self) => skew( split( self ))

const getNode = ( self, getk ) => {
	if ( self.isNil() ) {
		return self
	} else {
		const {k, l, r} = self
		if ( getk === k ) {
			return self
		} else if ( getk < k ) {
			return getNode( l, getk )
		} else {
			return getNode( r, getk )
		}
	}
}

const decreaseLevel = (self) => {
	const {k, v, r, l, lvl} = self
	const {l: {lvl: llvl}, r: {lvl: rlvl}} = self
	const shouldBe = ( llvl < rlvl + 1 ) ? llvl : rlvl + 1
	if ( shouldBe < lvl ) {
		return new SortedMap( k, v, l, r, shouldBe )
	} else if ( shouldBe < rlvl ) {
		const {k: rk, v: rv, l: rl, r: rr} = r
		return new SortedMap( k, v, l, new SortedMap( rk, rv, rl, rr, shouldBe ), lvl )
	} else {
		return self
	}
}

const deleteBalance = (self) => {
	const {k,v,l,r,lvl} = skew( decreaseLevel( self ))
	const paat2	= new SortedMap( k, v, l, skew( r ), lvl )
	const {k: k2, v: v2, l: l2, r: r2, lvl: lvl2} = paat2
	if ( !r2.isNil() ) {
		const {k: k3, v: v3, l: l3, r: r3, lvl: lvl3} = r2
		const rnode = new SortedMap( k3, v3, l3, skew( r3 ), lvl3 )
		const {k: k4, v: v4, l: l4, r: r4, lvl: lvl4} = split( new SortedMap( k2, v2, l2, rnode, lvl2 ))
		return new SortedMap( k4, v4, l4, split( r4 ), lvl4 )
	} else {
		const {k: k4, v: v4, l: l4, r: r4, lvl: lvl4} = split( paat2 )
		return new SortedMap( k4, v4, l4, split( r4 ), lvl4 )	
	}
}

const predecessor = (self) => {
	let pred = self.l
	while ( !pred.r.isNil() ) {
		pred = pred.r
	}
	return pred
}

const successor = (self) => {
	let succ = self.r
	while ( !succ.l.isNil()) {
		succ = succ.l
	}
	return succ
}

class SortedMap {
	static isSortedMap( v ) {
		return v instanceof SortedMap
	}

	constructor( k, v, l, r, lvl ) {
		this.k = k
		this.v = v
		this.l = l
		this.r = r
		this.lvl = lvl
	}

	isNil() {
		return this === SortedMap.Nil
	}

	get( k ) {
		return getNode( this, k ).v
	}

	has( k ) {
		return !getNode( this, k ).isNil()
	}
	
	set( newk, newv ) {
		if ( this.isNil()) {
			return new SortedMap( newk, newv, this, this, 1 )
		} else {
			const {k, v, l, r, lvl} = this
			if ( newk === k ) {
				return new SortedMap( newk, newv, l, r, lvl )
			} else if ( newk < k ) {
				return setBalance( new SortedMap( k, v, l.set( newk, newv ), r, lvl ))
			} else {
				return setBalance( new SortedMap( k, v, l, r.set( newk, newv ), lvl ))
			}
		}
	}
	
	delete( delk ) {
		if ( this.isNil() ) {
			return this
		} else {
			const {k, v, l, r, lvl} = this
			if ( delk === k ) {
				if ( l.isNil() && r.isNil()) {
					return l
				} else if ( l.isNil()) {
					const {k: sk, v: sv} = successor( this )
					return new SortedMap( sk, sv, l, r.delete( sk ), lvl )
				} else {
					const {k: pk, v: pv} = predecessor( this )
					return new SortedMap( pk, pv, l.delete( pk ), r, lvl )
				}
			} else if ( delk < k ) {
				return deleteBalance( new SortedMap( k, v, l.delete( delk ), r, lvl ))
			} else {
				return deleteBalance( new SortedMap( k, v, l, r.delete( delk ), lvl ))
			}
		}
	}

	forEach( f ) {
		if ( !this.isNil()) {
			const {k, v, l, r} = this
			l.forEach( f )
			f( v, k )
			r.forEach( f )
		}
	}

	reduce( f, acc ) {
		if ( this.isNil()) {
			return acc
		} else {
			const {k, v, l, r} = this
			return r.reduce( f, f( l.reduce( f, acc ), v, k ))
		}
	}

	reduceRight( f, acc ) {
		if ( this.isNil()) {
			return acc
		} else {
			const {k, v, l, r} = this
			return l.reduce( f, f( r.reduce( f, acc ), v, k ))
		}
	}

	map( f ) {
		if ( this.isNil()) {
			return this
		} else {
			const {k, v, l, r, lvl} = this
			return new SortedMap( k, f( k, v ), l.map( f ), r.map( f ), lvl )
		}
	}

	filter( p ) {
		let result = SortedMap.Nil;

		this.forEach( (v,k) => {
			if ( p(v,k)) {
				result = result.set( k, v )
			}
		} )

		return result
	}

	count( p ) {
		let n = 0;
		this.forEach( (v,k) => {
			if( p( v, k )) n++
		})
		return n;
	}

	get size() {
		return this.count( () => true )
	}

	keys() {
		return this.reduce( (acc, v, k) => {
			acc.push( k )
			return acc
		}, [] )
	}

	values() {
		return this.reduce( (acc, v, k) => {
			acc.push( v )
			return acc
		}, [] )
	}

	entries() {
		return this.reduce( (acc, v, k) => {
			acc.push( [k,v] )
			return acc
		}, [] )
	}

	toJS() {
		return this.reduce( (acc, v, k ) => {
			if ( hasToJSMethod( k )) {
				k = k.toJS()
			}
			if ( hasToJSMethod( v )) {
				v = v.toJS()
			}
			acc.set( k, v )
			return acc
		}, new Map() )
	}

	setMap( map ) {
		let result = this
		map.forEach( (v, k) => {
			if ( k instanceof Map ) {
				k = SortedMap.Nil.setMap( k )
			}
			if ( v instanceof Map ) {
				v = SortedMap.Nil.setMap( v )
			}
			result = result.set( k, v )
		})
		return result
	}

	static fromJS( jsobj ) {
		let result = SortedMap.Nil
		if ( jsobj instanceof Map ) {
			result = result.setMap( map )
		} else if ( jsobj instanceof Array ) {
			for ( let [k,v] of jsobj ) {
				result = result.set( k, v )
			}
		} else if ( jsobj instanceof Object ) {
			for ( let k in jsobj ) {
				result = result.set( k, jsobj[k] )
			}
		}
		return result
	}

	static equalMaps( map1, map2 ) {
		const size1 = map1.size
		const size2 = map2.size
		if ( size1 === size2 ) {
			for ( let [k,v1] of map1.entries()) {
				const v2 = map2.get( k )
				if ( hasEqualMethod( v1 ) && hasEqualMethod( v2 )) {
					if ( !v1.equal( v2 )) {
						return false
					}
				} else if ( v1 !== v2 ) {
					return false
				}
			}
			return true
		} else {
			return false
		}
	}

	equal( map ) {
		return SortedMap.equalMaps( this, map )
	}
}

SortedMap.Nil = new SortedMap( undefined, undefined, undefined, undefined, 0 )
SortedMap.Nil.l = SortedMap.Nil
SortedMap.Nil.r = SortedMap.Nil

module.exports = SortedMap
