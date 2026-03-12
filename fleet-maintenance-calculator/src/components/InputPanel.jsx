export default function InputPanel({
  selectedProfileId,
  loadProfile,
  vin,
  setVin,
  plannedKm,
  setPlannedKm,
  contractMonths,
  setContractMonths,
  exploitationType,
  setExploitationType,
  hourlyRate,
  setHourlyRate,
  flexInterval,
  setFlexInterval,
  laborDiscount,
  setLaborDiscount,
  partsDiscount,
  setPartsDiscount,
  oilDiscount,
  setOilDiscount,
  exploitation,
  decoded,
  annualKm,
  formatRsd,
  formatNum,
  EXPLOITATION_PROFILES,
}) {
  return (
    <div style={styles.sidebarCard}>
      <h2 style={styles.sectionTitle}>Fleet TCO Calculator</h2>

      <label style={styles.label}>Način izbora vozila</label>
      <select style={styles.input}>
        <option>VIN dekoder</option>
      </select>

      <label style={styles.label}>Test profil</label>
      <select
        style={styles.input}
        value={selectedProfileId}
        onChange={(e) => loadProfile(e.target.value)}
      >
        <option value="octavia_diesel_dsg">Octavia 2.0 TDI DSG</option>
        <option value="octavia_petrol_dsg">Octavia 1.5 TSI DSG</option>
        <option value="superb_diesel_dsg">Superb 2.0 TDI DSG</option>
        <option value="kodiaq_diesel_dsg">Kodiaq 2.0 TDI DSG 4x4</option>
      </select>

      <label style={styles.label}>VIN</label>
      <input style={styles.input} value={vin} onChange={(e) => setVin(e.target.value)} />

      <div style={styles.twoCol}>
        <div>
          <label style={styles.label}>Planirana kilometraža</label>
          <input
            style={styles.input}
            type="number"
            value={plannedKm}
            onChange={(e) => setPlannedKm(Number(e.target.value) || 0)}
          />
        </div>
        <div>
          <label style={styles.label}>Trajanje ugovora</label>
          <input
            style={styles.input}
            type="number"
            value={contractMonths}
            onChange={(e) => setContractMonths(Number(e.target.value) || 0)}
          />
        </div>
      </div>

      <label style={styles.label}>Tip eksploatacije</label>
      <select
        style={styles.input}
        value={exploitationType}
        onChange={(e) => setExploitationType(e.target.value)}
      >
        {Object.entries(EXPLOITATION_PROFILES).map(([key, item]) => (
          <option key={key} value={key}>
            {item.label}
          </option>
        ))}
      </select>

      <div style={styles.twoCol}>
        <div>
          <label style={styles.label}>Cena radnog sata (RSD)</label>
          <input
            style={styles.input}
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value) || 0)}
          />
        </div>
        <div>
          <label style={styles.label}>Fleksibilni servisni interval</label>
          <select
            style={styles.input}
            value={flexInterval}
            onChange={(e) => setFlexInterval(Number(e.target.value))}
          >
            <option value={15000}>15.000 km</option>
            <option value={20000}>20.000 km</option>
            <option value={25000}>25.000 km</option>
            <option value={30000}>30.000 km</option>
          </select>
        </div>
      </div>

      <div style={styles.threeCol}>
        <div>
          <label style={styles.label}>Rabat rad %</label>
          <input
            style={styles.input}
            type="number"
            value={laborDiscount}
            onChange={(e) => setLaborDiscount(Number(e.target.value) || 0)}
          />
        </div>
        <div>
          <label style={styles.label}>Rabat delovi %</label>
          <input
            style={styles.input}
            type="number"
            value={partsDiscount}
            onChange={(e) => setPartsDiscount(Number(e.target.value) || 0)}
          />
        </div>
        <div>
          <label style={styles.label}>Rabat ulje %</label>
          <input
            style={styles.input}
            type="number"
            value={oilDiscount}
            onChange={(e) => setOilDiscount(Number(e.target.value) || 0)}
          />
        </div>
      </div>

      <div style={styles.buttonRow}>
        <button style={styles.secondaryBtn} onClick={() => setPlannedKm(120000)}>
          120.000 km
        </button>
        <button style={styles.secondaryBtn} onClick={() => setPlannedKm(200000)}>
          200.000 km
        </button>
        <button
          style={styles.secondaryBtn}
          onClick={() => setFlexInterval(exploitation.recommendedFlex)}
        >
          Preporučeni interval
        </button>
        <button
          style={styles.secondaryBtn}
          onClick={() => {
            setLaborDiscount(10);
            setPartsDiscount(12);
            setOilDiscount(18);
          }}
        >
          Primer rabata
        </button>
      </div>

      <div style={styles.helperBox}>
        <div>1 h = 100 TU</div>
        <div>Preporučena satnica za klasu: {formatRsd(decoded.hourlyRate || hourlyRate)}</div>
        <div>
          Cena 1 TU posle rabata:{" "}
          {formatRsd(((hourlyRate || 0) / 100) * (1 - laborDiscount / 100))}
        </div>
        <div>Količina ulja: {decoded.oilCapacity ? `${decoded.oilCapacity} L` : "-"}</div>
        <div>Godišnja kilometraža: {formatNum(annualKm, 0)} km</div>
        <div>Model habanja kočnica: {exploitation.label}</div>
      </div>
    </div>
  );
}

const styles = {
  sidebarCard: {
    background: "#fff",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 1px 10px rgba(0,0,0,0.08)",
  },
  sectionTitle: {
    fontSize: 22,
    margin: "0 0 16px",
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
};