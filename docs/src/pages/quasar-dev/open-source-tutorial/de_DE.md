---
title: Open Source Tutorial
---
[en_UK](/quasar-dev/open-source-tutorial/en_UK)

### Was wird diskutiert?

> Sie werden mehr über Open-Source und Best-Practices erfahren, um sicherzustellen, dass Ihre Beträge konform sind.

#### **Einführung**

- Sie lernen den Unterschied zwischen Urheberrecht, Lizenzierung und Attribution kennen
- Sie erfahren die Bedeutung von "Freier/Libre- und Open-Source-Software"
- Sie erfahren den Unterschied zwischen "Freizügigen" und "Nicht-Freizügigen" Lizenzen
- Sie erfahren mehr über das Auffinden von Lizenzen und Lizenzvereinbarungen
- Sie lernen, wie Sie Code und andere Assets, die Open-Source sind, verwenden

#### **Ihre Identität und Rechte**

- Sie erfahren mehr über "Vertraulichkeitsvereinbarungen" (NDA)
- Sie erfahren mehr über "Lizenzvereinbarung des Beitragenden" (CLA)
- Sie lernen, wie Sie ein "verifizierter" Beitragender werden
- Sie erfahren, warum "Entwickler-Ursprungsbescheinigungen" verwendet werden
- Sie erfahren, was "unterzeichnet von" bedeutet
- Sie erfahren mehr über "Freigabe"-Formen
- Sie erfahren mehr über "Herkunft"

#### **Lizenztypen**

- Lizenzen für Code
- Lizenzen für Text / Dokumentation
- Lizenzen für Kunstwerke / Design / Video
- Lizenzen für Schriftarten

### Voraussetzungen

- Sie müssen fließend Englisch lesen
- Ein Grundverständnis über `Git` besitzen 
- Kenntnis über, für Ihr Tätigkeitsfeld relevante, Dateitypen besitzen 

### Schwierigkeit

- Einfach bis Mittel

# Tutorial-Inhalte

> Dieses Tutorial ist eine Einführung für diejenigen, die daran interessiert sind zu Open-Source-Projekten beizutragen. Es mag auch für aktive Beitragende nützlich sein, die schon immer neugierig über fortgeschrittene Themen waren. Und zuletzt, da Lizenzierung sehr umstritten sein kann, ist dies auch ein Text für diejenigen, die an Diskussionen über Open-Source teilnehmen möchten. Obwohl wir konkrete Beispiele aus dem "Quasar Framework" verwenden, sind die hier diskutierten Probleme für das gesamte Spektrum von Open-Source-Softwareentwicklung relevant.
> 
> Wir hoffen, dass Sie ein tieferes Verständnis für all die großartigen Dinge (und möglichen Schwierigkeiten) gewinnen, welche die Lizenzen in der Welt von Open-Source-Software umgeben. Die Einführung ist ein ausgezeichneter Start, da hier Begriffe definiert werden, auf welche sich dieses Tutorial stetig bezieht. Desweiteren wird es Ihnen einige einfache Methoden beibringen, um sicherzustellen, dass Ihre Beiträge dem Lizenzsystem entsprechen, welches von dem Projekt, mit dem Sie zusammenarbeiten, bestimmt wurde. Dann beginnt es eine Diskussion über Sie, den Beitragenden, und Ihre Rechte und Verantwortungen. Schließlich wird auf verschiedene Bereiche der Lizenzierung eingegangen, darunter Code, Kopie, Design und Schriften.

## Vorwort

