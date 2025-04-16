# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.1] - 04-16-2025

### Changed

- Improved logging messages for QA.

### Fixed

- Fix for PausePlugin generating an error when a page changes within a SPA. [Ticket](https://pbskids.atlassian.net/browse/WEB-287)

## [4.0.0] - 2025-03-04

### Changed

- Updated Node.js version to v20.18.1
- Updated 29 dependencies:
  - `@babel/core` ^7.4.3 --> ^7.26.0
  - `@babel/polyfill` ^7.4.3 --> ^7.12.1 (Latest version before deprecation. Should be removed at some point, if possible.)
  - `@babel/preset-env` ^7.4.3 --> ^7.26.0
  - `@rollup/plugin-babel` ^6.0.3 --> ^6.0.4
  - `@rollup/plugin-commonjs` ^24.0.1 --> ^28.0.2
  - `@rollup/plugin-eslint` ^9.0.3 --> ^9.0.5
  - `@rollup/plugin-json` ^6.0.0 --> ^6.1.0
  - `@rollup/plugin-node-resolve` ^15.0.1 --> ^16.0.0
  - `@rollup/plugin-terser` ^0.4.0 --> ^0.4.4
  - `babel-loader` ^8.0.5 --> ^9.2.1
  - `bellhop-iframe` ^3.2.0 --> ^3.6.0
  - `chai` ^4.2.0 --> ^4.5.0 (upgrading to v5 breaks tests, to be fixed at a later date.)
  - `core-js` ^3.6.5 --> ^3.40.0
  - `dotenv` ^7.0.0 --> ^16.4.7
  - `eslint` ^8.43.0 --> ^9.17.0
  - `eslint-plugin-import` ^2.17.2 --> ^2.31.0
  - `eslint-plugin-node` ^8.0.1 --> ^11.1.0
  - `eslint-plugin-prettier` ^3.0.1 --> ^5.2.1
  - `karma` ^6.3.17 --> ^6.4.4
  - `karma-babel-preprocessor` ^8.0.0 --> ^8.0.2
  - `karma-browserstack-launcher` ^1.5.1 --> ^1.6.0
  - `karma-rollup-preprocessor` ^7.0.5--> ^7.0.8
  - `karma-webpack` ^5.0.0 --> ^5.0.1
  - `mocha` ^10.2.0 --> ^10.8.2 (upgrading to v11 breaks tests, to be fixed at a later date.)
  - `requirejs` ^2.3.6 --> ^2.3.7
  - `rollup` ^3.17.2 --> ^4.30.1
  - `sinon` ^7.5.0 --> ^19.0.2
  - `webpack` ^5.8.22 --> ^5.97.1
  - `whatwg-fetch` ^3.0.0 --> ^3.6.20
- Add Muted properties to Sound Plugin Type. [Part of ticket](https://pbskids.atlassian.net/browse/WEB-109)
- Updated Pause Plugin unit tests to reflect updated Pause functionality.

### Removed

- Removed UserData plugin and SavedData Handler. The UserData plugin has been moved to platform code and can be managed for the website in the `pbs/pbs-kids-website` project. [Part of ticket](https://pbskids.atlassian.net/browse/WEB-105)

## [3.0.0] - 2025-01-03

This is the start of the websquad's fork of https://github.com/pbs/SpringRollContainer to be used in the pbskids redesign (project name "Puma").

### Changed

- Update PausePlugin to require manual unpause when the application window regains focus. [Ticket](https://www.pivotaltracker.com/story/show/188461849)

## [2.5.2] - 2024-06-18

### Fixed

- Ensured that CaptionsTogglePlugin internal state is maintained when reading from localStorage on startup

## [2.5.1] - 2024-04-16

### Fixed

- Fixed order of parameters in `_setMuteProp()` call in `CaptionsTogglePlugin` so Container correctly sets initial state of toggle button

## [2.5.0] - 2024-02-21

### Changed

- Prevent SoundPlugin from sending mute state before Application is loaded.
- Prevent CaptionsTogglePlugin from sending mute state before Application is loaded.
- updated .nvmrc to 18

### Added

- Added a check to make sure plugin preloads are finished before opening up the application to avoid race conditions.

## [2.4.6] - 2023-10-16

### Fixed

- added check to prevent sub sound channel volumes being set to 0 causing soundVolume to be set to 1 in the game
- Added/fixed logic in `SoundPlugin` volume and toggle handlers to make sure everything stays in sync and respects user preferences better

## [2.4.5] 2023-09-08

### Fixed

- CaptionsStylesPlugin now correctly updates radio button status when the style is changed programatically
- Changed CaptionsStylePlugin to have distinct name
- added logic to SoundPlugin.sendAllProperties to ensure sound mutes don't overwrite volume

## [2.4.4] 2023-02-27

### Fixed

- Changed deploy workflow to only run when an actual release is made

### Changed

- Update Rollup to 3.17.2
- Changed nvmrc version to v16.19.1
- Bump minimatch from 3.0.4 to 3.1.2, and mocha from 8.2.1 to 10.2.0
- Bump loader-utils from 1.1.0 to 1.4.2
- Bump ua-parser-js from 0.7.31 to 0.7.33
- Bump nanoid from 3.1.12 to 3.3.3
- Bump socket.io-parser from 4.0.4 to 4.0.5
- Bump engine.io from 6.1.3 to 6.4.0, and socket.io from 4.4.1 to 4.6.0


## [2.4.3] 2023-02-03

### Fixed

 - Removed `focusApp()` call from `PausePlugin.init()` which could lead to race conditions with page focus

## [2.4.2] 2022-12-30

### Fixed

- Fixed PausePlugin focus management so game pauses/unpauses properly on load

## [2.4.0] 2022-07-05

## Added

- Added `manageOwnVisibility` flag to the PausePlugin to make turning off visibility/focus management easier

## [2.3.4] 2022-06-09

## Changed

- Bumped path-parse dependency from 1.0.6 to 1.0.7
- Bumped glob-parent dependency from 5.1.1 to 5.1.2

## [2.3.3] 2022-05-05

## Changed

- Bumped ansi-regex dependency from 3.0.0 to 3.0.1

## [2.3.2] 2022-04-14

## Fixed

- re-re-named UserDataPlugin onUserDataRead and onUserDataRemove parameters from 'name' to 'data' to match Bellhop

## [2.3.1] 2022-03-10

### Fixed

- replaced `return` with `continue` in set up plugin function

## [2.3.0] - 2022-03-03

### Added

- Added context object to Container to allow data sharing between Container and plugins

## Changed

- Bumped karma dependency from 5.2.3 to 6.3.14

## [2.2.5] - 2022-02-03

- Upgraded follow-redirects dependency for security alert

## Fixed

- Fixed error when reporting a plugin preload failure

## [2.2.4] - 2021-06-04

## Changed

- Minor dependency version updates

## [2.2.3] - 2021-05-21

## Changed

- updated `singlePlay` response to not return an object containing the boolean, but just the boolean itself.

## [2.2.2] - 2021-05-05

## Changed

- Updated comments and docs to be more accurate and up to date

## [2.2.1] - 2021-03-04

### Changed

- socket.io dependency version bump

## [2.2.0] - 2021-02-19

### Added

- Indexeddb additions to the userdata class

### Changed

- update NPM modules to remove security vulnerabilities
- This CHANGELOG
- Fullscreen Plugin. The ability to add in a fullscreen button within container
- Fullscreen Plugin Automated Testing
- Fullscreen Plugin Documentation
- Indexeddb additions to the userdata class
- update NPM modules to remove security vulnerabilities
