# Contributing

## Ensure permissions

Add contributors that need to merge pull requests to [github permissions](https://github.com/uber/nebula.gl/settings/access).

Add contributors that need to publish to npm to the following:

- [nebula.gl organization](https://www.npmjs.com/settings/nebula.gl/members)
- [nebula.gl package](https://www.npmjs.com/package/nebula.gl/access)
- [react-map-gl-draw package](https://www.npmjs.com/package/react-map-gl-draw/access)

## Install and configure npmrc

```
npm install -g npmrc
npmrc -c public
npm login
```

Login using your npm credentials

## Publishing to npm

To publish to npm, make sure you're using the public registry (`npmrc public`) and publish using `publish-prod`:

```
npmrc public && yarn run publish-prod
```

Versioning is done using [Semantic Versioning](https://semver.org/).

## Generating Changelog

Changelog can be generated using `./scripts/changelog.sh`
