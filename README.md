# azk-projects-boilerplate

`azk-projects-boilerplate` follow `azk` standards to create new npm packages.
Search for `azk-projects-boilerplate` to find what have to be changed before upload.

- **src**:  all files will transpiled with babel to lib/src
- **spec**: all files will transpiled with babel to lib/spec
- **bin**:  no ocours transpilation here

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
