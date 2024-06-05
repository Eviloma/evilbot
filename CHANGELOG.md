<!-- markdownlint-disable MD024-->

# **Change Log** 📜📝

All notable changes to the "**Evilbot**" repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [**4.5.0**] - 2024-06-05

### Added
- Biome.js

### Replaced
- `bun db:migrate` with `bun migrate`
- `bun db:generate` with `bun generate`
- `LAVALINK_NAMES` with `LAVALINK_NANE`
- `LAVALINK_HOSTS` with `LAVALINK_HOST`
- `LAVALINK_PASSWORDS` with `LAVALINK_PASSWORD`
- Shoukaku wuth Poru

### Removed
- Eslint and Prettier with Bione.js
- Removed support multiple Lavalink servers
- Temporary removed filters

## [**4.4.2**] - 2024-04-04

### Added

- Readded join message

### Deleted

- Deleted leave message permanently

## [**4.4.1**] - 2024-04-04

### Fixed

- Fixed ignore `LAVALINK_SECURED` flag

### Removed

- Temporary removed join/leave message

## [**4.4.0**] - 2024-04-02

### Changed

- Rewritten from using bun
- The bot is run on TypeSCript using bun

## [**4.3.3**] - 2024-03-01

### Changed

- Renamed `/setup temp_voice_channels_category` command on `/setup temp-voice-channels-category`

## [**4.3.2**] - 2024-03-01

### Fixed

- Fixed voice channel checks for music module
- Fixed a bug where the settings were not loaded when starting the bot, but only when any parameter was updated for the first time

## [**4.3.1**] - 2024-02-29

### Added

- Automatic database migration when the bot starts

## [**4.3.0**] - 2024-02-29

### Added

- Added **global chat setup** for the guild (used for greeting/leave messages, etc.)
- Added **music chat setup**
- Added **join role setup**
- Added new commands: `/setup global-channel`, `/setup music-channel`, `/setup join-role`, `/setup show`, `/setup temp_voice_channels_category`, `/setup join-to-talk-channel`

### Changed

- All guild settings are now in one table

### Removed

- Removed **GLOBAL_CHANNEL_ID**, **MUSIC_CHANNEL_ID**, **DEFAULT_MEMBER_ROLE_ID** and **GUILD_ID** envs
- Removed Multi-guild function due to possible problems related to the musical part
- Removed commands: `/setup temp-voice`

## [**4.2.0**] - 2024-02-28

### Added

- Added database
- Added the output of the list of **events** and **commands** in the form of a table in the console
- Added new commands: `/setup temp-voice`

### Changed

- The configuration of temporary voice channels has been moved to the database
- Temporary voice channels are now available on all guilds (The multi-guild function is in the process of implementation)

### Removed

- Removed **JOIN_TO_TALK_CHANNEL_ID** and **JOIN_TO_TALK_PARENT_ID** envs

## [**4.1.1**] - 2024-02-27

### Added

- Added new commands: `/affected`, `/fused`, `/kiss`, `/slap`, `/spank`
- Added **ICommandOption** interface for command options

### Changed

- All **CanvaCord** funny image generators share a **FunnyImage** class that unifies the logic and allows you to quickly change it for all generators

## [**4.1.0**] - 2024-02-26

### Added

- Added new commands: `/beautiful`, `/facepalm`, `/hitler`, `/rainbow`, `/rip`, `/trash`

### Changed

- Renamed the **watch** command to **dev**
- The bot now displays the version from the package.json file instead of the static one

### Fixed

- The display of pictures during the ping command has been removed

## [**4.0.2**] - 2024-02-26

### Changed

- Command updates now depend **not** on the environment (DEV/PROD), but on the environment variable (**DISABLE_UPDATE_COMMANDS**). This variable is _optional_ and defaults to **false**, which enables command updates
- **Nodemon** has been replaced by **tsc-watch**
- All Embed components are now inherited from a shared instance that contains basic settings (color/timestamp/footer)

### Fixed

- Fixed an error when sending a join/leave message
- Fixed an error when the user was not assigned a role when join to the server

## [**4.0.1**] - 2024-02-10

### Fixed

- Changed the logic of creating/deleting temporary voice channels to avoid crashes
- Fixed bugs in the music part of the bot, when a message was deleted when it did not exist, causing the bot to crash

## [**4.0.0**] - 2024-02-10

- The bot was rewritten using TypeScript

## [**<4.0.0**] - OLD

- Versions prior to 4.0.0 are no longer supported and the code has been removed, so changes prior to 4.0.0 will not be noted
