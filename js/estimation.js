//  TARIFS DE BASE (FCFA)

const PRIX_BASE = {
  // Prix au m² selon le type de maison
  typeMaison: {
    "Villa":              320000,
    "Appartement":        250000,
    "Duplex":             280000,
    "Maison individuelle":220000,
    "Bungalow":           180000,
    "Studio":             160000,
  },

  // Surface estimée selon le nombre de chambres (m²)
  surface: {
    "1 chambre":        45,
    "2 chambres":       75,
    "3 chambres":      110,
    "4 chambres":      150,
    "5 chambres":      190,
    "6 chambres et plus": 240,
  },

  // Supplément garage (FCFA)
  garage: {
    "Sans garage":        0,
    "1 voiture":    2500000,
    "2 voitures":   4500000,
    "3 voitures et plus": 6500000,
  },

  // Supplément piscine (FCFA)
  piscine: {
    "Non":                    0,
    "Oui — intérieure":  12000000,
    "Oui — extérieure":   8000000,
    "Oui — avec jacuzzi": 15000000,
  },

  // Supplément salle de bain (FCFA par salle au-delà de 1)
  salleBain: {
    "1 salle de bain":  0,
    "2 salles de bain": 1500000,
    "3 salles de bain": 3000000,
    "4 salles de bain": 4500000,
    "5 et plus":        6000000,
  },

  // Coefficient selon la localisation
  localisation: {
    "Abidjan":       1.20,
    "Bouaké":        0.90,
    "Yamoussoukro":  0.95,
    "San-Pédro":     0.92,
    "Korhogo":       0.85,
    "Daloa":         0.87,
    "Man":           0.88,
    "Gagnoa":        0.86,
    "Abengourou":    0.89,
    "Autre":         0.90,
  }
};


function formaterFCFA(montant) {
  return Math.round(montant).toLocaleString("fr-FR") + " FCFA";
}

function formaterMillions(montant) {
  const m = montant / 1000000;
  return m.toFixed(1) + "M";
}

function getParam(nom) {
  const params = new URLSearchParams(window.location.search);
  return params.get(nom) || "";
}

// =============================================
//  CALCUL DE L'ESTIMATION
// =============================================

function calculerEstimation() {
  const type       = getParam("type");
  const chambres   = getParam("chambres");
  const salleBain  = getParam("salleBain");
  const garage     = getParam("garage");
  const piscine    = getParam("piscine");
  const localisa   = getParam("localisation");
  const budget     = parseInt(getParam("budget").replace(/\s/g, "")) || 0;

  // Surface estimée
  const surface = PRIX_BASE.surface[chambres] || 100;

  // Prix au m²
  const prixM2Base = PRIX_BASE.typeMaison[type] || 220000;

  // Coefficient localisation
  const coefLoc = PRIX_BASE.localisation[localisa] || 1.0;

  // Coût construction de base
  const coutBase = surface * prixM2Base * coefLoc;

  // Suppléments
  const suppGarage    = PRIX_BASE.garage[garage]    || 0;
  const suppPiscine   = PRIX_BASE.piscine[piscine]  || 0;
  const suppSalleBain = PRIX_BASE.salleBain[salleBain] || 0;

  // Total
  const total = coutBase + suppGarage + suppPiscine + suppSalleBain;

  // Répartition
  const materiaux   = total * 0.60;
  const mainOeuvre  = total * 0.25;
  const frais       = total * 0.15;

  // Prix au m²
  const prixM2Final = total / surface;

  return {
    total, surface, prixM2Final,
    materiaux, mainOeuvre, frais,
    type, chambres, salleBain, garage, piscine, localisa, budget,
    coutBase, suppGarage, suppPiscine, suppSalleBain
  };
}

// =============================================
//  AFFICHAGE
// =============================================

function afficherEstimation() {
  const e = calculerEstimation();

  // ── Banner ──
  document.getElementById("banner-montant").textContent =
    Math.round(e.total).toLocaleString("fr-FR");

  document.getElementById("banner-m2").textContent =
    "≈ " + Math.round(e.prixM2Final).toLocaleString("fr-FR") + " FCFA / m²  •  Surface estimée : " + e.surface + " m²";

  // ── Répartition des coûts ──
  document.getElementById("val-materiaux").textContent  = formaterMillions(e.materiaux);
  document.getElementById("val-main").textContent       = formaterMillions(e.mainOeuvre);
  document.getElementById("val-frais").textContent      = formaterMillions(e.frais);

  // Barres de progression
  const totalPourBarre = e.total;
  document.getElementById("bar-materiaux").style.width  = "60%";
  document.getElementById("bar-main").style.width       = "25%";
  document.getElementById("bar-frais").style.width      = "15%";

  // ── Récapitulatif projet ──
  document.getElementById("recap-type").textContent       = e.type       || "—";
  document.getElementById("recap-chambres").textContent   = e.chambres   || "—";
  document.getElementById("recap-salle").textContent      = e.salleBain  || "—";
  document.getElementById("recap-garage").textContent     = e.garage     || "—";
  document.getElementById("recap-piscine").textContent    = e.piscine    || "—";
  document.getElementById("recap-lieu").textContent       = e.localisa   || "—";

  // ── Alerte budget ──
  if (e.budget > 0) {
    const diff = e.budget - e.total;
    const alertBox = document.getElementById("budget-alert");
    alertBox.style.display = "flex";
    if (diff >= 0) {
      alertBox.className = "budget-alert alert-ok";
      alertBox.innerHTML = `✅ <strong>Budget suffisant</strong> — Votre budget de ${Math.round(e.budget).toLocaleString("fr-FR")} FCFA couvre l'estimation avec un excédent de <strong>${Math.round(diff).toLocaleString("fr-FR")} FCFA</strong>.`;
    } else {
      alertBox.className = "budget-alert alert-warn";
      alertBox.innerHTML = `⚠️ <strong>Budget insuffisant</strong> — Il vous manque <strong>${Math.round(Math.abs(diff)).toLocaleString("fr-FR")} FCFA</strong> pour couvrir cette estimation.`;
    }
  }
}

// =============================================
//  LANCEMENT AU CHARGEMENT
// =============================================
document.addEventListener("DOMContentLoaded", afficherEstimation);