import fs from "fs";
import path from "path";
import engineCodesMaster from "../data/engine_codes_master.json" with { type: 'json' };

const vinTrainingDatasetPath = path.resolve("src/data/vin_training_dataset.json");
const vinTrainingDataset = JSON.parse(fs.readFileSync(vinTrainingDatasetPath, "utf-8"));

function unique(items) {
  return [...new Set((items || []).filter((x) => x !== null && x !== undefined && x !== ""))];
}

function getBodyCodeFromVin(vin) {
  if (!vin || vin.length < 6) return null;
  return vin.slice(3, 6).toUpperCase();
}

function getPlatformCodeFromVin(vin) {
  if (!vin || vin.length < 8) return null;
  return vin.slice(6, 8).toUpperCase();
}

function makeRuleAccumulator(bodyCode, platformCode, modelYear = null) {
  return {
    bodyCode,
    platformCode,
    sampleCount: 0,
    models: [],
    modelYears: modelYear != null ? [modelYear] : [],
    engineCodes: [],
    gearboxCodes: [],
    drivetrains: [],
    fuelTypes: [],
    fuels: [],
    engineFamilies: [],
  };
}

function pushRow(rule, item) {
  if (!rule || !item) return;
  rule.sampleCount += 1;
  rule.models.push(item?.model || null);
  rule.modelYears.push(item?.modelYear || null);
  rule.engineCodes.push(item?.engineCode || null);
  rule.gearboxCodes.push(item?.transmissionCode || null);
  rule.drivetrains.push(item?.drivetrain || null);
  const fuel = item?.fuel || item?.fuelType || null;
  rule.fuelTypes.push(fuel);
  rule.fuels.push(fuel);
  const family = item?.engineFamily || engineCodesMaster?.[item?.engineCode || ""]?.family || null;
  rule.engineFamilies.push(family);
}

function finalizeRule(rule) {
  return {
    bodyCode: rule.bodyCode,
    platformCode: rule.platformCode,
    sampleCount: rule.sampleCount,
    models: unique(rule.models).sort(),
    modelYears: unique(rule.modelYears).sort((a, b) => Number(a || 0) - Number(b || 0)),
    engineCodes: unique(rule.engineCodes).sort(),
    gearboxCodes: unique(rule.gearboxCodes).sort(),
    drivetrains: unique(rule.drivetrains).sort(),
    fuelTypes: unique(rule.fuelTypes).sort(),
    fuels: unique(rule.fuels).sort(),
    engineFamilies: unique(rule.engineFamilies).sort(),
  };
}

export function buildVinPatternRules(dataset) {
  const rules = {};

  for (const item of dataset) {
    const vin = item?.vin || "";
    const bodyCode = getBodyCodeFromVin(vin);
    const platformCode = (item?.modelCode || getPlatformCodeFromVin(vin) || "").toUpperCase();
    const modelYear = item?.modelYear != null ? Number(item.modelYear) : null;

    if (!bodyCode || !platformCode) continue;

    const key = `${bodyCode}|${platformCode}`;

    if (!rules[key]) {
      rules[key] = makeRuleAccumulator(bodyCode, platformCode);
      rules[key].byModelYear = {};
    }

    pushRow(rules[key], item);

    if (modelYear != null) {
      if (!rules[key].byModelYear[String(modelYear)]) {
        rules[key].byModelYear[String(modelYear)] = makeRuleAccumulator(bodyCode, platformCode, modelYear);
      }
      pushRow(rules[key].byModelYear[String(modelYear)], item);
    }
  }

  const finalized = {};
  for (const key of Object.keys(rules).sort()) {
    const rule = rules[key];
    finalized[key] = finalizeRule(rule);
    const byModelYear = {};
    for (const year of Object.keys(rule.byModelYear || {}).sort()) {
      byModelYear[year] = finalizeRule(rule.byModelYear[year]);
    }
    finalized[key].byModelYear = byModelYear;
  }

  return finalized;
}

const rules = buildVinPatternRules(vinTrainingDataset);
const outputPath = path.resolve("src/data/vin_pattern_rules.json");
fs.writeFileSync(outputPath, JSON.stringify(rules, null, 2), "utf-8");

console.log(`vin_pattern_rules.json generated: ${outputPath}`);
console.log(`Total pattern rules: ${Object.keys(rules).length}`);
