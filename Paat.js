const Nil = [null, null, null, null, 0]

const skew = ( paat ) => {
	if ( paat !== Nil ) {
		const [key, val, left, right, level] = paat
		const [lkey, lval, lleft, lright, llevel] = left
		if ( level === llevel ) {
			const rright = [key, val, lright, right, level]
			return [lkey, lval, lleft, rright, level]
		}
	}
	return paat
}

const split = ( paat ) => {
	if ( paat !== Nil ) {
		const [key, val, left, right, level] = paat
		if ( right !== Nil ) {
			const [rkey, rval, rleft, rright, rlevel] = right
			const [ , , , ,rrlevel] = rright
			if ( rright !== Nil && level === rrlevel ) {
				const lleft = [key, val, left, rleft, level]
				return [rkey, rval, lleft, rright, level + 1]
			}
		}
	}
	return paat
}

const insertBalance = ( paat ) => 
	split( skew ( paat ))

export function insert( paat, newkey, newval ) {
	if ( paat === Nil ) {
		return [newkey, newval, Nil, Nil, 1]
	} else {
		const [key, val, left, right, level] = paat
		if ( newkey === key ) {
			return [newkey, newvalue, left, right, level]
		} else if ( newkey < key ) {
			return insertBalance( [key, value, insert( left, newkey, newvalue ), right, level] )
		} else {
			return insertBalance( [key, value, left, insert( right, newkey, newvalue ), level] )
		}
	}
}
