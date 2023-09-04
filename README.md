# can2x

> This project is a research prototype and should not be used in production.

`can2x` is a simple utility for connecting a CAN bus unidirectional with another CAN bus over the network using common web protocols, such as HTTP, MQTT, Socket.IO, and WebSockets.

## Overview

We support various sources and targets for CAN messages. 
A source, such as a CAN bus, forwards the CAN message to the target, such as a Socket.IO server running on a second computing environment.
This target then acts as a source and forwards the CAN message to another target, such as a CAN bus connected to the second computing environment.
It is also possible to have a arbitrary long chain of different of such bridges.

## Example

The following commands starts a socketio2can bridge.

```
can2x bridge start --source socketio --target can --target-name canOUT
```

The following commands starts a can2socketio bridge.

```
can2x bridge start --source can --source-name canIN --target socketio --target-endpoint http://localhost:3000
```

## Requirements

We have the following requirements.

- Linux
- SocketCAN, thus, Git Bash and WSL are NOT supported


## Commands

We support the following commands.

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
| `--source-id`       | string                                                     | none        | false    |             |
| `--source-data`     | string[]                                                   | none        | false    |             |
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

We support the following sources.

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

We support the following targets.

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