> Manche Software hat einen Source-Code, der nur von einer einzigen Person, einem Team, oder einer Organisation, die es erstellt hat—und alleinige Kontrolle über ihn behält—modifiziert werden kann. Diese Art von Software wird "Geschützte"- oder "Closed-Source"-Software genannt. ... Open-Source-Software ist anders. Deren Verfasser [stellen ihren Source-Code denjenigen zur Verfügung](https://opensource.com/business/13/5/open-source-your-code), die den Code ansehen, kopieren, von ihm lernen, ändern oder teilen wollen. [LibreOffice](https://www.libreoffice.org/) und das [GNU-Bildbearbeitungsprogramm](http://www.gimp.org/) sind Beispiele für Open-Source-Software.

https://opensource.com/resources/what-open-source

Jeder Akt der Kreativität kann jemandem oder einer Gruppe von Menschen attribuiert werden, die zusammenarbeiten. Eigentlich ist es ziemlich einfältig zu glauben, dass irgendetwas in einem Vakuum existiert. Wir sind alle verbunden und Ideen sind Dinge, die oftmals ein Eigenleben entwickeln. In der heutigen Zeit haben jedoch viele Menschen damit begonnen, ihre Ideen vor dem Diebstahl zu schützen, indem sie diese weitergeben - indem sie ihre Arbeit so veröffentlichen, dass andere Menschen in die Lage versetzt und dazu aufgerufen werden, zum Projekt beizutragen - oder es sogar in eine ganz andere Richtung zu lenken.

Vergleichbar mit der Art und Weise in der Gilden vergangener Jahrhunderte ihre Geschäftsgeheimnisse geschützt haben, kann die Rechtfertigung eines "urheberrechtlichen" Schutzes von Ideen und eine Verehrung von "Closed-Source" in Gesetzgebung und Freihandelsabkommen direkt auf viele Probleme, die Turbo-Kapitalismus auf unseren Planeten freigelassen hat, zurückgeführt werden. Aber - es gibt etwas, das Sie tun können. Sie können an der Open-Source-Bewegung teilnehmen.

## Einführung

### Urheberrecht, Lizenzierung und Attribution

Es wird in der modernen demokratischen Gesellschaft generell akzeptiert, dass ein Urheberrechtsvermerk als Vorwort für alle Lizenzen benötigt wird, um festzulegen, wie das Objekt, welches lizensiert wird, verwendet werden kann. In einer merkwürdigen (aber dennoch logischen) Wendung, wenn Sie Ihr Werk als Public Domain oder Copyleft teilen möchten, müssen Sie zuerst angeben, dass Sie der Besitzer Ihres Werkes sind (und dass jeder, der etwas beigetragen hat, mit Ihnen einig ist).

Sobald ein Urheberrecht angegeben wird, kann der Urheberrechtsinhaber den Lesern des Codes / Artikels / Kunstwerks informieren, unter welchen Umständen eine Verwendung angemessen ist. Egal welchen Lizenzierungs-Ansatz der ursprüngliche Autor / Urheberrechtsinhaber wählt, es ist immer angemessen, Kopien dieser Lizenzen in dem Repository, welches Ihre Arbeit enthält, zu speichern, sollte es Open-Source-lizenzierte Werke von Dritten enthalten. Es ist niemals in Ordnung Lizenzdateien oder Lizenzreferenzen in den Kopfzeilen oder Metadaten der Open-Source-Dateien zu löschen oder zu bearbeiten.

Solange "Verbraucher" Ihrer erbauten Artefakte (Webseite, App, usw.) informiert werden, wo sie die Lizenzen der Projekte Dritter, die Sie verwendet haben, um Ihr Projekt zu bauen, einsehen können, können Sie vermeiden diese Lizenzen zu versenden.

Wenn Sie sich entscheiden irgendetwas von Dritten in Ihrer Arbeit zu verwenden, ausgeschlossen von lizenzfreien Werken (welche ich persönlich auch zitieren würde), sind Sie angehalten (sowohl legal als moralisch) diese in der Quelle zu zitieren. Dies wird **Attribution** genannt und eine Faustregel besagt, dass Sie Quellenangaben zu sämtlichem Code angeben sollten, den Sie verwenden. Wir werden später in diesem Tutorial näher auf dieses Thema eingehen, da es verschiedene Voraussetzungen gibt, je nach Domain der attribuierten Quelle.

### "Freier/Libre- und Open-Source-Software"

> Der Begriff "Open-Source" bezieht sich auf etwas, das Menschen modifizieren und teilen können, weil das Design öffentlich erhältlich ist.
> 
> https://opensource.com/resources/what-open-source

Es gibt andauernde Diskussionen unter FLOSS-Hardlinern über das Ausmaß von **Freiheit** welche "Open"-Source innewohnt - und sogar was **frei** bedeutet. Es ist wahrscheinlich dennoch eine gute Idee in der Zeit zurück nach 1998 zu reisen und [diesen Artikel zu lesen](https://opensource.com/article/18/2/coining-term-open-source-software), welcher von der Frau verfasst wurde, die den Namen "Open-Source" erfand: Christine Peterson. Auch wenn Richard Stallman und Linus Torvald zwei der erfolgreichsten, sichtbarsten und lautstärksten Befürworter diesbezüglich sind, startete der Begriff als "Marketinginstrument". Er bürgerte sich ein und veränderte das Leben aller auf diesem Planeten - vermutlich zum Besseren.

Stallman und die "Free Software Foundation" (FSF), die wohl am längsten dabei sind, werden Freiheit als einen wichtigen Teil von Open-Source definieren, weil die Freiheit den Code zu verwenden und zu ändern auch eine Verantwortung ist, die Sie im Namen der gesamten Gemeinschaft tragen.

<center><strong>Was ist frei? Was ist libre?</strong></center>

Wenn man für einen Moment den nervigen Fakt vergisst, dass *frei* auch "kostet kein Geld' bedeutet (was der Hauptgrund dafür war den Begriff libre hinzuzufügen), gibt es immer noch ein ungelöstes semantisches Problem, und zwar eines, das wahrscheinlich niemals gelöst wird:

Je nach Ansicht, ist die Gnu-Public-License nicht KOMPLETT umsonst, weil sie mit der Bedingung kommt, dass Sie Änderungen, die Sie am Code vorgenommen haben, an die Gemeinde zurückgeben müssen - und frei sein würde bedeuten, dass Sie entscheiden, wie Sie arbeiten und was Sie mit dem Code machen möchten. Zur gleichen Zeit und auf einem anderen Spektrum gibt es diejenigen, die eine MIT-Lizenz als nicht komplett frei betrachten. Sie tun dies, weil es Situationen gibt, in denen der Code zulässigerweise geändert und nicht an die Gemeinschaft zurückgegeben werden kann - der Code wird in gewisser Weise "eingesperrt".

> Es gibt keine richtige oder falsche Antwort, da es auf die Perspektive ankommt - Jeder Entwickler und jede Organisation muss jedoch für sich entscheiden auf welchen Schwerpunkt sie sich konzentrieren wollen. Wir beim Quasar Framework sind kein Puristen im Sinne, dass wir glauben, Code ist an sich ein spirituelles Wesen, das übertragbare Rechte verdient. Wenn wir an einem Linux-Kernel arbeiten würden wäre dies vielleicht anders - aber wir sind mehr an der menschlichen Seite von Code interessiert und glauben, dass Menschen, die unser Projekt nutzen, die ultimative Entscheidungsfreiheit haben sollten, zu tun, was sie wollen. Darum haben wir den "offenen" Ansatz gewählt und uns für die MIT-Lizenz entschieden.

Es wird oftmals ausführlich diskutiert, "wie frei man Code machen soll". Ich schlage vor, dass Sie sich selbst folgende Frage stellen:

1. Bevorzugen Sie es alleine zu arbeiten?
2. Sind Sie besorgt, dass Menschen Ihre Idee stehlen?
3. Haben Sie allen Code selbst geschrieben, einschließlich der Bibliotheken?
4. Haben Sie irgendeine Art von Vertraulichkeitsvereinbarung für die betreffende Arbeit unterschrieben?

Wenn Sie auf irgendeine dieser Fragen mit **nein** geantwortet haben, dann ist eine Open-Source-Lizenz genau das richtige für Ihre Arbeit.

Wenn Sie auf all diese Fragen mit **ja** geantwortet haben, dann ist das Lizenzieren als Open-Source immer noch eine der besten Methoden, um Ihre Arbeit zu schützen und sicherzustellen, dass es einen Einfluss auf den Rest der Welt hat. Sehen Sie es so: Wenn keine Software in Ihrem Arbeitsfeld Open-Source wäre, würden Sie noch in der Lage sein, wie bisher weiter zu arbeiten? Sind Sie es nicht der Gemeinschaft schuldig, Ihre Arbeit zu teilen?

### Offene vs. Geschützte Lizenzen

Eine der häufigsten Missverständnisse über das Lizenzieren Ihres Projektes mit GPL ist, dass es Unternehmen daran hindert Ihre Idee zu übernehmen und mit ihr Geld zu verdienen - alles ohne Ihnen einen Anteil des Profits zu geben. Dies ist schlicht und einfach nicht wahr. Wenn jemand Ihren Code stehlen und das Gesetz brechen möchte, wird er es tun. Wenn ein Unternehmen Ihre GPL-Bibliothek verwenden möchte, kann sie diese vom Rest ihres Systems isolieren und nichts von ihrem geschützten Code freigeben. Sie können Ihren Code nehmen, rekonstruieren und neu schreiben. Wenn dies Ihre größte Sorge ist, dann stoppen Sie, gehen Sie zum Anfang dieses Tutorials zurück und lesen Sie sorgfältig, um zu entscheiden, ob Sie an Open-Source teilnehmen - oder nur davon profitieren wollen.

MIT, BSD und Apache sind, was die Open-Source-Software-Gemeinschaft "offene" Lizenzen nennt. Offen bedeutet, dass der Autor Ihnen ein hohes Maß an Rechten gewährt, um die geteilte Software zu verwenden, sogar das Recht sie zu verwenden, um Gewinn zu machen und sie Ihren Zwecken anzupassen. Solange Sie eine Kopie der originalen Lizenz behalten und diejenigen, die daran interessiert sind, dass sie diese bestimmte Software benutzen, informieren, können Sie mit dem Code machen, was sie wollen - Sie können ihn sogar ändern und niemandem sagen, dass Sie dies getan haben.

> Copyleft bezeichnet die Praxis, Menschen die Rechte anzubieten Kopien und modifizierte Versionen einer Arbeit frei zu vertreiben, unter der Bedingung, dass dieselben Rechte in später erstellten [derivativen Arbeiten](https://en.wikipedia.org/wiki/Derivative_works) beibehalten werden. https://de.wikipedia.org/wiki/Copyleft

Diese Art von "geschützter" Lizenzierung geht über die "offene" Lizenzierung nach MIT und APACHE hinaus, indem es anstrebt den Code und die Rechte der Community zu schützen. Jegliche Modifizierungen des Quellcodes müssen an die Community zurückgegeben werden und Sie dürfen dem Code keine Unterlizenz hinzufügen. GPL und CC-SA sind zwei Lizenzen, die auf diese Weise funktionieren.

### Auffinden von Lizenzen und Lizenzvereinbarungen

Das Verwenden von Open-Source-Software in Ihren Projekten ist eine großartige Sache, aber Sie müssen sorgfältig bleiben, vor allem wenn Sie Arbeit zu einem anderen Projekt beitragen. Und dies ist doppelt wahr, wenn von Ihnen verlangt wird, Berichterstattungen über das Einhalten von Lizenzbestimmungen zu verfassen (zum Beispiel für öffentliche Einrichtungen oder legale Firmen-Firewalls). Es kann auf jeden Fall ein bisschen umständlich sein, manuell alle Lizenzdateien aufzuspüren.

Ein gibt ein paar Projekte die dieses Thema des Auffinden behandeln, so wie [nlf](https://www.npmjs.com/package/nlf) und [https://fossa.io/](https://fossa.io/ "https://fossa.io/"), und besonders [deren freie **CLI**, welche keine Registrierung benötigt](https://github.com/fossas/fossa-cli).

    $ nlf --summary detail > nlf.txt
    

[Hier ist ein Bericht vom Quasar-Repository, der den **nfl** Ansatz verwendet.](https://raw.githubusercontent.com/nothingismagick/quasar-articles/master/tutorials/nlf_report_licenses_quasar.txt.md)

Wenn Sie den Lizenzbericht der **fossa CLI** in Ihrem Repository einsehen möchten, nachdem Sie die Installationsanweisungen befolgt haben, können Sie diesen Befehl verwenden:

    $ fossa report licenses > fossa.txt
    

[Hier ist ein Bericht aus dem Quasar-Repository mit dem Ansatz der **fossa CLI**.](https://raw.githubusercontent.com/nothingismagick/quasar-articles/master/tutorials/fossa_report_licenses_quasar.txt.md) Wie Sie sehen können, verwendet die große Mehrheit der Module die MIT-Lizenz, aber einige gehen aus dem Bericht allein nicht klar hervor: 15 Projekte wurden nicht automatisch durch die **Fossa** erkannt. Ich folgte jedem der Links, spürte ihre Lizenzen auf und erstellte eine Notiz, nicht nur von der Lizenz, aber auch dass ich derjenige war, der es getan hat.

Darüber hinaus entdeckte ich, dass nur für eine unserer Bibliotheken (Stylint) eine GPL-Lizenz erforderlich ist, aber die Entwickler haben einen Lizenz-Konflikt in der Erklärung im package.json (GPL-2) und in der tatsächlichen Lizenzdatei (GPL-3).

Das ist, was Sie ebenfalls tun müssen. Sollte eine Lizenz-Datei nicht in das Projekt einbezogen werden und Sie können keine finden, ist es ratsam den Autor zu kontaktieren.

**Ein Sicherheitshinweis**: Diese automatisierten Systeme sind nicht narrensicher (z. B. ein Lizenz-Erkennungsmodul erkennt möglicherweise mehrere Lizenzen, auch wenn es selbst eine andere Lizenz verwendet). Wenn Sie an die Einhaltung gesetzlicher Bestimmungen gebunden sind, müssen Sie diese per Hand prüfen - und scheuen Sie nicht den Autor zu kontaktieren, sollten Sie Klarstellungen benötigen - oder sogar eine andere Lizenz. Dies ist manchmal möglich. Erinnern Sie sich nur daran, es ist besser um Erlaubnis zu bitten, als um Vergebung.

### Open-Source verwenden

Wenn Sie irgendetwas verwenden, das Open-Source ist, dann müssen Sie die Nutzung angeben und die originale Lizenz einfach zugänglich machen. Wenn Sie, zum Beispiel, Node-Module in Ihrem Projekt verwenden, sind diese Lizenzen im Quellcode des Projekts einsehbar, sobald jemand die Projektdateien herunterlädt und die Voraussetzungen "installiert". Normalerweise können Sie diese als Datei mit dem Namen `LICENSE` im Stammordner oder im "Lizenz"-Feld im `package.json` finden

Im Allgemeinen ist dies genug. Wenn sie jedoch Änderungen in der originalen Bibliothek tätigen, müssen Sie die Community vielleicht über diese Änderungen informieren und / oder zurücksetzen. Es kommt auf den Lizenztyp an, aber wir werden Einzelheiten der Lizenzierung im letzten Kapitel behandeln.

> **Stack Overflow**: Ein häufiger Fehler ist das bloße Kopieren und Einfügen von Dingen, die auf stackoverflow.com gefunden werden können - Dies ist jedoch gefährlich, da Sie, obwohl es besagt, dass der Nutzer die Informationen teilt, nicht zu 100 % sicher sein können, dass es angemessen (oder erlaubt) ist das Code-Beispiel 1 zu 1 zu verwenden. Die übliche Praxis für das Zitieren der Quelle ist besser als nichts, aber Sie sollten wirklich in Betracht ziehen das Beispiel umzuarbeiten und Ihrem Code-Stil, sowie den Anforderungen des Projekts anzupassen UND die Quelle der "Inspiration" zu zitieren.

## Ihre Identität und Rechte

### Was ist eine "Vertraulichkeitsvereinbarung" (NDA - Abkürzung für englisch non-disclosure agreement)

Eine Vertraulichkeitsvereinbarung ist ein Vertrag, den Sie vielleicht unterschreiben müssen, sollten Sie für eine Organisation arbeiten, die Geschäftsgeheimnisse zu bewahren hat. Als der Unterzeichner der NDA sind Sie vertraglich dazu verpflichtet Geheimhaltung über die Informationen, die Sie erhalten haben, zu behalten und es beinhaltet vielleicht sogar eine zeitlich begrenzte Wettbewerbsverbotsklausel für vergleichbare Unternehmen. Obwohl es in der Open-Source-Branche eher unüblich ist, kann es erforderlich sein, sollten Sie Zugang zu "Geheimnissen" haben, wie API-Schlüssel, Logins, oder Ähnlichem.

> Wenn Ihnen eine Vertraulichkeitsvereinbarung vorgelegt wird, empfiehlt es sich wie mit jedem Vertrag, diesen genau durchzulesen, Fragen zu stellen und einen Anwalt um Rat zu bitten. Quasar wird nie von Ihnen verlangen eine NDA zu unterschreiben.

### Was ist eine "Lizenzvereinbarung für Beitragende" (CLA - Abkürzung für englisch contributor license agreement)

Eine Lizenzvereinbarung für Beitragende ist ein Vertrag zwischen dem Besitzer eines Projekts und Codern. Anders als eine NDA (welche einschränkend ist), ist eine CLA "beidseitig", da sie in der Tat die Rechte von beiden, des Besitzers und des Beitragenden, beschützt. Mit einer CLA erteilen Beitragende dem Besitzer ausdrücklich die Befugnis zum Verwenden des Beitrages und Besitzer gestatten dem Beitragenden explizit das Verwenden des Beitrages nach eigenen Vorstellungen.

Viele Entwickler halten eine CLA jedoch für problematisch, da die Rechte, die sie dem Besitzer übertragen, die Fähigkeit beinhalten die Lizenzen des Codes zu ändern. [Hier ist ein sehr gute Zusammenschrift von Gitlab](https://about.gitlab.com/2017/11/01/gitlab-switches-to-dco-license/), in dem sie erklären, warum sie von einer CLA zu einer DCO gewechselt haben - und hier ist ihre [ausführliche Analyse aus der Sicht des Projektmanagements](https://docs.google.com/a/gitlab.com/document/d/1zpjDzL7yhGBZz3_7jCjWLfRQ1Jryg1mlIVmG8y6B1_Q/edit?usp=sharing).

### Was ist ein "Entwickler-Herkunftsnachweis" (DCO - Abkürzung für englisch developer certificate of origin)

Ein Entwickler-Herkunftsnachweis ist eine rechtlich verbindliche Stellungnahme, in der ein Beitragender bestätigt, dass der Beitrag eigenhändig verfasst wurde und er oder sie die legale Autorität hat, um den Code beizutragen. Wie bei dem oben genanntem Gitlab-Beispiel, wird dieser normalerweise zusammen mit einer Lizenz wie MIT oder Apache erstellt. Sie können die gesamte Lizenz hier einsehen (sie ist kurz): https://developercertificate.org/

In dem Sie eine `signed-off-by`-Flag zu Ihrem Git-Commit hinzufügen, geben Sie bekannt, dass sie in Übereinstimmung mit der DCO handeln. Obwohl es nicht für jeden Commit notwendig ist, bietet es eine Art von "Schuldkette", falls etwas schief läuft. Die bewährte Methode empfiehlt das Verwenden des wirklichen Namens des Beitragenden. Sie können mehr über die Details dieser Vorgehensweise hier lesen: https://stackoverflow.com/a/1962112

Einige IDEs, so wie [Webstorm](https://www.jetbrains.com/help/webstorm/2017.2/using-git-integration.html#commit), bieten Ihnen die Möglichkeit diese Flag direkt beim Code-Review aus dem Commit hinzuzufügen. Hierdurch wird die folgende Zeile an das Ende der Commit-Nachricht angehängt: `Signed off by: <username>`

Bitte beachten Sie, sollte der Manager des Projektes an dem Sie arbeiten, Sie um "sign off" bitten, vergewissern Sie sich, dass dies wirklich für alle Commits unternommen werden soll, oder ob das Abmelden von Tags oder PRs ausreicht. Technisch gesehen, ist die für das Zusammenfügen zuständige Person für den Sign-off zuständig, aber durch das Hinzufügen des Namens der individuellen Commits wird es deutlicher, wer wirklich für die Änderungen verantwortlich ist. Es kommt auf die persönliche Vorliebe an.

> Bei Quasar bitten wir Sie um sing-off von allen Commits.

### Ein "verifizierter" Beitragender werden

Verifizierte Beitragende auf Github oder Gitlab sind Entwickler, die einen GPG-Schlüssel zu ihrem Konto hinzugefügt haben und diesen verwenden, um ihre Commits zu unterschreiben. Auch wenn es für die Integration nicht notwendig ist, verlangen es vielleicht einige Manager - besonders, da es einfacher ist, jemandes Anmeldeinformationen zu stehlen und ein kritisches Repository zu modifizieren, als einen GPG-Schlüssel zu stehlen.

Die folgenden Links zeigen Ihnen, wie man einen GPG-Schlüssel erstellt und wie dieser mit Github oder Gitlab verwendet wird.

- [Einen GPG-Schlüssel zu Github hinzufügen](https://help.github.com/articles/adding-a-new-gpg-key-to-your-github-account/)
- [Commits auf Gitlab unterzeichnen](https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/index.html)
- https://blog.github.com/2016-04-05-gpg-signature-verification/
- https://stackoverflow.com/questions/10161198/is-there-a-way-to-autosign-commits-in-git-with-a-gpg-key

### Wann benötige ich eine "Einverständniserklärung"

Eine Einverständniserklärung wird in der Regel verlangt, wenn Personen oder Privateigentum fotografiert werden - und die Fotografien für nicht-private Zwecke verwendet werden. Auch wenn Einzelheiten je nach Zuständigkeitsbereich variieren, ist es ausgesprochen wichtig, dass Sie die Leute eine Einverständniserklärung unterschreiben lassen. Sollte es auch bekannt sein, WO das Foto aufgenommen wurde, so müssen Sie vielleicht auch eine Erlaubnis des Besitzers bekommen.

> Eine geschickte Art Einverständniserklärungen von Menschen zu handhaben (wenn diese Sie ernsthaft unterstützen wollen), ist eine sogenannte "gegenseitige Bezahlung". Vor dem Fotoshooting bereiten Sie zwei Quittungen vor. Mit einer Quittung zahlen Sie den Leuten z. B. 5 EUR für das Arbeiten als Model. Auf der anderen Quittung zahlen die Leute Ihnen z. B. 5 EUR für eine Kopie des Fotos. Die Regel (habe das Geld, behalte die Kopie) gilt, sodass beide Parteien eine Originalquittung und eine Kopie besitzen. Sie senden ihnen eine digitale Kopie des endgültigen Bildes als Link zu einem Open-Source-Repository, auf dem es genutzt wurde, und notieren dies auf der Kopie der Quittung, die Sie vergeben haben. Behalten Sie dies in Ihren eigenen Dokumenten und alle sind glücklich.

Falls Sie Fotografien von Personen verwenden, die Sie selbst erstellt haben und diese zu einem Open-Source-Projekt einreichen, müssen Sie fähig sein zu überprüfen, ob eine Person die Erlaubnis erteilt hat und Sie sollten die Einverständniserklärung verfügbar aufbewahren.

### Wie dokumentiere ich "Herkunft"

Herkunft ist ein Wort, welches die Geschichte einer Arbeit beschreibt. Ein unter einer Open-Source-Lizenz geteilter Code innerhalb des Kontextes eines git-Repositorys ist mehr oder weniger selbstdokumentierend. Abbildungen sind weniger eindeutig und es ist besonders knifflig mit digitalen Collage-Arbeiten, die mehrere Quellen kombinieren.

Es ist wichtig sich mit der Herkunft fü Designer zu beschäftigen, da Rechte an visuellen Bildern stark umkämpft sind und oft zu Rechtsstreit führen. Selbst wenn eine öffentliche Domain verwendet wird, ist es trotzdem eine bewährte Verfahrensweise seine Arbeit in einem Herkunftsdokument einzutragen. Diese Art von Dokument ist vergleichbar zum Literaturverzeichnis in einem wissenschaftlichen Artikes, in dem die Ideen und Autoren dokumentiert sind. Obwohl es kein "standardisiertes" Verfahren gibt, ist die beste Methode nicht nur die Quelle und den Zugriffszeitpunkt zu dokumentieren, sondern auch die Lizenzen der einzelnen Komponenten. Falls Sie ein Beispiel dafür wünschen, können Sie sich gerne den Zitierabschnitt [in dieser Grafikübersicht](https://busy.org/@nothingismagick/qcensus2018-campaign-graphics-breakdown) ansehen, der im @utopian-io Stil geschrieben ist.

> Das Letzte, was man möchte, ist ein Rechtsstreit, der unnötig Zeit und Geld verschwendet. Wenn Sie zu einem Open-Source-Projekt beitragen, stellen Sie sicher, dass Sie dieses nicht unnötig in Gefahr bringen. Bei Quasar können Sie vergewissert sein, dass die Kunstabteilung dies SEHR ernst nimmt und Verstöße gegen dieses Vertrauen zum Blacklisting oder Bann führen können.

## Lizenztypen

### Wesentliche Lizenzen für Code

Diese Einführung kann unmöglich die feinen Unterschiede zwischen all den verschiedenen Lizenzen für Code erklären, da es Dutzende verschiedene gibt. Eine Lizenz wird einem Code hinzugefügt, indem eine Quelle entweder im Header der zu lizenzierenden Datei, im Falle von Distributables, in einer LIZENZ-Datei im Root-Level des Repository, im README des Projektes, oder möglicherweise in der package.json (falls node verwendet wird) eingefügt wird.

Falls Sie die letzten Kapitel übersprungen haben, ist hier eine kurze Zusammenfassung der drei Haupt-Lizenztypen und ein beliebtes Beispiel für jeden, sowie zwei Links, die das Thema detaillierter analysieren.

- **Offen**: [MIT](http://www.opensource.org/licenses/MIT)
- **Geschützt**: [GPL-3](https://www.gnu.org/licenses/gpl-3.0.en.html)
- **Öffentliche Domain**: [WTFPL](http://www.wtfpl.net/)
- [Githubs Lizenzhelfer](https://choosealicense.com/)
- [Die vollständige Liste der GNU Foundation](https://www.gnu.org/licenses/license-list.html)

> Beim Quasar Framework müssen alle Beiträge zur Kernbibliothek MIT sein. Durch das Beitragen stimmen Sie dieser Lizenz zu.

### Wichtige Lizenzen für Text / Dokumentation

Text und Dokumentation ist ebenfalls eine kreative Arbeit und ist generell auch durch Urheberrechtsgesetze geschützt. Sie können diese Rechte auf Dritte oder Projektinhaber, denen Sie Ihren Beitrag geben möchten, übertragen, in dem Sie entweder eine Creative Commons Quelle oder eine Lizenz für die freie Dokumentation wählen.

Es gilt als bewährte Methode, die Lizenz und die Autoren am Ende des lizenzierten Dokuments zu nennen.

- [Creative Commons](https://creativecommons.org/)
- [Lizenz für freie Dokumentation](https://www.gnu.org/licenses/fdl.html)

> Beim Quasar Framework sind (oder werden) alle Dokumentationen unter dem FDL lizenziert.

### Lizenzierung für Kunstwerke / Design / Video

Es gibt buchstäblich so viele Rechtsvorschriften für diese Art des Beitrags, wie Länder auf dem Planeten und es ist daher völlig unangemessen ins Detail zu gehen, welche Dinge von Nation zu Nation unterschiedlich sind. Egal was passiert, die Person, die das Bild erstellt hat, kann nie das Recht verlieren, zu sagen, dass sie der Eigentümer ist (es sei denn, ein absolut drakonischer Vertrag verhindert es - und in einigen Fällen wird dies vor Gericht nicht standhalten). Aus diesem Grund gibt es eine gemeinsame Regel, die lautet: Nennen Sie den Autor und die Lizenz. Wenn Sie das nicht können, dann verwenden Sie das Asset nicht.

Je nachdem, wo und wie der Beitrag verwendet wird, gibt es eine Reihe von Möglichkeiten, in denen dieses Zitat genannt werden kann:

1. Benennen Sie die Datei entsprechend
2. Setzen Sie Lizenzinformationen als Wasserzeichen in die Datei
3. Fügen Sie die Informationen in die Metadaten der Datei ein
4. Zitieren Sie Bildquellen / -lizenzen direkt nach dem Bild, wenn möglich
5. Setzen Sie diese Informationen in eine Fußnote / Endnote / verlinktes Dokument
6. Platzieren Sie Lizenzinformationen oder Lizenzen und Freigabe-Form-Deckblätter im Repository im selben Ordner wie das Bild, oder einem anderen zugewiesenen Speicherort

Übliche Lizenzen für Bilder / Designs / Videos sind:

- [Creative Commons](https://creativecommons.org/)
- [Öffentliche Domain: WTFPL](https://creativecommons.org/share-your-work/public-domain/cc0/)
- [Apache v2](https://apache.org/licenses/LICENSE-2.0)

> Quasar bevorzugt CC-BY oder CC0 Lizenzen.

### Schriftart-Lizenzen

Für die hunderten, auf [Google Fonts](https://fonts.google.com/attribution) aufgelisteten, Schriftarten werden genau zwei verschiedene Lizenzen verwendet: Entweder die Apache-Lizenz v2, oder die SIL Open Font Lizenz v1.1. Die große Mehrheit sind OFL, welche im Grunde die gleiche Art von offener Lizenz ist wie MIT.

Wenn Sie eine Schriftart verwenden, müssen Sie sicherstellen, dass Sie wirklich die Lizenz dafür haben, da einige professionelle Font-Forges verschiedene Arten von Lizenzen, je nach Anwendung, verkaufen. (Wie eine Lizenz für Desktop-Publishing, eine andere für Webseiten, usw.) Wenn Sie eine Open-Source-Schriftart verwenden, ist die bewährte Methode, die Lizenz in den Ordner zu legen, in dem Sie Ihre Schriftarten aufbewahren.

Darüber hinaus bieten einige Dienste, wie FontSquirrel, einen [WebfontGenerator](https://www.fontsquirrel.com/tools/webfont-generator), der es Designern ermöglicht eine Reihe von Schriftart-Dateien zu erstellen, sodass einzelne Browser die Schriftart auswählen können, für dessen Nutzung sie am besten ausgerüstet sind. Dies setzt voraus, dass Sie die Rechte haben, Schriftarten in andere Formate zu konvertieren. Die SIL OFL lässt dies zu. Wenn Sie keine Lizenz finden können, gehen Sie davon aus, dass Sie nicht das Recht haben diese Schriftart zu verwenden.

- [OFL-FAQ web version (1.1-update5)](https://scripts.sil.org/cms/scripts/page.php?item_id=OFL-FAQ_web)

# Abschließende Worte

Nur weil Sie Ihre Arbeit für die Zusammenarbeit mit anderen "öffnen", ist dies nicht das Ende der Geschichte. Nur weil Sie eine Creative Commons-Lizenz auf eine Photoshop-Datei kleben, bedeutet das nicht, dass sie offen und kostenlos ist. Der Grad der Offenheit eines Assets oder Projekts wird auch durch das Betriebssystem und die, für das Verwenden der Datei benötigte, Software bestimmt. Bitte erwägen Sie, nicht nur die Ergebnisse Ihrer Arbeit zu veröffentlichen, sondern auch andere über Ihren Arbeitsweg zu informieren.

Darüber hinaus verwenden Sie bitte keine Software-Raubkopien bei der Arbeit an Open-Source-Projekten. Dies ist nicht nur "uncool" und schädlich für die Ehre der gesamten Open-Source-Community, Sie gefährden auch sich und Ihre Kollegen, vor allem wenn Sie wertvolle Anmeldeinformationen haben, wie Server-Logins etc. Es gibt keinen besseren Weg für Sie (und wahrscheinlich Ihr Team), um gehackt zu werden, als Cracks zu verwenden.

# Weitere Ressourcen

Für den Fall, dass Sie tiefer in dieses Thema eintauchen möchten, haben wir ein paar zusätzliche Ressourcen hinzugefügt, die wir sehr empfehlen:

- Stallmans Unterscheidung zwischen [FLOSS und FOSS](https://www.gnu.org/philosophy/floss-and-foss.en.html)
- Dieses Kapitel des [ZeroMQ Guide](http://zguide.zeromq.org/page:all#toc141) beschreibt sehr ausführlich die Steuerung in Open-Source-Projekten und gibt konkrete Beispiele aus der Community

#### Nachweis der Arbeit (Autorschaft)

Die Originalversion dieses Artikels wurde zusammengestellt und geschrieben von @nothingismagick https://github.com/nothingismagick

#### Lizenz

Diese Arbeit und alle Derivate sind [lizenziert unter der GNU FDL 1.3](https://github.com/nothingismagick/quasar-articles/blob/master/LICENSE).

> Mit [StackEdit](https://stackedit.io/) geschrieben.
