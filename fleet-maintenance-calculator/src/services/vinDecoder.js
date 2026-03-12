export function decodeSkodaVin(vin) {
  const cleaned = vin.trim().toUpperCase().replace(/\s+/g, "");

  const years = {
    L: 2020,
    M: 2021,
    N: 2022,
    P: 2023,
    R: 2024,
    S: 2025,
    T: 2026,
  };

  if (cleaned.length !== 17) {
    return {
      supported: false,
      reason: "VIN mora imati 17 karaktera.",
    };
  }

  if (!cleaned.startsWith("TMB")) {
    return {
      supported: false,
      reason: "Za sada je podržana samo Škoda (TMB).",
    };
  }

  const prefix8 = cleaned.slice(0, 8);
  const modelCode = cleaned.slice(6, 8);
  const yearCode = cleaned[9];
  const modelYear = years[yearCode] || "Nepoznato";

  const exactRules = {
    TMBAJ8N7: {
      marka: "Škoda",
      model: "Octavia IV",
      generation: "IV",
      motorKod: "DXRB",
      motor: "2.0 TDI 110 kW",
      fuelType: "Diesel",
      menjac: "DSG7",
      gearboxCode: "DQ381",
      drivetrain: "FWD",
      oilSpec: "VW 507 00",
      oilSae: "0W-30",
      oilCapacity: 5.1,
      hourlyRate: 5500,
      confidence: "high",
      matchType: "exact",
      serviceProfile: "octavia_diesel_dsg",
      candidates: [],
    },
    TMBAJ8NT: {
      marka: "Škoda",
      model: "Octavia IV",
      generation: "IV",
      motorKod: "DADA",
      motor: "1.5 TSI 110 kW",
      fuelType: "Petrol",
      menjac: "DSG7",
      gearboxCode: "DQ381",
      drivetrain: "FWD",
      oilSpec: "VW 508 00",
      oilSae: "0W-20",
      oilCapacity: 4.3,
      hourlyRate: 5500,
      confidence: "high",
      matchType: "exact",
      serviceProfile: "octavia_petrol_dsg",
      candidates: [],
    },
    TMBCR7NP: {
      marka: "Škoda",
      model: "Superb",
      generation: "IV",
      motorKod: "DTUA",
      motor: "2.0 TDI 147 kW",
      fuelType: "Diesel",
      menjac: "DSG7",
      gearboxCode: "DQ381",
      drivetrain: "FWD",
      oilSpec: "VW 507 00",
      oilSae: "0W-30",
      oilCapacity: 5.5,
      hourlyRate: 6800,
      confidence: "high",
      matchType: "exact",
      serviceProfile: "superb_diesel_dsg",
      candidates: [],
    },
    TMBLN7NS: {
      marka: "Škoda",
      model: "Kodiaq",
      generation: "II",
      motorKod: "DTTC",
      motor: "2.0 TDI 147 kW",
      fuelType: "Diesel",
      menjac: "DSG7 4x4",
      gearboxCode: "DQ381 AWD",
      drivetrain: "AWD",
      oilSpec: "VW 507 00",
      oilSae: "0W-30",
      oilCapacity: 5.7,
      hourlyRate: 6800,
      confidence: "high",
      matchType: "exact",
      serviceProfile: "kodiaq_diesel_dsg",
      candidates: [],
    },
  };

  if (exactRules[prefix8]) {
    return {
      supported: true,
      ...exactRules[prefix8],
      modelYear,
      vin: cleaned,
    };
  }

  const candidateRules = {
    NX: {
      marka: "Škoda",
      model: "Octavia IV",
      generation: "IV",
      hourlyRate: 5500,
      candidates: [
        "2.0 TDI 110 kW / DSG7 / FWD",
        "2.0 TDI 110 kW / Manual / FWD",
        "1.5 TSI 110 kW / DSG7 / FWD",
        "1.5 TSI 110 kW / Manual / FWD",
      ],
      fallbackProfile: {
        motorKod: "DXRB",
        motor: "2.0 TDI 110 kW",
        fuelType: "Diesel",
        menjac: "DSG7",
        gearboxCode: "DQ381",
        drivetrain: "FWD",
        oilSpec: "VW 507 00",
        oilSae: "0W-30",
        oilCapacity: 5.1,
        serviceProfile: "octavia_diesel_dsg",
      },
    },
    NP: {
      marka: "Škoda",
      model: "Superb",
      generation: "IV",
      hourlyRate: 6800,
      candidates: [
        "2.0 TDI 147 kW / DSG7 / FWD",
        "2.0 TDI 147 kW / Manual / FWD",
        "2.0 TSI 140 kW / DSG7 / FWD",
      ],
      fallbackProfile: {
        motorKod: "DTUA",
        motor: "2.0 TDI 147 kW",
        fuelType: "Diesel",
        menjac: "DSG7",
        gearboxCode: "DQ381",
        drivetrain: "FWD",
        oilSpec: "VW 507 00",
        oilSae: "0W-30",
        oilCapacity: 5.5,
        serviceProfile: "superb_diesel_dsg",
      },
    },
    NS: {
      marka: "Škoda",
      model: "Kodiaq",
      generation: "II",
      hourlyRate: 6800,
      candidates: [
        "2.0 TDI 147 kW / DSG7 / AWD",
        "2.0 TDI 147 kW / Manual / AWD",
        "2.0 TSI 140 kW / DSG7 / FWD",
      ],
      fallbackProfile: {
        motorKod: "DTTC",
        motor: "2.0 TDI 147 kW",
        fuelType: "Diesel",
        menjac: "DSG7 4x4",
        gearboxCode: "DQ381 AWD",
        drivetrain: "AWD",
        oilSpec: "VW 507 00",
        oilSae: "0W-30",
        oilCapacity: 5.7,
        serviceProfile: "kodiaq_diesel_dsg",
      },
    },
    NU: {
      marka: "Škoda",
      model: "Karoq",
      generation: "I",
      hourlyRate: 5500,
      candidates: [
        "2.0 TDI 110 kW / DSG7 / FWD",
        "2.0 TDI 110 kW / Manual / FWD",
        "1.5 TSI 110 kW / DSG7 / FWD",
      ],
      fallbackProfile: {
        motorKod: "DTRD",
        motor: "2.0 TDI 110 kW",
        fuelType: "Diesel",
        menjac: "DSG7",
        gearboxCode: "DQ381",
        drivetrain: "FWD",
        oilSpec: "VW 507 00",
        oilSae: "0W-30",
        oilCapacity: 5.0,
        serviceProfile: "karoq_diesel_dsg",
      },
    },
    NW: {
      marka: "Škoda",
      model: "Scala / Kamiq",
      generation: "I",
      hourlyRate: 5200,
      candidates: [
        "1.0 TSI / Manual / FWD",
        "1.0 TSI / DSG7 / FWD",
      ],
      fallbackProfile: {
        motorKod: "DKRF",
        motor: "1.0 TSI 81 kW",
        fuelType: "Petrol",
        menjac: "DSG7",
        gearboxCode: "DQ200",
        drivetrain: "FWD",
        oilSpec: "VW 508 00",
        oilSae: "0W-20",
        oilCapacity: 4.0,
        serviceProfile: "scala_kamiq_petrol",
      },
    },
    PJ: {
      marka: "Škoda",
      model: "Fabia",
      generation: "IV",
      hourlyRate: 5200,
      candidates: ["1.0 MPI / Manual / FWD"],
      fallbackProfile: {
        motorKod: "DLAA",
        motor: "1.0 MPI",
        fuelType: "Petrol",
        menjac: "Manual",
        gearboxCode: "MQ200",
        drivetrain: "FWD",
        oilSpec: "VW 508 00",
        oilSae: "0W-20",
        oilCapacity: 3.6,
        serviceProfile: "fabia_petrol",
      },
    },
  };

  if (candidateRules[modelCode]) {
    const rule = candidateRules[modelCode];

    return {
      supported: true,
      vin: cleaned,
      marka: rule.marka,
      model: rule.model,
      generation: rule.generation,
      modelYear,
      ...rule.fallbackProfile,
      hourlyRate: rule.hourlyRate,
      confidence: rule.candidates.length === 1 ? "high" : "medium",
      matchType: rule.candidates.length === 1 ? "exact" : "candidate",
      candidates: rule.candidates,
    };
  }

  return {
    supported: true,
    vin: cleaned,
    marka: "Škoda",
    model: "Nepoznat model",
    generation: "-",
    motorKod: "-",
    motor: "Nepoznat motor",
    fuelType: "-",
    menjac: "-",
    gearboxCode: "-",
    drivetrain: "-",
    oilSpec: "-",
    oilSae: "-",
    oilCapacity: 0,
    hourlyRate: 5500,
    confidence: "low",
    matchType: "fallback",
    modelYear,
    serviceProfile: "generic",
    candidates: [],
  };
}