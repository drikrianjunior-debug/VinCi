// ======================================================
// GESTION DU FORMULAIRE DE CONTACT & ENVOI FORMSUBMIT
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    // ------------------------------------------------------
    // SÉLECTION DES ÉLÉMENTS DU DOM
    // ------------------------------------------------------
    const startBtn = document.getElementById("startBtn");
    const quoteBtn = document.getElementById("quoteBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const contactForm = document.getElementById("contactForm");
    const quoteForm = document.getElementById("quoteForm");
    const continueBtn = document.getElementById("continueBtn");
    const quoteService = document.getElementById("quoteService");
    const serviceSelect = document.getElementById("service");
    const subOptions = document.getElementById("subOptions");
    const estimatePrice = document.getElementById("estimatePrice");
    const fields = contactForm ? Array.from(contactForm.querySelectorAll(".form-group")) : [];

    // ======================================================
    // 0. GESTION DES BOUTONS D'ACCUEIL (OUI / ESTIMER / RETOUR)
    // ======================================================
    if (startBtn) {
        startBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (contactForm) contactForm.classList.remove("hidden");
            if (quoteForm) quoteForm.classList.add("hidden");
            if (cancelBtn) cancelBtn.classList.remove("hidden");
            revealFormFields();
        });
    }

    if (quoteBtn) {
        quoteBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (quoteForm) quoteForm.classList.remove("hidden");
            if (contactForm) contactForm.classList.add("hidden");
            if (cancelBtn) cancelBtn.classList.remove("hidden");
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (contactForm) contactForm.classList.add("hidden");
            if (quoteForm) quoteForm.classList.add("hidden");
            cancelBtn.classList.add("hidden");
        });
    }

    // ======================================================
    // 1. CONTINUER DEPUIS L'ESTIMATEUR VERS LE FORMULAIRE
    // ======================================================
    if (continueBtn) {
        continueBtn.addEventListener("click", () => {
            const selectedService = quoteService ? quoteService.value : "";

            // Synchroniser le service sélectionné
            if (selectedService && serviceSelect) {
                serviceSelect.value = selectedService;
            }

            // Mettre à jour le type de demande et le sujet FormSubmit
            const typeDemandeInput = document.getElementById("typeDemande");
            const formSubjectInput = document.getElementById("formSubject");
            
            if (typeDemandeInput) {
                typeDemandeInput.value = "Demande de devis avec estimation";
            }
            if (formSubjectInput) {
                formSubjectInput.value = `Devis avec estimation - ${selectedService}`;
            }

            // Construire le résumé détaillé
            let summaryText = `--- RÉSUMÉ DE L'ESTIMATION ---\n`;
            summaryText += `Service sélectionné : ${selectedService}\n`;

            if (subOptions) {
                const selects = subOptions.querySelectorAll("select");
                selects.forEach(select => {
                    const label = select.previousElementSibling ? select.previousElementSibling.innerText : "Option";
                    const selectedOptionText = select.options[select.selectedIndex]?.text || "";
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
            }

            if (estimatePrice) {
                const priceClean = estimatePrice.innerText.replace(/\n+/g, ' ');
                summaryText += `Estimation affichée : ${priceClean}\n`;
            }

            summaryText += `-----------------------------------\n\nDescription complémentaire : `;

            // Injecter dans la textarea
            if (contactForm) {
                const textarea = contactForm.querySelector("textarea[name='message']");
                if (textarea) {
                    textarea.value = summaryText;
                }

                // Masquer l'estimateur et afficher le formulaire de contact
                if (quoteForm) quoteForm.classList.add("hidden");
                contactForm.classList.remove("hidden");
                if (cancelBtn) cancelBtn.classList.remove("hidden");

                // Révéler les champs intelligents
                revealFormFields();
            }
        });
    }

    // ======================================================
    // 2. RÉVÉLATION INTELLIGENTE DES CHAMPS
    // ======================================================
    function showField(index) {
        if (!fields[index] || !fields[index].classList.contains("hidden")) return;
        fields[index].classList.remove("hidden");
        const element = fields[index].querySelector("input, textarea, select");
        if (element) {
            setTimeout(() => element.focus(), 150);
        }
    }

    function revealFormFields() {
        let firstEmptyFound = false;

        fields.forEach((field, index) => {
            const element = field.querySelector("input, textarea, select");
            if (!element) return;

            const isFilled = element.value && element.value.trim() !== "";
            const isSubmit = element.type === "submit" || index === fields.length - 1;

            // Affiche le bouton Submit immédiatement
            if (isSubmit) {
                field.classList.remove("hidden");
                return;
            }

            // Affiche les champs pré-remplis
            if (isFilled) {
                field.classList.remove("hidden");
            } 
            // Affiche le premier champ vide
            else if (!firstEmptyFound) {
                field.classList.remove("hidden");
                firstEmptyFound = true;
                setTimeout(() => element.focus(), 150);
            }
        });
    }

    // Progression à la saisie / validation du champ
    fields.forEach((field, index) => {
        const element = field.querySelector("input, textarea, select");
        if (!element || element.type === "submit") return;

        function next() {
            if (element.value.trim() !== "") {
                for (let i = index + 1; i < fields.length - 1; i++) {
                    if (fields[i].classList.contains("hidden")) {
                        showField(i);
                        break;
                    }
                }
            }
        }

        if (element.tagName === "SELECT") {
            element.addEventListener("change", next);
        } else if (element.tagName === "TEXTAREA") {
            element.addEventListener("input", () => {
                if (element.value.trim().length > 2) next();
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

    // ======================================================
    // 3. SÉCURITÉ ET SOUMISSION FORMSUBMIT (AJAX/FETCH)
    // ======================================================
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // SÉCURITÉ 1 : Piège Honeypot (Anti-Bot)
            const honeyField = contactForm.querySelector('input[name="_honey"]');
            if (honeyField && honeyField.value !== "") {
                return;
            }

            // SÉCURITÉ 2 : Anti-Spam temporaire (Rate Limit 60 sec)
            const LAST_SUBMIT_KEY = 'last_form_submit_time';
            const lastSubmit = localStorage.getItem(LAST_SUBMIT_KEY);
            const now = Date.now();

            if (lastSubmit && (now - parseInt(lastSubmit, 10) < 60000)) {
                alert("Veuillez patienter une minute avant d'envoyer un nouveau message.");
                return;
            }

            // SÉCURITÉ 3 : Validation des données
            const emailInput = contactForm.querySelector('input[name="email"]');
            const messageInput = contactForm.querySelector('textarea[name="message"]');

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && !emailRegex.test(emailInput.value.trim())) {
                alert("Veuillez saisir une adresse e-mail valide.");
                if (emailInput) emailInput.focus();
                return;
            }

            if (messageInput && messageInput.value.trim().length < 10) {
                alert("Veuillez décrire un peu plus votre projet (au moins 10 caractères).");
                if (messageInput) messageInput.focus();
                return;
            }

            // PRÉPARATION DE L'ENVOI
            const submitBtn = contactForm.querySelector("input[type='submit']");
            const originalBtnValue = submitBtn ? submitBtn.value : "Envoyer";
            
            if (submitBtn) {
                submitBtn.value = "Envoi en cours...";
                submitBtn.disabled = true;
            }

            const formData = new FormData(contactForm);

            // REQUÊTE FETCH VERS FORMSUBMIT
            fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert("Votre message a bien été envoyé ! Nous vous recontacterons sous peu.");
                    
                    localStorage.setItem(LAST_SUBMIT_KEY, Date.now().toString());

                    contactForm.reset();
                    if (quoteForm) quoteForm.reset();

                    contactForm.classList.add("hidden");
                    if (quoteForm) quoteForm.classList.add("hidden");
                    if (cancelBtn) cancelBtn.classList.add("hidden");
                } else {
                    alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
                }
            })
            .catch(error => {
                alert("Erreur de connexion : " + error.message);
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.value = originalBtnValue;
                    submitBtn.disabled = false;
                }
            });
        });
    }
});