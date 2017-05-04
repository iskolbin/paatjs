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

N        | ds   |  op/s    | time(ms)
---------|------|----------|----------
100      | Map  | 14925373 | 0.067
100      | Paat |  1904761 | 0.525
10000    | Map  | 21739130 | 0.46
10000    | Paat |  1455604 | 6.87
100000   | Map  | 12195121 | 8.2
100000   | Paat |   974658 | 102.6
1000000  | Map  |  4347826 | 201
1000000  | Paat |   798722 | 1006
10000000 | Map  |  2704164 | 3294
10000000 | Paat |   623713 | 14252

### Delete

N        | ds   | op/s     | time(ms)
---------|------|----------|----------
100      | Map  | 58823529 | 0.017
100      | Paat | 45454545 | 0.022
10000    | Map  | 45454545 | 0.22
10000    | Paat | 25641025 | 0.39
100000   | Map  | 33333333 | 3
100000   | Paat |   770416 | 129.8
1000000  | Map  |  4219409 | 237
1000000  | Paat |    10892 | 91806
10000000 | Map  |  3303600 | 3294
10000000 | Paat |     FAIL | FAIL

As we see `Map` implemented as hash-table outperforms in terms of raw performance persistent AA tree as expected. `Map.set` is roughly 5 times faster than `Paat.set` for our data sets. Delete operation for `Map` is actually faster than set. For `Paat` delete is performance killer, and for 1e7 elements I've got "Maximum call stack size exceeded" error. Hash tables have O(1) set and delete operations while `Paat`( and other binary trees ) have O(logn) complexity. Mutable `Map` has much less memory allocations during operations, which is especially noteable on delete ops. `Map` delete is O(1) amortized and no memory cost, while `Paat` needs to create new tree on each delete.

As a workaround one could virtually delete by setting to undefined. In this case `get` of non-existent element returns the same as element with key => undefined. Note that `has` will work as expected -- since you are not deleting the entry it will return `true`. After that you can sometimes `filter` your tree if number of virtually deleted entries are high.

Note that this comparsion is very basic and in many ways compares apples to oranges. `Paat` structures are sorted and persistent while `Map` structures are not.
