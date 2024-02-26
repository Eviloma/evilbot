<!-- markdownlint-disable MD024-->
# **Change Log** 📜📝

All notable changes to the "**Evilbot**" repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [**4.0.2**] - 2024-02-26


### Changed

* Command updates now depend **not** on the environment (DEV/PROD), but on the environment variable (**DISABLE_UPDATE_COMMANDS**). This variable is *optional* and defaults to **false**, which enables command updates
* **Nodemon** has been replaced by **tsc-watch**
* All Embed components are now inherited from a shared instance that contains basic settings (color/timestamp/footer)

### Fixed

* Fixed an error when sending a join/leave message
* Fixed an error when the user was not assigned a role when logging in to the server 

## [**4.0.1**] - 2024-02-10

### Fixed

* Changed the logic of creating/deleting temporary voice channels to avoid crashes
* Fixed bugs in the music part of the bot, when a message was deleted when it did not exist, causing the bot to crash

## [**4.0.0**] - 2024-02-10

New thread bot. The bot was rewritten using TypeScript

## [**<4.0.0**] - OLD

Versions prior to 4.0.0 are no longer supported and the code has been removed, so changes prior to 4.0.0 will not be noted