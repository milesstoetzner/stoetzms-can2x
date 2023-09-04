# can2x

> This project is a research prototype and should not be used in production.

`can2x` is a simple utility for connecting a CAN bus unidirectional with another CAN bus over the network using common web protocols, such as HTTP, MQTT, Socket.IO, and WebSockets.

## Overview

`can2x` supports various sources and targets when bridging CAN messages. 
A source, such as a CAN bus in a first computing environment, forwards the CAN message to the target, such as a Socket.IO server running on a second computing environment.
This target then acts as a source and forwards the CAN message to another target, such as a CAN bus connected to the second computing environment.
It is also possible to have a arbitrary long chains of different of such bridges.

## Installation

`can2x` can be installed using `npm` or `yarn`.

### NPM

Install `can2x` system-wide using `npm`.

```
npm install --global can2x
```

### Yarn 

Install `can2x` system-wide using `yarn`.

```
yarn global add can2x
```

Ensure, that `yarn global bin` is in your `$PATH`.
This can be done by adding the following line to `~/.bashrc`.

```
export PATH="$PATH:$(yarn global bin)"
```

And then source `~/.bashrc`.

```
source ~/.bashrc
```


## Requirements

`can2x` has the following requirements.

- Linux
- SocketCAN, thus, Git Bash and WSL are not supported


## Example

The following command starts a socketio2can bridge.

```
can2x bridge start --source socketio --target can --target-name canOUT
```

The following command starts a can2socketio bridge.

```
can2x bridge start --source can --source-name canIN --target socketio --target-endpoint http://localhost:3000
```


## Commands

`can2x` supports the following commands.

### Bridge Start

The following command starts a can2x bridge.

```
can2x bridge start [options]
```

The following options are supported.

| Option              | Type                                                       | Default     | Required | Description | 
|---------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--source`          | `can`, `console`, `http`, `mqtt`, `socketio`, `ws`         | `can`       | false    |             |
| `--source-port`     | number                                                     | `3000`      | false    |             |
| `--source-host`     | string                                                     | `localhost` | false    |             |
| `--source-event`    | string                                                     | `can2x`     | false    |             |
| `--source-topic`    | string                                                     | `can2x`     | false    |             |
| `--source-name`     | string                                                     | `can2x`     | false    |             |
| `--source-id`       | number                                                     | none        | false    |             |
| `--source-data`     | number[]                                                   | none        | false    |             |
| `--target`          | `can`, `console`, `file`, `http`, `mqtt`, `socketio`, `ws` | `console`   | false    |             |
| `--target-endpoint` | string                                                     | none        | false    |             |
| `--target-event`    | string                                                     | `can2x`     | false    |             |
| `--target-topic`    | string                                                     | `can2x`     | false    |             |
| `--target-name`     | string                                                     | `can2x`     | false    |             |
| `--target-file`     | string                                                     | none        | false    |             |

### vCAN Start

The following command starts a vCAN using SocketCAN.

```
can2x vcan start [options]
```

The following options are supported.

| Option    | Type      | Default    | Required | Description            | 
|-----------|-----------|------------|----------|------------------------|
| `--name`  | string    | `can2x`    | false    | The name of the vCAN.  |

### vCAN Stop

The following command stops a vCAN using SocketCAN.

```
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
| `id`   | number   | The decimal id of the can message.      |
| `data` | number[] | The decimal payload of the can message. |

## Sources

`can2x` supports the following sources.

### CAN Bus

`can2x` supports a `can2x` bridge, i.e., `--source can`.
The following options are supported.

| Option              | Type                                                       | Default     | Required | Description | 
|---------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--source-name`     | string                                                     | `can2x`     | false    |             |

### Console

`can2x` supports a `console2x` bridge, i.e., `--source console`.
The following options are supported.

| Option              | Type                                                       | Default     | Required | Description | 
|---------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--source-id`       | number                                                     | none        | true     |             |
| `--source-data`     | number[]                                                   | none        | true     |             |


### HTTP

`can2x` supports a `http2x` bridge, i.e., `--source http`.
The following options are supported.

