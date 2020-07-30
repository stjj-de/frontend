export const HOMEPAGE_INTRODUCTION = "HOMEPAGE_INTRODUCTION";
export const GEMEINDE = "GEMEINDE";
export const MESSDIENERPLAN = "MESSDIENERPLAN";
export const PFARRBRIEF = "PFARRBRIEF";

export const CONTENTS = {
  [HOMEPAGE_INTRODUCTION]: {
    title: "Vorstellung auf der Startseite",
    description:
      "Dieser Text steht auf der Startseite ganz oben und ist sofort sichtbar. " +
      "Er sollte für eine kurze Vorstellung der Pfarrei genutzt werden.",
    maxHeading: 7
  },
  [GEMEINDE]: {
    title: "Text auf der Gemeinde-Seite",
    description:
      "Dieser Text ist unter dem Menüpunkt \"Gemeinde\" zu finden. " +
      "Er sollte für eine Auflistung der wichtigen Personen in der Gemeinde und evtl. weiteren Einrichtungen, " +
      "wie z. B. Kindergärten, genutzt werden.",
    maxHeading: 1
  },
  [MESSDIENERPLAN]: {
    title: "Messdienerplan (Datei)",
    description: "Zu finden auf der Gemeinde-Seite.",
    file: true
  },
  [PFARRBRIEF]: {
    title: "Pfarrbrief (Datei)",
    description: "Zu finden auf der Gemeinde-Seite.",
    file: true
  }
};
