# azk-parser

- `azk-parser` can read a json and generate an `Azkfile.js`
- `azk-parser` can parse an `Azkfile.js` and generate json

## Parser and Generator

It uses `recast` for parsing and generation of javascript.

## AST toolbox

Because parsing javascript returns an AST (not an CST), is not always easy to generate the right syntax tree. We can use the project bellow to test new ast compositions.

- https://github.com/azukiapp/azkfile-ast-history-compare/commits/master
- https://github.com/benjamn/ast-types

## Azkfile.js

#### systems with 2 system

```js
import Generator from '../../../src/generator';
import Systems   from 'azk-parser/systems';
import System    from 'azk-parser/system';

var systems   = new Systems();
var system001 = new System({ name: 'system001' });
var system002 = new System({ name: 'system002' });

systems.add(system001);
systems.add(system002);

var generator = new Generator();
var code = generator.generate(systems.syntax);
```

- generates this code:

```js
/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */

// Adds the systems that shape your system
systems({
 system001: {},
 system002: {}
});
```

#### system dependencies

```js
system001.addDependency('system002');

var generator = new Generator();
var code = generator.generate(system001.syntax);
```

- generates this code:

```js
system001: {
  depends: ["system002"]
}
```


#### before start

```
$ npm install
```

#### test + lint (no watch)

```
$ gulp
```

#### test + lint + watch

```
$ gulp test
```

#### test + watch (no-lint)

```
$ gulp test-no-lint
```

#### publish a patch to npm

```
$ npm run-script patch
```
