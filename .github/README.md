# can2x

> This project is a research prototype.

[![BMWK](https://img.shields.io/badge/BMWK-SofDCar%20(19S21002)-blue.svg)](https://sofdcar.de)
[![Release](https://github.com/milesstoetzner/stoetzms-can2x/actions/workflows/release.yaml/badge.svg)](https://github.com/milesstoetzner/stoetzms-can2x/actions/workflows/release.yaml)
[![Codacy Quality Badge](https://app.codacy.com/project/badge/Grade/8b0bd18dbdc844e4947b21b4e7bb5d9f)](https://app.codacy.com/gh/milesstoetzner/stoetzms-can2x/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Coverage Badge](https://app.codacy.com/project/badge/Coverage/8b0bd18dbdc844e4947b21b4e7bb5d9f)](https://app.codacy.com/gh/milesstoetzner/stoetzms-can2x/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.0-blue.svg)](https://vintner.opentosca.org/code-of-conduct)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Platforms](https://img.shields.io/badge/Platforms-Linux-blue.svg)](https://vintner.opentosca.org)
[![npm](https://img.shields.io/badge/npm-can2x-blue)](https://www.npmjs.com/package/can2x)


`can2x` is a simple utility for connecting a CAN bus bidirectional with one or multiple CAN busses over the network using common web protocols, such as HTTP, MQTT, Socket.IO, and WebSockets.

## Table of Contents

- [Overview](#overview)
- [Example](#example)
- [Installation](#installation)
- [Requirements](#requirements)
- [Commands](#commands)
  - [bridge start](#command-bridge-start) 
  - [bus start](#command-bus-start) 
  - [vcan check](#command-vcan-check) 
  - [vcan start](#command-vcan-start) 
  - [vcan stop](#command-vcan-stop) 
- [CAN Message](#can-message)
- [Limitations](#limitations)
- [Similar Projects](#similar-projects)
- [Dependencies](#dependencies)
- [Notes](#notes)
- [Keywords](#keywords)
- [Acknowledgements](#acknowledgements)

## Overview

`can2x` supports various sources and targets when bridging CAN messages. 
A source, such as a CAN bus in a first computing environment, forwards the CAN message to the target, such as a Socket.IO server running on a second computing environment.
This target then acts as a source and forwards the CAN message to another target, such as a CAN bus connected to the second computing environment.
It is also possible to have a arbitrary long chains of different of such bridges.
Also, most bridges are bidirectional, thus, CAN message are also bridged backward.
In addition, a can2x bus is able to connect multiple can2x bridges.

## Example

![Example](./example.png)

In the following example, we connect a vCAN on the source host to a vCAN on the target host using Socket.IO.

On the target host, start the vCAN and the Socket.IO server.

```shell
sudo can2x vcan start
can2x bridge start --source socketio --source-host 0.0.0.0 --target can
```

Then, on the target host, listen to the vCAN.

```shell
sudo apt-get update -y
sudo apt-get install can-utils -y
candump can2x
```

On the source host, start the vCAN and the Socket.IO client.
You need to replace the `<TARGET HOST IP>` with the actual IP of your target host.

```shell
sudo can2x vcan start
can2x bridge start --source can --target socketio --target-endpoint http://<TARGET HOST IP>:3000
```

Then, on the source host, send a message to the vCAN.

```shell
sudo apt-get update -y
sudo apt-get install can-utils -y
cansend can2x 01a#11223344AABBCCDD
```

On the target host, we can observe the CAN message.

```shell
can2x  01A   [8]  11 22 33 44 AA BB CC DD
```

## Installation

Install `can2x` system-wide using `npm`.
Ensure, that `npm bin -g` is in your `$PATH`.

```shell
npm install --global can2x
```

Alternatively, install `can2x` system-wide using `yarn` (classic).
Ensure, that `yarn global bin` is in your `$PATH`.

```shell
yarn global add can2x
```


## Requirements

`can2x` has the following requirements.

- Linux
- SocketCAN, thus, Git Bash and WSL are not supported


## Commands

`can2x` supports the following commands.

### Command `bridge start`

The following command starts a can2x bridge.

```shell
can2x bridge start [options]
```

The following options are supported.

| Option                     | Type                                                       | Default     | Required | Description | 
|----------------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--source`                 | `can`, `console`, `file`, `http`, `mqtt`, `socketio`, `ws` | `can`       | false    |             |
| `--source-port`            | number                                                     | `3000`      | false    |             |
| `--source-host`            | string                                                     | `localhost` | false    |             |
| `--source-event`           | string                                                     | `can2x`     | false    |             |
| `--source-topic`           | string                                                     | `can2x`     | false    |             |
| `--source-name`            | string                                                     | `can2x`     | false    |             |
| `--source-id`              | number                                                     | none        | false    |             |
| `--source-data`            | number[]                                                   | none        | false    |             |
| `--source-ext`             | boolean                                                    | none        | false    |             |
| `--source-rtr`             | boolean                                                    | none        | false    |             |
| `--source-file`            | string                                                     | none        | false    |             |
| `--source-bidirectional`   | boolean                                                    | `true`      | false    |             |
| `--target`                 | `can`, `console`, `file`, `http`, `mqtt`, `socketio`, `ws` | `console`   | false    |             |
| `--target-endpoint`        | string                                                     | none        | false    |             |
| `--target-event`           | string                                                     | `can2x`     | false    |             |
| `--target-topic`           | string                                                     | `can2x`     | false    |             |
| `--target-name`            | string                                                     | `can2x`     | false    |             |
| `--target-file`            | string                                                     | none        | false    |             |
| `--target-bidirectional`   | boolean                                                    | `true`      | false    |             |


### Sources

`can2x` supports the following sources.

#### CAN Bus

`can2x` supports a `can2x` bridge, i.e., `--source can`.
The following options are supported.

| Option                   | Type                                                       | Default     | Required | Description | 
|--------------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--source-name`          | string                                                     | `can2x`     | false    |             |
| `--source-bidirectional` | boolean                                                    | `true`      | false    |             |

#### Console

`can2x` supports a `console2x` bridge, i.e., `--source console`.
The following options are supported.

| Option                     | Type                                                       | Default     | Required | Description | 
|----------------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--source-id`              | number                                                     | none        | true     |             |
| `--source-data`            | number[]                                                   | none        | true     |             |

#### File

`can2x` supports a `file2x` bridge, i.e., `--source file`.
The following options are supported.

| Option          | Type                                                       | Default     | Required | Description | 
|-----------------|------------------------------------------------------------|-------------|----------|-------------|
| `--source-file` | string                                                     | none        | true     |             |

#### HTTP

`can2x` supports a `http2x` bridge, i.e., `--source http`.
The following options are supported.

| Option              | Type                                                       | Default     | Required | Description | 
|---------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--source-port`     | number                                                     | `3000`      | false    |             |
| `--source-host`     | string                                                     | `localhost` | false    |             |

#### MQTT

`can2x` supports a `mqtt2x` bridge, i.e., `--source mqtt`.
The following options are supported.

| Option                     | Type                                                       | Default     | Required | Description | 
|----------------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--source-port`            | number                                                     | `3000`      | false    |             |
| `--source-host`            | string                                                     | `localhost` | false    |             |
| `--source-topic`           | string                                                     | `can2x`     | false    |             |
| `--source-bidirectional`   | boolean                                                    | `true`      | false    |             |

#### Socket.IO

`can2x` supports a `socketio2x` bridge, i.e., `--source socketio`.
The following options are supported.

| Option                     | Type                                                       | Default     | Required | Description | 
|----------------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--source-port`            | number                                                     | `3000`      | false    |             |
| `--source-host`            | string                                                     | `localhost` | false    |             |
| `--source-event`           | string                                                     | `can2x`     | false    |             |
| `--source-bidirectional`   | boolean                                                    | `true`      | false    |             |

#### WebSocket

`can2x` supports a `ws2x` bridge, i.e., `--source ws`.
The following options are supported.

| Option                      | Type                                                       | Default     | Required | Description | 
|-----------------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--source-port`             | number                                                     | `3000`      | false    |             |
| `--source-host`             | string                                                     | `localhost` | false    |             |
| `--source-bidirectional`    | boolean                                                    | `true`      | false    |             |

### Targets

`can2x` supports the following targets.

#### CAN Bus

`can2x` supports a `x2can` bridge, i.e., `--target can`.
The following options are supported.

| Option                   | Type                                                       | Default     | Required | Description | 
|--------------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--target-name`          | string                                                     | `can2x`     | false    |             |
| `--target-bidirectional` | boolean                                                    | `true`      | false    |             |

#### Console

`can2x` supports a `x2console` bridge, i.e., `--target console`.
No options are supported.

#### File

`can2x` supports a `x2file` bridge, i.e., `--target file`.
The following options are supported.

| Option              | Type                                                       | Default     | Required | Description | 
|---------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--target-file`     | string                                                     | none        | true     |             |

#### HTTP

`can2x` supports a `x2http` bridge, i.e., `--target http`.
The following options are supported.

| Option              | Type                                                       | Default     | Required | Description | 
|---------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--target-endpoint` | string                                                     | none        | true     |             |

#### MQTT

`can2x` supports a `x2mqtt` bridge, i.e., `--target mqtt`.
The following options are supported.

| Option                   | Type                                                       | Default     | Required | Description | 
|--------------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--target-endpoint`      | string                                                     | none        | true     |             |
| `--target-topic`         | string                                                     | `can2x`     | false    |             |
| `--target-bidirectional` | boolean                                                    | `true`      | false    |             |

#### Socket.IO

`can2x` supports a `x2socketio` bridge, i.e., `--target socketio`.
The following options are supported.

| Option                     | Type                                                       | Default     | Required | Description | 
|----------------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--target-endpoint`        | string                                                     | none        | true     |             |
| `--target-event`           | string                                                     | `can2x`     | false    |             |
| `--target-bidirectional`   | boolean                                                    | `true`      | false    |             |

#### Websocket

`can2x` supports a `x2ws` bridge, i.e., `--target ws`.
The following options are supported.

| Option                     | Type                                                       | Default     | Required | Description | 
|----------------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--target-endpoint`        | string                                                     | none        | true     |             |
| `--target-bidirectional`   | boolean                                                    | `true`      | false    |             |



### Command `bus start`

The following command starts a can2x bus.

```shell
can2x bus start [options]
```

The following options are supported.

| Option    | Type               | Default      | Required | Description | 
|-----------|--------------------|--------------|----------|-------------|
| `--bus`   | `can`, `socketio`  | `socketio`   | false    |             |
| `--port`  | number             | `3000`       | false    |             |
| `--host`  | string             | `localhost`  | false    |             |
| `--event` | string             | `can2x`      | false    |             |
| `--name`  | string             | `can2x`      | false    |             |


`can2x` supports the following busses.


#### CAN Bus

`can2x` supports a `can` bus, i.e., `--bus can`.
The following options are supported.

| Option   | Type         | Default      | Required | Description | 
|----------|--------------|--------------|----------|-------------|
| `--name` | string       | `can2x`      | false    |             |


#### Socket.IO

`can2x` supports a `socketio` bus, i.e., `--bus socketio`.
The following options are supported.

| Option    | Type         | Default      | Required | Description | 
|-----------|--------------|--------------|----------|-------------|
| `--port`  | number       | `3000`       | false    |             |
| `--host`  | string       | `localhost`  | false    |             |
| `--event` | string       | `can2x`      | false    |             |


### Command `vcan check`

The following command checks if required module exist.

```shell
can2x vcan check
```

No options are supported.

### Command `vcan start`

The following command starts a vCAN using SocketCAN.

```shell
can2x vcan start [options]
```

The following options are supported.

| Option    | Type      | Default    | Required | Description            | 
|-----------|-----------|------------|----------|------------------------|
| `--name`  | string    | `can2x`    | false    | The name of the vCAN.  |

### Command `vcan stop`

The following command stops a vCAN using SocketCAN.

```shell
can2x vcan stop [options]
```

The following options are supported.

| Option    | Type      | Default    | Required | Description            | 
|-----------|-----------|------------|----------|------------------------|
| `--name`  | string    | `can2x`    | false    | The name of the vCAN.  |


## CAN Message

A CAN message is internally represented as follows.

| Option | Type     | Description                             | 
|--------|----------|-----------------------------------------|
| `id`   | number   | The decimal id of the CAN message.      |
| `data` | number[] | The decimal payload of the CAN message. |
| `ext`  | boolean  |                                         |
| `rtr`  | boolean  |                                         |


## Limitations

- security aspects, such as encryption, authentication, and authorization, are not supported
- there are no guarantees, e.g., the ordering of messages or even if a message is delivered at all

## Similar Projects

It is worth to check out the following projects.

- [`can2udp`](https://opensource.lely.com/canopen/docs/can2udp)
- [`can2mqtt`](https://github.com/c3re/can2mqtt)
- [`cannelloni`](https://github.com/mguentner/cannelloni)


## Dependencies

The licenses of the dependencies that `can2x` uses in production are as follows.

```
license-checker --production --summary --onlyAllow "MIT;Apache-2.0;Python-2.0;BSD-2-Clause;BSD-3-Clause;ISC;CC-BY-3.0;CC0-1.0;PSF;0BSD;BlueOak-1.0.0"
├─ MIT: 193
├─ ISC: 58
├─ Apache-2.0: 3
├─ BSD-2-Clause: 2
├─ BSD-3-Clause: 2
├─ BlueOak-1.0.0: 2
└─ Python-2.0: 1
```

## Notes

Some helpful notes.

### Manually Starting a vCAN

The following commands start a vCAN.

```shell
sudo modprobe can
sudo modprobe can_raw
sudo modprobe vcan

ip link add vcan0 type vcan
ip link set vcan0 up
```

### Manually Stopping a vCAN

The following commands stop a vCAN.

```shell
ip link set vcan0 down
ip link delete vcan0
```


## Keywords

http, mqtt, can, bridge, ws, websocket, socketio, vcan, can2http, can2mqtt, can2socketio, can2x, can2ws, virtual

## Acknowledgements

This project is s partially funded by the [German Federal Ministry for Economic Affairs and Climate Action (BMWK)](https://www.bmwk.de/Navigation/EN/Home/home.html) as part of the [Software-Defined Car (SofDCar)](https://sofdcar.de) project (19S21002).
