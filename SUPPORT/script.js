const supportList = document.getElementById("support-list");

fetch("support.json")
    .then(response => response.json())
    .then(data => {
        data.forEach(member => {
            const card = document.createElement("div");
            card.className = "support-card";

            // Préparer les informations de contact
            let contactInfo = '';
            let contactLabel = '';
            
            // Si l'email est présent, l'afficher
            if (member.email) {
                contactInfo += `<p><span class="label">Email:</span> <a href="mailto:${member.email}">${member.email}</a></p>`;
            }
            
            // Si le Discord est présent, l'afficher
            if (member.discord) {
                contactInfo += `<p><span class="label">Discord:</span> <span>${member.discord}</span></p>`;
            }

            card.innerHTML = `
                <img src="${member.profilePicture}" alt="${member.name}">
                <div class="info">
                    <h3>${member.name}</h3>
                    ${contactInfo}
                    <p><span class="label">Rôle:</span> ${member.role}</p>
                </div>
            `;

            supportList.appendChild(card);
        });
    })
    .catch(error => console.error("Erreur lors du chargement du support.json:", error));
