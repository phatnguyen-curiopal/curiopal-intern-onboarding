const fs = require("node:fs/promises");
const path = require("node:path");

const outputFolder = path.resolve(process.env.LOG_FOLDER || "./logs");

const errorMessages = [
  "Database connection failed",
  "User not found",
  "Request timeout",
  "Invalid authentication token",
  "Payment processing failed",
];

const infoMessages = [
  "Server started",
  "Request completed",
  "User logged in",
  "Cache refreshed",
  "Background job completed",
];

const warningMessages = [
  "Request is taking too long",
  "Memory usage is high",
  "Retrying external request",
];

function getRandomItem(items) {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

function getRandomLevel() {
  const value = Math.random();

  if (value < 0.3) {
    return "ERROR";
  }

  if (value < 0.5) {
    return "WARN";
  }

  return "INFO";
}

function getMessage(level) {
  if (level === "ERROR") {
    return getRandomItem(errorMessages);
  }

  if (level === "WARN") {
    return getRandomItem(warningMessages);
  }

  return getRandomItem(infoMessages);
}

function generateLogLine() {
  const now = new Date();

  const randomMinutesAgo = Math.floor(Math.random() * 24 * 60);
  now.setMinutes(now.getMinutes() - randomMinutesAgo);

  const level = getRandomLevel();
  const message = getMessage(level);

  return `${now.toISOString()} ${level} ${message}`;
}

function generateLogFile(lineCount) {
  const lines = [];

  for (let index = 0; index < lineCount; index += 1) {
    lines.push(generateLogLine());
  }

  lines.sort();

  return `${lines.join("\n")}\n`;
}

async function main() {
  try {
    await fs.mkdir(outputFolder, { recursive: true });

    const files = [
      {
        name: "app.log",
        lines: 100,
      },
      {
        name: "worker.log",
        lines: 80,
      },
      {
        name: "payment.log",
        lines: 60,
      },
    ];

    for (const file of files) {
      const filePath = path.join(outputFolder, file.name);
      const content = generateLogFile(file.lines);

      await fs.writeFile(filePath, content, "utf8");

      console.log(`Generated: ${filePath}`);
    }

    console.log("Fake logs generated successfully.");
    process.exitCode = 0;
  } catch (error) {
    console.error(`Failed to generate logs: ${error.message}`);
    process.exitCode = 1;
  }
}

main();