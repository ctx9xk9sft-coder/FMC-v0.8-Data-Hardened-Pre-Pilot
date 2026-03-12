import { useMemo, useState } from "react";
import InfoCard from "./components/InfoCard"
import StatCard from "./components/StatCard"
import { decodeSkodaVin } from "./services/vinDecoder";

import { VEHICLE_PROFILES } from "./data/vehicleProfiles";
import { SAMPLE_VINS } from "./data/sampleVins";
import { EXPLOITATION_PROFILES } from "./data/exploitationProfiles";

import { formatRsd, formatNum } from "./utils/formatters";
import { calculateScenarioRows, calculateSummary } from "./services/tcoCalculator";
import InputPanel from "./components/InputPanel";



export default function App() {
  const [sessionUser] = useState({
    displayName: "Admin demo",
    company: "Ćirinac",
  });

  const [selectedProfileId, setSelectedProfileId] = useState("octavia_diesel_dsg");
  const [vin, setVin] = useState(SAMPLE_VINS.octavia_diesel_dsg);
  const [plannedKm, setPlannedKm] = useState(200000);
  const [contractMonths, setContractMonths] = useState(48);
  const [exploitationType, setExploitationType] = useState("fleet_standard");
  const [hourlyRate, setHourlyRate] = useState(5500);
  const [flexInterval, setFlexInterval] = useState(25000);
  const [laborDiscount, setLaborDiscount] = useState(0);
  const [partsDiscount, setPartsDiscount] = useState(0);
  const [oilDiscount, setOilDiscount] = useState(0);

  const decoded = useMemo(() => decodeSkodaVin(vin), [vin]);
  const exploitation = EXPLOITATION_PROFILES[exploitationType];

  const scenarioRows = useMemo(
  () =>
    calculateScenarioRows({
      decoded,
      exploitation,
      plannedKm,
      contractMonths,
      flexInterval,
      laborDiscount,
      partsDiscount,
      oilDiscount,
    }),
  [
    decoded,
    exploitation,
    plannedKm,
    contractMonths,
    flexInterval,
    laborDiscount,
    partsDiscount,
    oilDiscount,
  ]
);

const { totalSale, costPerKm, costPerMonth, totalService, totalBrakes } =
  calculateSummary({
    scenarioRows,
    plannedKm,
    contractMonths,
  });
  const annualKm = contractMonths ? (plannedKm / contractMonths) * 12 : 0;

  const loadProfile = (profileId) => {
    setSelectedProfileId(profileId);
    setVin(SAMPLE_VINS[profileId]);
    setHourlyRate(VEHICLE_PROFILES[profileId]?.hourlyRate || 5500);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.hero}>
          <div>
            <div style={styles.heroBadge}>Demo licensed environment</div>
            <h1 style={styles.heroTitle}>Fleet Maintenance &amp; TCO Calculator</h1>
            <div style={styles.heroSubtitle}>
              Škoda-only kalkulator za leasing, rent-a-car i fleet operacije.
            </div>
          </div>

          <div style={styles.heroMetaWrap}>
            <div style={styles.heroMetaCard}>
              <div style={styles.heroMetaLabel}>KORISNIK</div>
              <div style={styles.heroMetaValue}>{sessionUser.displayName}</div>
            </div>
            <div style={styles.heroMetaCard}>
              <div style={styles.heroMetaLabel}>KOMPANIJA</div>
              <div style={styles.heroMetaValue}>{sessionUser.company}</div>
            </div>
            <button style={styles.logoutBtn}>Logout</button>
          </div>
        </div>

        <div style={styles.mainGrid}>

<InputPanel
  selectedProfileId={selectedProfileId}
  loadProfile={loadProfile}
  vin={vin}
  setVin={setVin}
  plannedKm={plannedKm}
  setPlannedKm={setPlannedKm}
  contractMonths={contractMonths}
  setContractMonths={setContractMonths}
  exploitationType={exploitationType}
  setExploitationType={setExploitationType}
  hourlyRate={hourlyRate}
  setHourlyRate={setHourlyRate}
  flexInterval={flexInterval}
  setFlexInterval={setFlexInterval}
  laborDiscount={laborDiscount}
  setLaborDiscount={setLaborDiscount}
  partsDiscount={partsDiscount}
  setPartsDiscount={setPartsDiscount}
  oilDiscount={oilDiscount}
  setOilDiscount={setOilDiscount}
  exploitation={exploitation}
  decoded={decoded}
  annualKm={annualKm}
  formatRsd={formatRsd}
  formatNum={formatNum}
  EXPLOITATION_PROFILES={EXPLOITATION_PROFILES}
/>


          <div>
            <div style={styles.contentCard}>
              <div style={styles.contentHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>Vozilo i tehnički profil</h2>
                  <div style={styles.muted}>
                    Dekodirani podaci, engine/fluid logika, menjač i aktivna varijanta.
                  </div>
                </div>

                <div style={styles.headerBadgeWrap}>
                  <span style={styles.darkBadge}>
                    VIN {decoded.supported ? "prepoznat" : "nije podržan"} ({decoded.confidence || "-"})
                  </span>
                  <span style={styles.lightBadge}>{sessionUser.company}</span>
                </div>
              </div>

              {!decoded.supported ? (
                <div style={{ color: "#b91c1c", fontWeight: 700, marginTop: 12 }}>{decoded.reason}</div>
              ) : (
                <>
                  <div style={styles.infoGrid}>
                    <InfoCard label="Marka / model" value={`${decoded.marka} ${decoded.model}`} />
                    <InfoCard label="Motor" value={`${decoded.motorKod} / ${decoded.motor}`} />
                    <InfoCard label="Menjač / godina" value={`${decoded.menjac} / ${decoded.modelYear}`} />
                    <InfoCard label="Kategorija satnice" value={formatRsd(decoded.hourlyRate || hourlyRate)} />
                    <InfoCard label="Engine DB status" value="Povezan" />
                    <InfoCard label="Pogon bregaste" value="Zupčasti remen" />
                    <InfoCard label="DPF / SCR" value={decoded.fuelType === "Diesel" ? "DPF / SCR" : "GPF / -"} />
                    <InfoCard
                      label="Svećice / filter goriva"
                      value={decoded.fuelType === "Diesel" ? "0 / da" : "4 / ne"}
                    />
                    <InfoCard label="Fluid DB status" value="Povezan" />
                    <InfoCard label="Količina motornog ulja" value={`${decoded.oilCapacity} L`} />
                    <InfoCard label="VW norma ulja" value={decoded.oilSpec} />
                    <InfoCard label="SAE" value={decoded.oilSae} />
                    <InfoCard
                      label="Varijanta"
                      value={`${decoded.motor} / ${decoded.menjac} / ${decoded.drivetrain}`}
                    />
                    <InfoCard label="Tip menjača" value={decoded.menjac} />
                    <InfoCard label="Kod menjača" value={decoded.gearboxCode} />
                    <InfoCard label="Ulje menjača" value={decoded.menjac.includes("DSG") ? "6 L" : "N/A"} />
                  </div>

                  {decoded.candidates && decoded.candidates.length > 0 ? (
                    <div style={styles.contentCardInner}>
                      <div style={styles.candidateTitle}>Moguće varijante vozila</div>
                      <div style={styles.candidateList}>
                        {decoded.candidates.map((candidate) => (
                          <div key={candidate} style={styles.candidateItem}>
                            {candidate}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>

            <div style={styles.statsGrid}>
              <StatCard title="Ukupno održavanje" value={formatRsd(totalSale)} />
              <StatCard title="Servisi" value={formatRsd(totalService)} />
              <StatCard title="Kočnice" value={formatRsd(totalBrakes)} />
              <StatCard title="Trošak po km" value={formatRsd(costPerKm)} />
              <StatCard title="Trošak po mesecu" value={formatRsd(costPerMonth)} />
              <StatCard title="Ukupni događaji" value="11" />
            </div>

            <div style={styles.contentCard}>
              <h2 style={styles.sectionTitle}>TCO scenario analysis</h2>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Scenario</th>
                      <th style={styles.thRight}>Flex interval</th>
                      <th style={styles.thRight}>Brake faktor</th>
                      <th style={styles.thRight}>Ukupno</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarioRows.map((row) => (
                      <tr key={row.label}>
                        <td style={styles.td}>{row.label}</td>
                        <td style={styles.tdRight}>{formatNum(row.flex, 0)} km</td>
                        <td style={styles.tdRight}>{row.brakeFactor}</td>
                        <td style={styles.tdRight}>{formatRsd(row.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #f1f5f9, #ffffff, #f1f5f9)",
    padding: 24,
    color: "#0f172a",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: 1500,
    margin: "0 auto",
  },
  hero: {
    background: "#020617",
    color: "#fff",
    borderRadius: 28,
    padding: 28,
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "center",
    marginBottom: 24,
    boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
  },
  heroBadge: {
    fontSize: 14,
    color: "#cbd5e1",
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 48,
    margin: 0,
    lineHeight: 1.05,
  },
  heroSubtitle: {
    marginTop: 12,
    color: "#cbd5e1",
    fontSize: 18,
  },
  heroMetaWrap: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(160px, 1fr))",
    gap: 12,
    minWidth: 520,
  },
  heroMetaCard: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    padding: 18,
    borderRadius: 20,
  },
  heroMetaLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 8,
  },
  heroMetaValue: {
    fontSize: 18,
    fontWeight: 700,
  },
  logoutBtn: {
    background: "#fff",
    color: "#0f172a",
    border: "none",
    borderRadius: 20,
    padding: "18px 20px",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "460px 1fr",
    gap: 24,
    alignItems: "start",
  },
  sidebarCard: {
    background: "#fff",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 1px 10px rgba(0,0,0,0.08)",
  },
  contentCard: {
    background: "#fff",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 1px 10px rgba(0,0,0,0.08)",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    margin: "0 0 16px",
  },
  muted: {
    color: "#64748b",
    fontSize: 16,
  },
  label: {
    display: "block",
    marginBottom: 8,
    marginTop: 12,
    fontWeight: 700,
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid #cbd5e1",
    fontSize: 18,
    outline: "none",
    marginBottom: 2,
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  threeCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
  },
  buttonRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 16,
  },
  secondaryBtn: {
    border: "1px solid #cbd5e1",
    background: "#fff",
    color: "#0f172a",
    padding: "12px 14px",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 700,
  },
  helperBox: {
    marginTop: 20,
    paddingTop: 16,
    borderTop: "1px solid #e2e8f0",
    display: "grid",
    gap: 8,
    color: "#334155",
    fontSize: 16,
  },
  contentHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "start",
    marginBottom: 18,
  },
  headerBadgeWrap: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  darkBadge: {
    background: "#0f172a",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 999,
    fontWeight: 700,
    fontSize: 14,
  },
  lightBadge: {
    border: "1px solid #cbd5e1",
    padding: "8px 12px",
    borderRadius: 12,
    fontSize: 14,
    color: "#334155",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
    gap: 14,
  },
  infoCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 18,
    background: "#fff",
  },
  infoLabel: {
    color: "#64748b",
    fontSize: 15,
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.3,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: 14,
    marginBottom: 20,
  },
  statCard: {
    background: "#fff",
    borderRadius: 22,
    padding: 20,
    boxShadow: "0 1px 10px rgba(0,0,0,0.08)",
  },
  statLabel: {
    color: "#64748b",
    fontSize: 15,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 800,
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px 10px",
    borderBottom: "1px solid #e2e8f0",
    color: "#64748b",
    fontSize: 14,
  },
  thRight: {
    textAlign: "right",
    padding: "12px 10px",
    borderBottom: "1px solid #e2e8f0",
    color: "#64748b",
    fontSize: 14,
  },
  td: {
    padding: "14px 10px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: 16,
  },
  tdRight: {
    padding: "14px 10px",
    borderBottom: "1px solid #f1f5f9",
    textAlign: "right",
    fontSize: 16,
  },
  contentCardInner: {
    marginTop: 18,
    paddingTop: 18,
    borderTop: "1px solid #e2e8f0",
  },
  candidateTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 12,
  },
  candidateList: {
    display: "grid",
    gap: 10,
  },
  candidateItem: {
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 14,
    background: "#f8fafc",
    fontSize: 16,
  },
};