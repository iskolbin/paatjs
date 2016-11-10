Persistent Arne Andersson Trees for JS
======================================

Persistent implementation of [AA trees](https://en.wikipedia.org/wiki/AA_tree). Implementation somehow mimics [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) methods. Benefits of using `Paat` over `Map` are:

* Persistence, efficient storing of all changed copies 
* Data is always sorted

Methods
-------

`set`

`get`

`delete`

`has`

`forEach`

`reduce`

`reduceRight`

`map`

`filter`

`keys`

`values`

`entries`

`toMap`

`setMap`

`count`

Properties
----------

`size`

`Nil`

Static methods
--------------

`fromMap`

Benchmark
---------
Simple benchmark included in `test.js`. First we add 1 to N keys and after that we delete these keys. The results for node 7.0.0 on iMac Core i5 2.9 GHz, 32 GB RAM are:

### Set

N        | ds   |  op/s   | time(s)
---------|------|---------|--------
10000    | Map  | 0.0002  | 2
         | Paat | 0.0011  | 11
100000   | Map  | 0.00015 | 15
         | Paat | 0.001   | 100
1000000  | Map  | 0.000201| 201
         | Paat | 0.001006| 1006
10000000 | Map  | 0.000329| 3294
         | Paat | 0.001425| 14252

### Delete

N        | ds   | op/s    | time(s)
---------|------|---------|--------
10000    | Map  | 0.0002  | 2
         | Paat | 0.0029  | 29
100000   | Map  | 0.0001  | 10
         | Paat | 0.0118  | 1180
1000000  | Map  | 0.000162| 162
         | Paat | 0.083631| 83631
10000000 | Map  | 0.000329| 3294
         | Paat | FAIL    | FAIL

As we see `Map` implemented as hash-table outperforms in terms of raw performance persistent AA tree as expected. `Map.set` is roughly 5 times faster than `Paat.set` for our data sets. Delete operation for `Map` is actually faster than set. For `Paat` delete is performance killer, and for 1e7 elements I've got "Maximum call stack size exceeded" error. Hash tables have O(1) set and delete operations while `Paat`( and other binary trees ) have O(logn) complexity. Mutable `Map` has much less memory allocations during operations, which is especially noteable on delete ops. `Map` delete is O(1) amortized and no memory cost, while `Paat` needs to create new tree on each delete.

As a workaround one could virtually delete by setting to undefined. In this case `get` of non-existent element returns the same as element with key => undefined. Note that `has` will work as expected -- since you are not deleting the entry it will return `true`. After that you can sometimes `filter` your tree if number of virtually deleted entries are high.

Note that this comparsion is very basic and in many ways compares apples to oranges. `Paat` structures are sorted and persistent while `Map` structures are not.
