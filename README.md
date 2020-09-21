# wordlist-transformer

Simple utility written in javascript to transform wordlists. Requires nodejs. Currently supports the following options:


`--file
--output
--split
--filter
--prepend
--append`

Simple common use case can be run like so:

`node wlTransformer.js --split <u / p - optional> --filter --file <path to file>`

If one has a wordlist split by colon, i.e. abc:def, the above will split them and put 'abc' on a line preceeding 'def'. If one imagines a wordlist with two entries, abc:def and def:ghi, that means there will be entries 'abc', 'def', 'def', and 'ghi'. The `--filter` option filter duplicate values. The `--filter` option doesn't take any additional parameters as of this time, whereas the `--split` option allows `--split u` or `--split p` for splitting and retaining only the usernames or passwords respectively, if one rather than mix the two wants to produce a separate list for each.

The `--append` and `--prepend` options takes values that can, just like it sounds, be appended or prepended to dictionary entries.

`node wlTransformer.js --append 123 --file <path to file>`

The above command would append 123 to every entry in the wordlist. If `--append` or `--prepend` are used in conjuction with `--split` or `--filter` the latter options takes precedence, i.e. list is split, and filtered for dupes, prior to adding the additional data.

The `--output` option can be used to specify a custom output directory, filename, however, defaults to input filename with '_output' appended to it.

# Known issues

* Probably some related to parameter validation, but unless one deliberatly attempts to provide erronous input it seemingly works ok.
* Empty passwords or colon in passwords will produce funny results.
