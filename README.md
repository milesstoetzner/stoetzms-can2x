# can2x

`can2x` is a simple utility for connecting a can bus unidirectional with another can bus over the network using common web protocols, such as HTTP, MQTT, Socket.IO, and WebSockets.
This project is a research prototype and should not be used in production.

```
Usage: can2x [options] [command]

can2x is a simple utility for connecting a can bus unidirectional with another can bus over the network using common web protocols, such as HTTP, MQTT, Socket.IO, and WebSockets.

Options:
  -h, --help      display help for command

Commands:
  bridge          manages a can2x bridge
  vcan            manages a vcan
  help [command]  display help for command
```

```
Usage: can2x bridge [options] [command]

manages a can2x bridge

Options:
  -h, --help       display help for command

Commands:
  start [options]  starts a can2x bridge
  help [command]   display help for command
```