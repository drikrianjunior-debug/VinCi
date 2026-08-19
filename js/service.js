// ==============================
// CONFIGURATION DES SERVICES & OPTIONS
// ==============================

const servicesData = {
    "Web & Graphic Design": {
        basePrice: 150000,
        options: [
            {
                id: "typeDesign",
                label: "Type de projet",
                type: "select",
                choices: [
                    { label: "Identité visuelle / Logo", price: 0 },
                    { label: "Charte graphique complète + UI/UX", price: 150000 },
                    { label: "Supports imprimés & Web (Pack complet)", price: 300000 }
                ]
            },
            {
                id: "deliverables",
                label: "Nombre de déclinaisons / visuels",
                type: "select",
                choices: [
                    { label: "1 à 5 visuels", price: 0 },
                    { label: "6 à 15 visuels", price: 50000 },
                    { label: "+15 visuels / catalogue", price: 150000 }
                ]
            }
        ]
    },
    "Web Development": {
        basePrice: 300000,
        options: [
            {
                id: "siteType",
                label: "Type de site",
                type: "select",
                choices: [
                    { label: "Site Vitrine (1 à 5 pages)", price: 0 },
                    { label: "Site Vitrine Avancé (5 à 15 pages)", price: 250000 },
                    { label: "Boutique en ligne (E-commerce)", price: 700000 },
                    { label: "Application Web sur-mesure", price: 1200000 }
                ]
            },
            {
                id: "features",
                label: "Fonctionnalités avancées",
                type: "checkbox",
                choices: [
                    { id: "opt_payment", label: "Paiement en ligne (Mobile Money / Carte)", price: 150000 },
                    { id: "opt_blog", label: "Espace Blog / Actualités", price: 50000 },
                    { id: "opt_multi", label: "Multilingue", price: 100000 }
                ]
            }
        ]
    },
    "Marketing Advice & Web Development": {
        basePrice: 250000,
        options: [
            {
                id: "duration",
                label: "Accompagnement marketing",
                type: "select",
                choices: [
                    { label: "Audit & Stratégie initiale", price: 0 },
                    { label: "Suivi mensuel (3 mois)", price: 450000 },
                    { label: "Suivi mensuel (6 mois)", price: 800000 }
                ]
            },
            {
                id: "ads",
                label: "Gestion de campagnes publicitaires",
                type: "checkbox",
                choices: [
                    { id: "opt_meta", label: "Facebook / Instagram Ads", price: 100000 },
                    { id: "opt_google", label: "Google Search / Ads", price: 120000 }
                ]
            }
        ]
    },
    "Telecom Consulting, Setup & Maintenance": {
        basePrice: 100000,
        options: [
            {
                id: "infrastructure",
                label: "Taille de l'infrastructure",
                type: "select",
                choices: [
                    { label: "Petite entreprise (1-10 postes)", price: 0 },
                    { label: "Moyenne structure (11-50 postes)", price: 400000 },
                    { label: "Grande infrastructure (+50 postes)", price: 1200000 }
                ]
            },
            {
                id: "maintenance",
                label: "Support & Maintenance",
                type: "select",
                choices: [
                    { label: "Ponctuelle (sur intervention)", price: 0 },
                    { label: "Contrat de maintenance annuel (24/7)", price: 500000 }
                ]
            }
        ]
    }
};

// ==============================
// ÉLÉMENTS DOM
// ==============================

const startBtn = document.getElementById("startBtn");
const quoteBtn = document.getElementById("quoteBtn");
const cancelBtn = document.getElementById("cancelBtn");

const homeButtons = document.getElementById("homeButtons");
const contactForm = document.getElementById("contactForm");
const quoteForm = document.getElementById("quoteForm");

const fields = document.querySelectorAll("#contactForm .form-group");
const serviceSelect = document.getElementById("service");
const quoteService = document.getElementById("quoteService");
const subOptions = document.getElementById("subOptions");

const estimateResult = document.getElementById("estimateResult");
const estimatePrice = document.getElementById("estimatePrice");
const continueBtn = document.getElementById("continueBtn");

// ==============================
// INITIALISATION DES LISTES
// ==============================

