# bit-gateway
A gateway for talking to BIT protocol using the same URL structures as [Byte Browser](https://github.com/bytebrowser).

## Usage

```
npm i -g @web4/bit-gateway
```

```
bit-gateway run
```

Options: `bit-gateway --help run`

```
bit-gateway run

Run the gateway

Options:
  --version           Show version number                              [boolean]
  --help              Show help                                        [boolean]
  --writable          Control access to `PUT`         [boolean] [default: false]
  --port              The port to run the server on 4973       [default: 4973]
  --p2p-port          The port to run the p2p network on 4977  [default: 4977]
  --persist           Whether data should be persisted to disk
                                                       [boolean] [default: true]
  --storage-location  The location to store unichain data
                      [default: "/home/neo/.local/share/bit-gateway-nodejs"]
  --silent            Prevent additional logs         [boolean] [default: false]
```

## Routes

GET `http://localhost/4973/bit/:key/*path`

You can load data from the gateway by specifying a Bitdrive key and a path to a file or folder.

The specific HTTP verbs and headers that are supported can be found in [unichain-fetch](https://github.com/bitwebs/unichain-fetch).
Basically you can replace the `bit://` in a URL with `http://localhost:4973/bit/` and it'll work.

## Building native binaries

Bit-gateway uses the [pkg](https://github.com/vercel/pkg) module to compile the node.js code into a single binary that you can distribute on a server.

- `git clone git@github.com:bitwebs/bit-gateway.git`
- Install node.js if you haven't already
- `npm install`
- `npm run build`
- Look in the `dist` folder for the platform you want.
