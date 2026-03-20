import fs from "fs";
import { buildVinPatternRules } from "../src/utils/buildVinPatternRules.js";

const DATASET_PATH = "./src/data/vin_training_dataset.json";
const OUTPUT_PATH = "./src/data/vin_pattern_rules.json";

function loadJson(path, fallback = {}) {
  if (!fs.existsSync(path)) return fallback;
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function run() {
  const dataset = loadJson(DATASET_PATH, []);
  if (!Array.isArray(dataset)) {
    throw new Error(`Dataset not found or invalid: ${DATASET_PATH}`);
  }

  const patterns = buildVinPatternRules(dataset);
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(patterns, null, 2));

  const totalRules = Object.keys(patterns).length;
  const totalYearScopedRules = Object.values(patterns).reduce(
    (sum, rule) => sum + Object.keys(rule?.byModelYear || {}).length,
    0
  );

  console.log(`Generated ${totalRules} pattern buckets.`);
  console.log(`Generated ${totalYearScopedRules} year-scoped pattern sub-buckets.`);
  console.log(`Pattern rules written to ${OUTPUT_PATH}`);
}

run();