Object.keys(servicesData).forEach(service => {
    if (serviceSelect) serviceSelect.appendChild(new Option(service, service));
    if (quoteService) quoteService.appendChild(new Option(service, service));
});

// ==============================
// HELPER D'ANIMATION
// ==============================

function animateShow(element) {
    if (!element) return;
    element.classList.remove("hidden");
    element.classList.add("fade-in");
}

// ==============================
// GESTION DU BOUTON ANNULER / RETOUR
// ==============================

function resetForms() {
    contactForm.reset();
    quoteForm.reset();
    subOptions.innerHTML = "";
    contactForm.classList.add("hidden");
    quoteForm.classList.add("hidden");
    estimateResult.classList.add("hidden");
    fields.forEach(field => {
        field.classList.add("hidden");
        field.classList.remove("fade-in");
    });
    
    animateShow(homeButtons);
    cancelBtn.classList.add("hidden");
}

cancelBtn.addEventListener("click", resetForms);

startBtn.addEventListener("click", () => {
    homeButtons.classList.add("hidden");
    cancelBtn.classList.remove("hidden");
    animateShow(contactForm);
    showField(0);
});

quoteBtn.addEventListener("click", () => {
    homeButtons.classList.add("hidden");
    cancelBtn.classList.remove("hidden");
    animateShow(quoteForm);
});

// ==============================
// CALCUL ET RENDER DE L'ESTIMATION
// ==============================

function calculateTotal() {
    const selectedServiceKey = quoteService.value;
    if (!selectedServiceKey || !servicesData[selectedServiceKey]) return;

    const data = servicesData[selectedServiceKey];
    let total = data.basePrice;

    // Ajout du coût des sélections
    const selects = subOptions.querySelectorAll("select");
    selects.forEach(select => {
        total += parseInt(select.value || 0, 10);
    });

    // Ajout du coût des cases à cocher
    const checkboxes = subOptions.querySelectorAll("input[type='checkbox']:checked");
    checkboxes.forEach(checkbox => {
        total += parseInt(checkbox.value || 0, 10);
    });

    // Affichage avec marge de variation (+/- 15% pour une fourchette réaliste)
    const minPrice = Math.round((total * 0.9) / 5000) * 5000;
    const maxPrice = Math.round((total * 1.15) / 5000) * 5000;

    estimatePrice.innerHTML = `
        Environ<br>
        <strong>${minPrice.toLocaleString()} FCFA</strong> — <strong>${maxPrice.toLocaleString()} FCFA</strong>
    `;

    // Animation du conteneur et effet de pop sur la mise à jour du prix
    if (estimateResult.classList.contains("hidden")) {
        animateShow(estimateResult);
    }
    estimatePrice.classList.remove("price-pop");
    void estimatePrice.offsetWidth; // Reflow JS pour relancer l'animation
    estimatePrice.classList.add("price-pop");
}

quoteService.addEventListener("change", () => {
    const serviceKey = quoteService.value;
    subOptions.innerHTML = ""; // Vider les anciennes options

    if (!servicesData[serviceKey]) return;

    const options = servicesData[serviceKey].options;

    options.forEach((opt, index) => {
        const group = document.createElement("div");
        group.className = "form-group mt-3 fade-in";
        group.style.animationDelay = `${index * 0.08}s`; // Effet cascade des options

        const label = document.createElement("label");
        label.className = "font-weight-bold";
        label.innerText = opt.label;
        group.appendChild(label);

        if (opt.type === "select") {
            const select = document.createElement("select");
            select.className = "form-control";
            opt.choices.forEach(c => {
                select.appendChild(new Option(c.label, c.price));
            });
            select.addEventListener("change", calculateTotal);
            group.appendChild(select);
        } else if (opt.type === "checkbox") {
            opt.choices.forEach(c => {
                const checkDiv = document.createElement("div");
                checkDiv.className = "custom-control custom-checkbox my-1";
                checkDiv.innerHTML = `
                    <input type="checkbox" class="custom-control-input" id="${c.id}" value="${c.price}">
                    <label class="custom-control-label" for="${c.id}">${c.label}</label>
                `;
                checkDiv.querySelector("input").addEventListener("change", calculateTotal);
                group.appendChild(checkDiv);
            });
        }

        subOptions.appendChild(group);
    });

    calculateTotal();
});

