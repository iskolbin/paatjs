class SortedMap {
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

	skew() {
		if ( !this.isNil()) {
			const {k, v, l, r, lvl} = this
			const {k: lk, v: lv, l: ll, r: lr, lvl: llvl} = l
			if ( !l.isNil() && lvl === llvl ) {
				const rr = new SortedMap( k, v, lr, r, lvl )
				return new SortedMap( lk, lv, ll, rr, lvl )
			}
		}
		return this
	}

	split() {
		if ( !this.isNil()) {
			const {k, v, l, r, lvl} = this
			if ( !r.isNil()) {
				const {k: rk, v: rv, l: rl, r: rr, lvl: rlvl} = r
				const {lvl: rrlvl} = rr
				if ( !rr.isNil() && lvl === rrlvl ) {
					const ll = new SortedMap( k, v, l, rl, lvl )
					return new SortedMap( rk, rv, ll, rr, lvl + 1 )
				}
			}
		}
		return this
	}

	setBalance() {
		return this.skew().split()
	}

	getNode( getk ) {
		if ( this.isNil() ) {
			return this
		} else {
			const {k, l, r} = this
			if ( getk === k ) {
				return this
			} else if ( getk < k ) {
				return l.getNode( getk )
			} else {
				return r.getNode( getk )
			}
		}
	}

	get( getk ) {
		return this.getNode( getk ).v
	}

	has( getk ) {
		return !this.getNode( getk ).isNil()
	}

	set( newk, newv ) {
		if ( this.isNil()) {
			return new SortedMap( newk, newv, this, this, 1 )
		} else {
			const {k, v, l, r, lvl} = this
			if ( newk === k ) {
				return new SortedMap( newk, newv, l, r, lvl )
			} else if ( newk < k ) {
				return new SortedMap( k, v, l.set( newk, newv ), r, lvl ).setBalance()
			} else {
				return new SortedMap( k, v, l, r.set( newk, newv ), lvl ).setBalance()
			}
		}
	}

	decreaseLevel() {
		const {k, v, r, l, lvl} = this
		const {l: {lvl: llvl}, r: {lvl: rlvl}} = this
		const shouldBe = ( llvl < rlvl + 1 ) ? llvl : rlvl + 1
		if ( shouldBe < lvl ) {
			return new SortedMap( k, v, l, r, shouldBe )
		} else if ( shouldBe < rlvl ) {
			const {k: rk, v: rv, l: rl, r: rr} = r
			return new SortedMap( k, v, l, new SortedMap( rk, rv, rl, rr, shouldBe ), lvl )
		} else {
			return this
		}
	}

	deleteBalance() {
		const {k,v,l,r,lvl} = this.decreaseLevel().skew()
		const paat2	= new SortedMap( k, v, l, r.skew(), lvl )
		const {k: k2,v: v2,l: l2,r: r2,lvl: lvl2} = paat2
		if ( !r2.isNil() ) {
			const {k: k3,v: v3,l: l3,r: r3,lvl: lvl3} = r2
			const rnode = new SortedMap( k3, v3, l3, r3.skew(), lvl3 )
			const {k: k4,v: v4,l: l4,r: r4,lvl: lvl4} = new SortedMap( k2, v2, l2, rnode, lvl2 ).split()
			return new SortedMap( k4, v4, l4, r4.split(), lvl4 )
		} else {
			const {k: k4,v: v4,l: l4,r: r4,lvl: lvl4} = paat2.split()
			return new SortedMap( k4, v4, l4, r4.split(), lvl4 )	
		}
	}

	predecessor() {
		let pred = this.l
		while ( !pred.r.isNil() ) {
			pred = pred.r
		}
		return pred
	}

	successor() {
		let succ = this.r
		while ( !succ.l.isNil()) {
			succ = succ.l
		}
		return succ
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
					const {k: sk, v: sv} = this.successor()
					return new SortedMap( sk, sv, l, r.delete( sk ), lvl )
				} else {
					const {k: pk, v: pv} = this.predecessor()
					return new SortedMap( pk, pv, l.delete( pk ), r, lvl )
				}
			} else if ( delk < k ) {
				return new SortedMap( k, v, l.delete( delk ), r, lvl ).deleteBalance()
			} else {
				return new SortedMap( k, v, l, r.delete( delk ), lvl ).deleteBalance()
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
			if ( k instanceof SortedMap ) {
				k = k.toMap()
			}
			if ( v instanceof SortedMap ) {
				v = v.toMap()
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

	static fromMap( map ) {
		return SortedMap.Nil.setMap( map )
	}
}

SortedMap.Nil = new SortedMap( undefined, undefined, undefined, undefined, 0 )
SortedMap.Nil.l = SortedMap.Nil
SortedMap.Nil.r = SortedMap.Nil

module.exports = SortedMap
