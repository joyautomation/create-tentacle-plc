# create-tentacle-plc

Scaffold a new [Tentacle PLC](https://github.com/joyautomation/tentacle-plc) project.

## Usage

```bash
# Interactive
deno run -A jsr:@joyautomation/create-tentacle-plc

# With project name
deno run -A jsr:@joyautomation/create-tentacle-plc my-plc

# Non-interactive
deno run -A jsr:@joyautomation/create-tentacle-plc my-plc --nats nats://10.0.0.5:4222
```

Creates a project with:
- `main.ts` - PLC entry point with example variables and tasks
- `deno.json` - Imports `@joyautomation/tentacle-plc` from JSR
- `.env` - NATS server configuration
- `.gitignore`

## Documentation

See the [Tentacle Docs](https://github.com/joyautomation/tentacle-docs) for:
- [PLC Runtime Docs](https://github.com/joyautomation/tentacle-docs/blob/main/services/plc.md)
- [Getting Started](https://github.com/joyautomation/tentacle-docs/blob/main/getting-started.md)
- [Architecture Overview](https://github.com/joyautomation/tentacle-docs/blob/main/architecture.md)
