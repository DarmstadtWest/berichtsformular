// 🗓️ Zeitraum, in dem das Formular aktiv ist (mit Uhrzeit)
const startDatum = new Date("2025-10-01T08:00:00"); // ab 1. Okt 2025, 08:00 Uhr
const endDatum   = new Date("2025-12-30T23:59:00"); // bis 30. Nov 2025, 23:59 Uhr
const heute = new Date();

// Prüfen, ob Formular aktiv ist
const formularAktiv = heute >= startDatum && heute <= endDatum;

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('berichtForm');
  const feedback = document.getElementById('feedback');

  // 🔒 Wenn Formular nicht aktiv ist:
  if (!formularAktiv) {
    form.innerHTML = `
      <p style="color:red; font-weight:bold; text-align:center;">
        Das Formular ist derzeit offline.<br>
        Es ist verfügbar vom <br> ${startDatum.toLocaleString("de-DE")} bis ${endDatum.toLocaleString("de-DE")}.
      </p>`;
    return;
  }

  // 📨 Formular absenden
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        form.reset();
        feedback.style.display = 'block';
        localStorage.removeItem("berichtData"); // 💾 nach Absenden löschen
      } else {
        alert('Es gab ein Problem beim Senden des Formulars.');
      }
    }).catch(() => {
      alert('Verbindung fehlgeschlagen. Bitte später erneut versuchen.');
    });
  });

  // 💾 Beim Tippen: Formular-Daten automatisch speichern
  form.addEventListener("input", () => {
    localStorage.setItem("berichtData", JSON.stringify(Object.fromEntries(new FormData(form))));
  });

  // 🔁 Beim Laden: gespeicherte Daten wiederherstellen
  const data = JSON.parse(localStorage.getItem("berichtData") || "{}");
  Object.entries(data).forEach(([k, v]) => {
    if (form[k]) form[k].value = v;
  });
});

