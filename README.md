# Notenliste

Web-App zum Erfassen und Berechnen von Noten (Schulaufgaben, Kurzarbeiten/Stegreifaufgaben, mündliche Noten, Ersatzprüfung).
Alle Noten bleiben auf dem Gerät der Lehrkraft – dieses Repository enthält nur das Programm, keine Daten.

## Veröffentlichen (GitHub Pages)
1. Alle Dateien dieses Ordners in das Repository hochladen (Hauptebene).
2. Settings → Pages → „Deploy from a branch“ → Branch `main`, Ordner `/ (root)` → Save.
3. Nach 1–2 Minuten ist die App unter `https://<benutzername>.github.io/<repository>/` erreichbar.

## Update veröffentlichen
1. Neue `index.html` hochladen.
2. In `sw.js` die Zeile `const VERSION = 'notenliste-v1';` hochzählen (v2, v3 …).
Die Geräte laden die neue Version im Hintergrund; sie ist beim nächsten Start aktiv.

## Wichtig
Niemals Schülerlisten, Schuljahrespakete (.nta) oder Sicherungen in dieses Repository hochladen – es ist öffentlich.
