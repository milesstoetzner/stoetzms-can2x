# can2x

> This project is a research prototype and should not be used in production.

`can2x` is a simple utility for connecting a CAN bus unidirectional with another CAN bus over the network using common web protocols, such as HTTP, MQTT, Socket.IO, and WebSockets.

## Overview

`can2x` supports various sources and targets for CAN messages. 
A source, such as a CAN bus, forwards the CAN message to the target, such as a Socket.IO server running on a second computing environment.
This target then acts as a source and forwards the CAN message to another target, such as a CAN bus connected to the second computing environment.
It is also possible to have a arbitrary long chain of different of such bridges.

## Example

The following command starts a socketio2can bridge.

```
can2x bridge start --source socketio --target can --target-name canOUT
```

The following command starts a can2socketio bridge.

```
can2x bridge start --source can --source-name canIN --target socketio --target-endpoint http://localhost:3000
```

## Requirements

`can2x` has the following requirements.

- Linux
- SocketCAN, thus, Git Bash and WSL are NOT supported


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

## Sources

`can2x` supports the following sources.

### CAN Bus

> TODO: describe

### Console

> TODO: describe

### HTTP

> TODO: describe

### MQTT

> TODO: describe

### Socket.IO

> TODO: describe

### WebSocket

> TODO: describe

## Targets

`can2x` supports the following targets.

### CAN Bus

> TODO: describe

### Console

> TODO: describe

### File

> TODO: describe

### HTTP

> TODO: describe

### MQTT

> TODO: describe

### Socket.IO

> TODO: describe

### Websocket

> TODO: describe

## Limitations

- `can2x` currently only supports `id` and `data` of a CAN message.
- bridges are unidirectional

## Similar Projects

It is worth to checkout the following projects.

- [`can2udp`](https://opensource.lely.com/canopen/docs/can2udp)
- [`can2mqtt`](https://github.com/c3re/can2mqtt)
- [`cannelloni`](https://github.com/mguentner/cannelloni)

## Acknowledgements

This project is s partially funded by the [German Federal Ministry for Economic Affairs and Climate Action (BMWK)](https://www.bmwk.de/Navigation/EN/Home/home.html) as part of the [Software-Defined Car (SofDCar)](https://sofdcar.de) project (19S21002).