// ==============================
// CONTINUER VERS FORMULAIRE DE CONTACT
// ==============================

if (continueBtn) {
    continueBtn.addEventListener("click", () => {
        const selectedService = quoteService.value;

        // 1. Synchroniser le service sélectionné
        if (selectedService && serviceSelect) {
            serviceSelect.value = selectedService;
        }

        // 2. Mettre à jour l'indicateur hidden
        const typeDemandeInput = document.getElementById("typeDemande");
        if (typeDemandeInput) {
            typeDemandeInput.value = "Demande de devis avec estimation";
        }

        // 3. Récupérer le résumé des choix faits dans l'estimateur
        let summaryText = `--- RÉSUMÉ DE L'ESTIMATION ---\n`;
        summaryText += `Service sélectionné : ${selectedService}\n`;

        const selects = subOptions.querySelectorAll("select");
        selects.forEach(select => {
            const label = select.previousElementSibling ? select.previousElementSibling.innerText : "Option";
            const selectedOptionText = select.options[select.selectedIndex].text;
            summaryText += `- ${label} : ${selectedOptionText}\n`;
        });

        const checkboxes = subOptions.querySelectorAll("input[type='checkbox']:checked");
        if (checkboxes.length > 0) {
            summaryText += `- Options supplémentaires :\n`;
            checkboxes.forEach(cb => {
                const labelText = cb.nextElementSibling ? cb.nextElementSibling.innerText : "";
                summaryText += `   * ${labelText}\n`;
            });
        }

        if (estimatePrice) {
            const priceClean = estimatePrice.innerText.replace(/\n+/g, ' ');
            summaryText += `Estimation affichée : ${priceClean}\n`;
        }

        summaryText += `-----------------------------------\n\nDescription complémentaire : `;

        // 4. Injecter le résumé dans la textarea
        const textarea = contactForm.querySelector("textarea");
        if (textarea) {
            textarea.value = summaryText;
        }

        // 5. Masquer l'estimateur et afficher le formulaire de contact avec animation
        quoteForm.classList.add("hidden");
        animateShow(contactForm);

        // 6. Révéler intelligemment les champs
        revealFormFields();
    });
}

// ==============================
// FORMULAIRE PROGRESSIF INTELLIGENT
// ==============================

function showField(index) {
    if (!fields[index] || !fields[index].classList.contains("hidden")) return;

    animateShow(fields[index]);
    const element = fields[index].querySelector("input, textarea, select");

    if (element) {
        setTimeout(() => element.focus(), 150);
    }
}

/**
 * Parcourt les champs du formulaire de contact :
 * - Affiche immédiatement tout champ déjà rempli (ex: Service, Description)
 * - Affiche le premier champ vide rencontré pour la saisie (ex: Nom)
 */
function revealFormFields() {
    let firstEmptyFound = false;

    fields.forEach((field, index) => {
        const element = field.querySelector("input, textarea, select");
        if (!element) return;

        const isFilled = element.value && element.value.trim() !== "";
        const isSubmit = element.type === "submit";

        if (isFilled && !isSubmit) {
            animateShow(field);
            field.style.animationDelay = `${index * 0.05}s`;
        } else if (!firstEmptyFound && !isSubmit) {
            animateShow(field);
            field.style.animationDelay = `${index * 0.05}s`;
            firstEmptyFound = true;
            setTimeout(() => element.focus(), 150);
        }
    });
}

// Écouteurs pour la progression au clavier / à la saisie
fields.forEach((field, index) => {
    const element = field.querySelector("input, textarea, select");
    if (!element || index === fields.length - 1) return;

    function next() {
        if (
            element.value.trim() !== "" &&
            index + 1 < fields.length &&
            fields[index + 1].classList.contains("hidden")
        ) {
            showField(index + 1);
        }
    }

    if (element.tagName === "SELECT") {
        element.addEventListener("change", next);
    } else if (element.tagName === "TEXTAREA") {
        element.addEventListener("input", () => {
            if (element.value.trim().length > 5 && fields[index + 1].classList.contains("hidden")) {
                showField(index + 1);
            }
        });
    } else {
        element.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                next();
            }
        });
    }
});