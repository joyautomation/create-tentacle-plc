/**
 * Template file contents for scaffolded tentacle-plc projects.
 *
 * Each function returns the file content as a string, parameterized
 * by project name and configuration values.
 */

export function denoJson(projectName: string): string {
  return JSON.stringify(
    {
      tasks: {
        dev: "deno run --env-file=.env --allow-all --watch main.ts",
        start: "deno run --env-file=.env --allow-all main.ts",
      },
      imports: {
        "@tentacle/plc": "jsr:@joyautomation/tentacle-plc@^0.0.5",
      },
    },
    null,
    2,
  ) + "\n";
}

export function mainTs(projectName: string): string {
  return `/**
 * ${projectName} — Tentacle PLC project
 *
 * Define your variables, tasks, and control logic below.
 * Run with: deno task dev
 */

import {
  createPlc,
  createPlcLogger,
  type PlcVariableBooleanConfig,
  type PlcVariableNumberConfig,
  type PlcVariablesRuntime,
} from "@tentacle/plc";

// ─── To add device sources, import the helpers: ─────────────────────────────
// import { eipTag } from "@tentacle/plc";       // EtherNet/IP
// import { opcuaTag } from "@tentacle/plc";      // OPC UA
// import { modbusTag } from "@tentacle/plc";     // Modbus TCP
//
// Then add a \`source\` field to your variable config:
//   source: eipTag(device, "TagName"),
//   source: opcuaTag(device, "ns=2;s=NodeId"),
//   source: modbusTag(device, "register_name"),
//
// See: https://github.com/joyautomation/tentacle-plc

const log = createPlcLogger("${projectName}");

// =============================================================================
// Variables
// =============================================================================

const variables = {
  temperature: {
    id: "temperature",
    description: "Temperature sensor reading",
    datatype: "number",
    default: 20,
    deadband: {
      value: 0.5,
      maxTime: 60000,
    },
  } satisfies PlcVariableNumberConfig,

  isRunning: {
    id: "isRunning",
    description: "System running state",
    datatype: "boolean",
    default: false,
    source: { bidirectional: true },
  } satisfies PlcVariableBooleanConfig,
};

type Variables = typeof variables;
type VariablesRuntime = PlcVariablesRuntime<Variables>;

// =============================================================================
// Tasks
// =============================================================================

const tasks = {
  logger: {
    name: "Logger",
    description: "Log variable values periodically",
    scanRate: 5000,
    program: (vars: VariablesRuntime) => {
      log.info(
        \`Temperature: \${vars.temperature.value}°C | Running: \${vars.isRunning.value}\`,
      );
    },
  },
};

// =============================================================================
// Run
// =============================================================================

const plc = await createPlc({
  projectId: "${projectName}",
  variables,
  tasks,
  nats: {
    servers: Deno.env.get("NATS_SERVERS") || "nats://localhost:4222",
  },
});

Deno.addSignalListener("SIGINT", async () => {
  log.info("Shutting down...");
  await plc.stop();
  Deno.exit(0);
});

log.info("PLC running. Press Ctrl+C to stop.");
log.info("Send values via NATS:");
log.info(\`  nats pub ${projectName}/temperature 25\`);
log.info(\`  nats pub ${projectName}/isRunning true\`);
`;
}

export function envFile(natsServers: string): string {
  return `NATS_SERVERS=${natsServers}\n`;
}

export function gitignore(): string {
  return `.env
*.log
`;
}
