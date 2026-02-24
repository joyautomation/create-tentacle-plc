#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * create-tentacle-plc — Scaffold a new Tentacle PLC project.
 *
 * Usage:
 *   deno run -A jsr:@joyautomation/create-tentacle-plc [name] [--nats url]
 *
 * Options:
 *   name        Project directory name (prompted if omitted)
 *   --nats url  NATS server URL (default: nats://localhost:4222)
 */

import { denoJson, mainTs, envFile, gitignore } from "./templates.ts";

// ─── Parse args ──────────────────────────────────────────────────────────────

function parseArgs(args: string[]): { name?: string; nats?: string } {
  let name: string | undefined;
  let nats: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--nats" && i + 1 < args.length) {
      nats = args[++i];
    } else if (!args[i].startsWith("-") && !name) {
      name = args[i];
    }
  }

  return { name, nats };
}

// ─── Prompts ─────────────────────────────────────────────────────────────────

function ask(question: string, fallback: string): string {
  const answer = prompt(`${question} [${fallback}]`);
  return answer?.trim() || fallback;
}

// ─── Main ────────────────────────────────────────────────────────────────────

const parsed = parseArgs(Deno.args);

const projectName = parsed.name ?? ask("Project name", "my-plc");
const natsServers = parsed.nats ?? ask("NATS server URL", "nats://localhost:4222");

const projectDir = `${Deno.cwd()}/${projectName}`;

// Check if directory already exists
try {
  const stat = Deno.statSync(projectDir);
  if (stat.isDirectory) {
    console.error(`Error: Directory "${projectName}" already exists.`);
    Deno.exit(1);
  }
} catch {
  // Does not exist — good
}

// Create project directory and write files
Deno.mkdirSync(projectDir, { recursive: true });

const files: [string, string][] = [
  ["deno.json", denoJson(projectName)],
  ["main.ts", mainTs(projectName)],
  [".env", envFile(natsServers)],
  [".gitignore", gitignore()],
];

for (const [filename, content] of files) {
  Deno.writeTextFileSync(`${projectDir}/${filename}`, content);
}

console.log(`
  Tentacle PLC project created at ./${projectName}/

  Get started:
    cd ${projectName}
    deno task dev

  Send values via NATS:
    nats pub ${projectName}/temperature 25
    nats pub ${projectName}/isRunning true

  Add device sources (EtherNet/IP, OPC UA, Modbus):
    See main.ts comments for examples
`);