| Option              | Type                                                       | Default     | Required | Description | 
|---------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--source-port`     | number                                                     | `3000`      | false    |             |
| `--source-host`     | string                                                     | `localhost` | false    |             |

### MQTT

`can2x` supports a `mqtt2x` bridge, i.e., `--source mqtt`.
The following options are supported.

| Option              | Type                                                       | Default     | Required | Description | 
|---------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--source-port`     | number                                                     | `3000`      | false    |             |
| `--source-host`     | string                                                     | `localhost` | false    |             |
| `--source-topic`    | string                                                     | `can2x`     | false    |             |

### Socket.IO

`can2x` supports a `socketio2x` bridge, i.e., `--source socketio`.
The following options are supported.

| Option              | Type                                                       | Default     | Required | Description | 
|---------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--source-port`     | number                                                     | `3000`      | false    |             |
| `--source-host`     | string                                                     | `localhost` | false    |             |
| `--source-event`    | string                                                     | `can2x`     | false    |             |

### WebSocket

`can2x` supports a `ws2x` bridge, i.e., `--source ws`.
The following options are supported.

| Option              | Type                                                       | Default     | Required | Description | 
|---------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--source-port`     | number                                                     | `3000`      | false    |             |
| `--source-host`     | string                                                     | `localhost` | false    |             |

## Targets

`can2x` supports the following targets.

### CAN Bus

`can2x` supports a `x2can` bridge, i.e., `--target can`.
The following options are supported.

| Option          | Type                                                       | Default     | Required | Description | 
|-----------------|------------------------------------------------------------|-------------|----------|-------------|
| `--target-name` | string                                                     | `can2x`     | false    |             |

### Console

`can2x` supports a `x2console` bridge, i.e., `--target console`.
No options are supported.

### File

`can2x` supports a `x2file` bridge, i.e., `--target file`.
The following options are supported.

| Option              | Type                                                       | Default     | Required | Description | 
|---------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--target-file`     | string                                                     | none        | true     |             |

### HTTP

`can2x` supports a `x2http` bridge, i.e., `--target http`.
The following options are supported.

| Option              | Type                                                       | Default     | Required | Description | 
|---------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--target-endpoint` | string                                                     | none        | true     |             |

### MQTT

`can2x` supports a `x2mqtt` bridge, i.e., `--target mqtt`.
The following options are supported.

| Option              | Type                                                       | Default     | Required | Description | 
|---------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--target-endpoint` | string                                                     | none        | true     |             |
| `--target-topic`    | string                                                     | `can2x`     | false    |             |

### Socket.IO

`can2x` supports a `x2socketio` bridge, i.e., `--target socketio`.
The following options are supported.

| Option              | Type                                                       | Default     | Required | Description | 
|---------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--target-endpoint` | string                                                     | none        | true     |             |
| `--target-event`    | string                                                     | `can2x`     | false    |             |

### Websocket

`can2x` supports a `x2ws` bridge, i.e., `--target ws`.
The following options are supported.

| Option              | Type                                                       | Default     | Required | Description | 
|---------------------|------------------------------------------------------------|-------------|----------|-------------|
| `--target-endpoint` | string                                                     | none        | true     |             |

## Limitations

- `can2x` currently only supports `id` and `data` of a CAN message.
- bridges are unidirectional
- security aspects, such as encryption, authentication, and authorization, are not supported
- messages are not guaranteed to be delivered

## Similar Projects

It is worth to checkout the following projects.

- [`can2udp`](https://opensource.lely.com/canopen/docs/can2udp)
- [`can2mqtt`](https://github.com/c3re/can2mqtt)
- [`cannelloni`](https://github.com/mguentner/cannelloni)


## Dependencies

The licenses of our prod dependencies are as follows.

```
license-checker --production --summary --onlyAllow "MIT;Apache-2.0;Python-2.0;BSD-2-Clause;BSD-3-Clause;ISC;CC-BY-3.0;CC0-1.0;PSF;0BSD;BlueOak-1.0.0"
├─ MIT: 192
├─ ISC: 59
├─ Apache-2.0: 3
├─ BSD-2-Clause: 2
├─ BSD-3-Clause: 2
├─ BlueOak-1.0.0: 2
└─ Python-2.0: 1
```

## Acknowledgements

This project is s partially funded by the [German Federal Ministry for Economic Affairs and Climate Action (BMWK)](https://www.bmwk.de/Navigation/EN/Home/home.html) as part of the [Software-Defined Car (SofDCar)](https://sofdcar.de) project (19S21002).
