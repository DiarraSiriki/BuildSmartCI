document.addEventListener("DOMContentLoaded", function () {

  const btn = document.querySelector(".btn-submit");

  btn.addEventListener("click", function () {

    const budget       = document.querySelector(".input-prefix input").value.trim();
    const selects      = document.querySelectorAll(".select-wrap select");
    const type         = selects[0].value;
    const chambres     = selects[1].value;
    const salleBain    = selects[2].value;
    const garage       = selects[3].value;
    const piscine      = selects[4].value;
    const localisation = selects[5].value;

    const erreurs = [];
    if (!budget || isNaN(budget.replace(/\s/g, ""))) erreurs.push("Budget de départ");
    if (!type)         erreurs.push("Type de maison");
    if (!chambres)     erreurs.push("Nombre de chambres");
    if (!salleBain)    erreurs.push("Nombre de salles de bain");
    if (!garage)       erreurs.push("Garage");
    if (!piscine)      erreurs.push("Piscine");
    if (!localisation) erreurs.push("Localisation");

    if (erreurs.length > 0) {
      afficherErreur("Veuillez remplir les champs suivants : " + erreurs.join(", ") + ".");
      return;
    }

    const params = new URLSearchParams({
      budget:       budget.replace(/\s/g, ""),
      type:         type,
      chambres:     chambres,
      salleBain:    salleBain,
      garage:       garage,
      piscine:      piscine,
      localisation: localisation,
    });

    // ✅ "?" ajouté avant params.toString()
    window.location.href = "estimation.html?" + params.toString();
  });

  function afficherErreur(msg) {
    let box = document.getElementById("form-error");
    if (!box) {
      box = document.createElement("div");
      box.id = "form-error";
      box.style.cssText = `
        background: #FDE8E8;
        color: #9B1A1A;
        border-radius: 10px;
        padding: 12px 16px;
        font-size: 0.85rem;
        margin-top: 12px;
        text-align: center;
        border: 1px solid #F4B8B8;
      `;
      document.querySelector(".btn-submit").insertAdjacentElement("afterend", box);
    }
    box.textContent = msg;
    box.style.display = "block";
  }
});