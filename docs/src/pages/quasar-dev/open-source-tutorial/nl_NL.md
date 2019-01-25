*Een diepgaande introductie tot Open Source met een aantal specifieke voorbeelden uit de aanpak van het Quasar Framework, omdat we van plan zijn deze tutorial te gebruiken als training en referentie voor alle toekomstige (en bestaande) bijdragers.*

### Repository

https://github.com/nothingismagick/quasar-articles/blob/master/tutorials/openSourceTutorial.md

<center>
  <img src="https://ipfs.busy.org/ipfs/QmNh5ir9k6hrJNZNnhYXKgvMGfAzUPWFiVyDmss2J3kacJ" alt="GPL_MIT_glow.png" /> Afbeelding: CC0 door @nothingismagick
</center>

### Wat wordt er besproken?

> Je leert over Open Source en best-practices om er zeker van te zijn dat je bijdragen aan de eisen voldoen.

#### **Introductie**

- Je leert over het verschil tussen auteursrecht, licenties en attributie
- Je ontdekt de betekenis van "Vrije/Libre en Open Source Software"
- Je ontdekt wat het verschil is tussen "Soepele" en "Beschermende" gebruikslicenties
- Je leert meer over het ontdekken van licenties en licentieovereenkomsten
- Je leert hoe je code en andere middelen die open source zijn kunt gebruiken

#### **Je identiteit en rechten**

- Je leert over "Geheimhoudingsverklaringen" (Non-Disclosure Agreements, NDA)
- Je leert over Bijdragerslicentieovereenkomsten (Contributor License Agreements, CLA)
- Je leert hoe je een "geverifieerde" bijdrager kunt worden
- Je leert waarom "ontwikkelaarscertificaten van oorsprong" worden gebruikt
- Je leert wat "signed-off-by" betekent
- Je leert over "vrijgave"-formulieren
- Je leert over "herkomst"

#### **Licentiesoorten**

- Licenties voor code
- Licenties voor tekst / documentatie
- Licenties voor artwork / ontwerp / video
- Licenties voor lettertypen

### Vereisten

- Je moet goed Engels kunnen lezen
- Een basisbegrip van `git` 
- Kennis van bestandstypen die relevant zijn voor je werkterrein 

### Moeilijkheidsgraad

- Basis tot gemiddeld

# Tutorial Inhoud

> Deze tutorial is een primer voor degenen die geïnteresseerd zijn in het leveren van een bijdrage aan open source-projecten. Het kan ook nuttig zijn voor actieve bijdragers die altijd nieuwsgierig waren naar geavanceerde onderwerpen. En ten slotte, omdat licenties zeer omstreden kunnen zijn, is dit ook een tekst voor degenen die een discussie willen aangaan over open source. Hoewel we gebruik maken van specifieke voorbeelden uit het "Quasar Framework" zijn deze vraagstukken relevant voor het hele spectrum van open source-softwareontwikkeling.
> 
> Onze hoop is dat je meer inzicht krijgt in alle grote zaken (en potentiële valkuilen) rondom licenties in de wereld van open source-software. De introductie is een geweldige plek om te beginnen, aangezien het een aantal termen definieert waar deze tutorial voortdurend naar zal terugverwijzen. Het zal je ook leren over een aantal eenvoudige methoden om ervoor te zorgen dat je bijdragen in overeenstemming zijn met het licentiesysteem van het project waar je mee werkt. Dan begint er een discussie over jou, de bijdrager, en de rechten en verantwoordelijkheden die je hebt. Tot slot zal het dieper ingaan op verschillende domeinen van licenties, waaronder code, kopie, ontwerp en lettertypen.

## Voorwoord

> Sommige software heeft broncode die alleen de persoon, het team of de organisatie die het heeft gemaakt - en de exclusieve controle erover behoudt - kan wijzigen. Mensen noemen dit soort software "proprietary" of "closed source" software. ... Open source software is anders. De auteurs [maken de broncode beschikbaar](https://opensource.com/business/13/5/open-source-your-code) voor anderen die de code willen bekijken, kopiëren, ervan willen leren, veranderen, of delen. [LibreOffice](https://www.libreoffice.org/) en het [GNU Image Manipulation Program](http://www.gimp.org/) zijn voorbeelden van open source-software.

https://opensource.com/resources/what-open-source

Elke daad van creativiteit kan worden toegeschreven aan iemand of aan een groep mensen die samenwerken. Eigenlijk is het vrij gek om te denken dat iets in een vacuüm bestaat. We zijn allemaal met elkaar verbonden en ideeën zijn dingen die vaak een eigen leven gaan leiden. In deze moderne tijd zijn veel mensen echter begonnen hun ideeën te beschermen tegen diefstal door ze weg te geven - door hun werk te publiceren, zodat andere mensen in staat worden gesteld en uitgenodigd om bij te dragen aan het project - of het zelfs in een heel andere richting te nemen.

Vergelijkbaar met de manier waarop gilden in de afgelopen eeuwen hun handelsgeheimen beschermden, kan het excuus van een "proprietary" bescherming van ideeën en een verankering van "closed source" in wetgeving en vrijhandelsakkoorden direct worden teruggevoerd op veel van de problemen die het turbo-kapitalisme op onze planeet heeft losgelaten. Maar weet je wat - er is iets wat je kunt doen. Je kunt deelnemen aan de open source-beweging.

## Introductie

### Auteursrecht, licenties an attributie

Het is algemeen geaccepteerd in de moderne democratische samenleving dat een kennisgeving van het auteursrecht vereist is als voorwoord voor alle licenties, omdat iemand verantwoordelijk moet zijn voor het verklaren van de manier waarop het ding dat gelicenseerd wordt kan worden gebruikt. In een vreemde (maar op de een of andere manier logische) wending, als je je werk als Public Domain of Copyleft wilt delen, moet je eerst verklaren dat je de eigenaar van je werk bent (en dat iedereen die eraan heeft bijgedragen het op dat punt met je eens is).

Zodra een auteursrecht is verklaard, kan de auteursrechthebbende lezers en gebruikers van de code / tekst / kunst informeren onder welke omstandigheden het gepast is te gebruiken. Het maakt niet uit welke licentie-aanpak de oorspronkelijke auteur / auteursrechthebbende ook kiest, het is altijd gepast om kopieën van deze licenties te bewaren in de repository waar uw werk wordt gehost, mocht het gebruik maken van werken van derden met een open source-licentie. Het is nooit toegestaan om licentiebestanden of licentieverwijzingen in de headers of metadata van bronbestanden te verwijderen of te bewerken - want dat is letterlijk stelen en een vorm van plagiaat.

Zolang "consumenten" van je gebouwde artefacten (website, app, etc.) op de hoogte zijn van waar zij de licenties van de projecten van derden kunnen zien die je gebruikt hebt om je project te bouwen, kunt je het verzenden van deze licenties vermijden.

Als je besluit om binnen je werk iets te gebruiken wat door een derde partij is gemaakt, behalve voor werken uit het publieke domein (waarvan ik persoonlijk vind dat je dit ook moet vermelden), ben je verplicht (zowel wettelijk als moreel) om de bron te vermelden. Dit heet **attributie**, en een vuistregel is dat je verwijzingen moet opnemen naar alle code die je gebruikt. We zullen hier later in de tutorial dieper op ingaan, omdat er verschillende vereisten zijn, afhankelijk van het domein van de bron die wordt geattribueerd.

### "Free/Libre en Open Source-Software"

> De term "open source" verwijst naar iets wat mensen kunnen aanpassen en delen omdat het ontwerp ervan openbaar toegankelijk is.
> 
> https://opensource.com/resources/what-open-source

Er is een voortdurende discussie door FLOSS (Free/Libre en Open Source-Software) hardliners over de mate van **vrijheid** die inherent is aan "open" source - en zelfs wat **free** betekent. Maar het is waarschijnlijk een goed idee om terug te gaan in de tijd tot 1998 en [dit artikel te lezen](https://opensource.com/article/18/2/coining-term-open-source-software) van de vrouw die met de term "open source" kwam: Christine Peterson. Hoewel Richard Stallman en Linus Torvalds twee van de meest succesvolle, zichtbare en vocale voorstanders van de zaak zijn; het punt is dat, hoewel de term begon als een "marketing device", het bleef hangen en het leven van iedereen op de planeet - aantoonbaar ten goede - veranderde.

Stallman en de "Free Software Foundation" (FSF), die waarschijnlijk het langst bestaan, zullen vrijheid definiëren als een belangrijk onderdeel van open source, omdat je vrijheid om de code te gebruiken en te veranderen ook een verantwoordelijkheid is die je draagt in naam van de hele gemeenschap.

<center><strong>Wat is vrij? Wat is libre?</strong></center>

Als men even voorbijgaat aan het vervelende feit dat *free* ook betekent "kost geen geld" (wat het belangrijkste argument was om het woord libre toe te voegen), is er nog steeds een onopgelost semantisch probleem, wat waarschijnlijk nooit zal worden opgelost:

Afhankelijk van je perspectief is de Gnu Public License niet ABSOLUUT vrij, omdat het wordt geleverd met de eis dat je wijzigingen die je aanbrengt in de code terug moet geven aan de gemeenschap - en vrij zijn zou betekenen dat je kunt beslissen hoe je te werk gaat en wat je doet met de code die je gebruikt. Tegelijkertijd en op een ander spectrum zijn er mensen die de MIT-licentie niet helemaal vrij vinden. Ze vinden dit omdat er omstandigheden zijn waarin de code op geoorloofde wijze kan worden gewijzigd en niet aan de gemeenschap kan worden teruggegeven - in zekere zin "gevangenneming" van de code.

> Er is hier geen goed of fout antwoord, want het is een kwestie van perspectief - maar elke ontwikkelaar en elke organisatie moet zelf beslissen waar ze de aandacht op willen richten. In het Quasar Framework zijn we geen puristen in de zin dat we geloven dat Code op zichzelf een spiritueel wezen is dat overdraagbare rechten verdient. Als we misschien aan de Linux-kernel zouden werken zou dat anders kunnen zijn - maar we zijn meer bezig met de menselijke kant van code en geloven dat de mensen die ons project gebruiken de ultieme keuzevrijheid moeten hebben om te doen wat ze willen. Daarom hebben we gekozen voor de "soepele" aanpak en hebben we gekozen voor de MIT-licentie.

Er is vaak veel discussie over "hoe vrij om de code te maken". Ik stel voor dat je jezelf vier vragen stelt:

1. Werk je liever alleen?
2. Maak je je zorgen over mensen die je idee stelen?
3. Heb je alle code zelf geschreven, inclusief de bibliotheken?
4. Heb je enige vorm van een geheimhoudingsverklaring getekend met betrekking tot het werk in kwestie?

Als je **nee** hebt geantwoord op een van deze vragen, dan is het gebruik van een open source-licentie voor je werk een goede optie.

Als je **ja** op al deze vragen hebt geantwoord, dan is het overwegen van het licenseren van je werk als open source waarschijnlijk nog steeds een van de beste manieren om je werk te beschermen en ervoor te zorgen dat het een impact heeft op de rest van de wereld. Denk maar zo: als alle software om je heen niet open source was, zou je dan nog steeds kunnen werken zoals je dat doet? Ben je het niet aan de gemeenschap verplicht om je werk te delen?

### Soepel versus Beschermend licenseren

Een van de meest voorkomende misvattingen over het licenseren van je project met GPL is dat het bedrijven ervan weerhoudt om je idee te pakken en het te gebruiken om geld mee te verdienen - en dat alles zonder jou enige winst te geven. Dit is overduidelijk onwaar. Als iemand je code wil stelen en de wet wil overtreden, zal hij of zij dat toch doen. Als een bedrijf jouw GPL-bibliotheek wil gebruiken, kan het deze isoleren van de rest van het systeem en niets van hun eigen code onthullen. Zij kunnen je code pakken, reverse-engineeren en herschrijven. Als dit je grootste zorg is, stop dan, ga terug naar het begin van deze tutorial en lees zorgvuldig om te beslissen of je wilt deelnemen aan open source - of er alleen maar van wilt profiteren.

MIT, BSD en Apache zijn wat de open source-softwaregemeenschap "soepele" licenties noemt. Soepel betekent dat de auteur je veel rechten geeft om de software die ze delen te gebruiken, zelfs het recht om het te gebruiken voor het maken van winst en om het aan te passen aan je intenties. Zolang je kopieën van de originele licentie bewaart en de geïnteresseerden ervan op de hoogte brengt dat je die specifieke software gebruikt, kun je alles doen met de code - zelfs de code wijzigen en niemand vertellen dat je dat hebt gedaan.

> Copyleft is de praktijk van mensen het recht te bieden om vrijelijk kopieën en gewijzigde versies van een werk te verspreiden met de bepaling dat dezelfde rechten behouden blijven in [afgeleide werken](https://en.wikipedia.org/wiki/Derivative_works) die later worden gemaakt. https://en.wikipedia.org/wiki/Copyleft

Dit type van "beschermende" licenties gaat verder dan de "soepele" licenties zoals we zien met MIT en APACHE door te proberen de code en de rechten van de gemeenschap te beschermen. Alle wijzigingen aan de broncode moeten worden teruggegeven aan de gemeenschap, en je mag de code niet in sublicentie geven. GPL en CC-SA zijn twee licenties die op deze manier werken.

### Licenties ontdekken en licentievereisten

Het gebruik van open-source software in je projecten is geweldig, maar je moet zorgvuldig blijven, vooral wanneer je een bijdrage levert aan een ander project. En dit geldt dubbel als je verplicht bent om te rapporteren over de naleving van licenties (bijvoorbeeld in het geval van openbare instanties of binnen juridische firewalls van bedrijven). In ieder geval kan het een beetje een gedoe zijn om alle licentiebestanden handmatig te doorlopen en op te sporen.

Er zijn een paar projecten die deze ontdekkingskwestie behandelen, zoals [nlf](https://www.npmjs.com/package/nlf) en [https://fossa.io/](https://fossa.io/ "https://fossa.io/") en specifiek [hun gratis **CLI** dat geen registratie](https://github.com/fossas/fossa-cli) vereist.

    $ nlf --summary detail > nlf.txt
    

[Hier is een rapport gemaakt van de Quasar versie-controle met de **nlf**-benadering.](https://raw.githubusercontent.com/nothingismagick/quasar-articles/master/tutorials/nlf_report_licenses_quasar.txt.md)

Als je een licentierapport gegenereerd door de **fossa CLI** in je versie-controle wilt zien kun je na het volgen van hun installatie-instructies gewoon dit commando gebruiken:

    $ fossa report licenses > fossa.txt
    

[Hier is een rapport gemaakt van de Quasar versie-controle met behulp van de **fossa cli** aanpak.](https://raw.githubusercontent.com/nothingismagick/quasar-articles/master/tutorials/fossa_report_licenses_quasar.txt.md) Zoals je kunt zien, gebruiken de meeste modules de MIT-licentie, maar een aantal zijn niet duidelijk uit het rapport alleen: 15 van de projecten werden niet automatisch gedetecteerd door **fossa**. Ik volgde elk van de links, volgde hun licenties, en maakte niet alleen een aantekening van de licentie, maar ook dat ik degene was die het deed.

Verder ontdekte ik dat slechts één van onze bibliotheken (stylint) een GPL-licentie nodig heeft, maar de ontwikkelaars hebben een licentieconflict in de verklaring in de package.json (GPL-2) en het eigenlijke licentiebestand (GPL-3).

Dat is wat jij ook moet doen. Indien een licentiebestand niet in het project is opgenomen en je kunt er geen vinden, is het verstandig om contact op te nemen met de auteur.

**Een waarschuwing**: Deze geautomatiseerde systemen zijn niet waterdicht (zo kan een module over licentiedetectie meerdere licenties detecteren, ook al gebruikt hij zelf een andere licentie). Als je gebonden bent aan de naleving van regelgeving, moet je ze allemaal met de hand doornemen - en wees niet bang om de auteur te benaderen als je opheldering nodig hebt - of zelfs een andere licentie. Dit is soms mogelijk. Vergeet niet dat het beter is om toestemming te vragen dan om vergeving.

### Gebruik van open source

Als je iets gebruikt dat open source is, moet je het gebruik ervan verklaren en de originele licenties gemakkelijk toegankelijk maken. Als je bijvoorbeeld node-modules gebruikt in je project, dan zijn deze licenties beschikbaar in de broncode van het project wanneer iemand de projectbestanden downloadt en de afhankelijkheden "installeert". Je kunt het meestal vinden als een bestand met de naam `LICENSE` in de hoofdmap of in het veld "license" in de `package.json`

Over het algemeen is dit voldoende, maar als je wijzigingen aanbrengt in de oorspronkelijke bibliotheek, kan het zijn dat je verplicht bent om deze wijzigingen te melden en/of terug te sturen naar de gemeenschap. Dit is afhankelijk van het type licentie, maar we behandelen de licentie-specificaties in het laatste deel.

> **Stack Overflow**: Een veelvoorkomende valkuil is het kopiëren en plakken van dingen die je op stackoverflow.com vindt - maar dit is gevaarlijk, want ook al wordt gesuggereerd dat de gebruiker deze informatie deelt, je weet niet met 100% zekerheid dat het gepast (of toegestaan) is om de voorbeeld-code 1 op 1 te gebruiken. De gangbare praktijk van het citeren van de bron is beter dan niets, maar je moet echt overwegen om het voorbeeld te herschrijven zodat het past bij je codestijl, de behoeften van je project EN de bron als "inspiratie" te noemen.

## Je identiteit en rechten

### Wat is een "geheimhoudingsovereenkomst" (NDA)

Een geheimhoudingsovereenkomst is een contract dat je mogelijk moet ondertekenen als je werkt met een organisatie die bedrijfsgeheimen te beschermen heeft. Als ondertekenaar van de NDA ben je vanwege het contract verplicht tot geheimhouding van de informatie die je hebt ontvangen, en het kan clausules bevatten over niet-concurrentiebeding in een soortgelijke sector gedurende een bepaalde periode. Hoewel dit over het algemeen ongewoon is in de open source-industrie, kan het nodig zijn als je toegang krijgt tot "geheimen" zoals API-sleutels, logins en dergelijke.

> Als je een NDA krijgt voorgelegd is het, zoals bij elk contract, verstandig om alles te lezen, vragen te stellen en een advocaat om advies te vragen. Quasar zal nooit vereisen dat je een NDA ondertekent.

### Wat is een "Bijdragerslicentieovereenkomst" (CLA)

Een bijdragerslicentieovereenkomst is een contract tussen de eigenaar van een project en de codebijdragers. In tegenstelling tot een NDA (die restrictief is), is een CLA "wederkerig" in die zin dat zij er eigenlijk is om de rechten van zowel de eigenaar als de bijdrager te beschermen. Met een CLA geven bijdragers expliciet toestemming aan de eigenaar om de bijdrage te gebruiken, en eigenaars geven de bijdrager expliciet toestemming om hun bijdragen naar eigen inzicht te gebruiken.

Veel ontwikkelaars vinden een CLA echter problematisch vanwege de rechten die zij aan de eigenaar toekennen, waaronder de mogelijkheid om de licentie van de code te wijzigen. [Hier vind je een geweldige uitleg van gitlab](https://about.gitlab.com/2017/11/01/gitlab-switches-to-dco-license/) over waarom ze zijn overgestapt van een CLA naar een DCO - en hier is hun [ diepgaande analyse vanuit een projectmanagementperspectief](https://docs.google.com/a/gitlab.com/document/d/1zpjDzL7yhGBZz3_7jCjWLfRQ1Jryg1mlIVmG8y6B1_Q/edit?usp=sharing).

### Wat is een "Ontwikkelaarscertificaat van Oorsprong" (DCO)

Een ontwikkelaarscertificaat van oorsprong is een wettelijke verklaring van een bijdrager waarin hij/zij verklaart dat hij/zij zelf de bijdrage heeft geschreven en dat hij/zij wettelijk bevoegd is om deze code bij te dragen. Net als bij het Gitlab-voorbeeld hierboven, wordt dit meestal gemaakt in combinatie met een licentie zoals MIT of Apache. Je kunt de volledige licentie hier lezen (het is kort): https://developercertificate.org/

Door de `-getekend door` vlag toe te voegen aan je git-commit, zeg je dat je handelt in overeenstemming met de DCO. Hoewel het niet voor elke commit nodig is, is het wel aanwezig om te voorzien in een soort "schuldige-keten" voor het geval er iets mis gaat. Best practice suggereert de echte naam van de bijdrager te gebruiken. Meer informatie over de details hiervan kun je hier lezen: https://stackoverflow.com/a/1962112

Sommige IDE's, zoals [Webstorm](https://www.jetbrains.com/help/webstorm/2017.2/using-git-integration.html#commit), bieden je de mogelijkheid om deze vlag direct vanuit het commit-venster toe te voegen wanneer je je code bekijkt. Het zal de volgende regel toevoegen aan het einde van het commit-bericht: `Getekend door: <username>`

Let op, als de managers van het project waaraan je werkt je vragen om af te tekenen, controleer dan of ze echt willen dat je aftekent bij elke commit, of dat het genoeg is om af te tekenen op tags of PR's. Technisch gezien is de persoon die de samenvoeging uitvoert degene die moet aftekenen, maar door je naam aan de individuele commits toe te voegen wordt het duidelijk wie werkelijk verantwoordelijk was voor welke veranderingen. Het is een kwestie van voorkeur.

> Bij Quasar vragen wij je om alle commits af te tekenen.

### Word een "geverifieerde" bijdrager

Geverifieerde bijdragers op Github of Gitlab zijn ontwikkelaars die een GPG-sleutel aan hun account hebben toegevoegd en deze GPG-sleutel gebruiken om hun commits te ondertekenen. Hoewel het niet nodig is voor integratie, kunnen sommige projectmanagers het nodig hebben - vooral omdat het makkelijker is om iemands inloggegevens te stelen en een kritieke versie-controle aan te passen dan om hun GPG-sleutel te stelen.

De volgende links laten je zien hoe je een GPG-sleutel kunt maken en kunt gebruiken met Github of Gitlab, indien nodig.

- [Een GPG-sleutel toevoegen aan Github](https://help.github.com/articles/adding-a-new-gpg-key-to-your-github-account/)
- [Commits ondertekenen op Gitlab](https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/index.html)
- https://blog.github.com/2016-04-05-gpg-signature-verification/
- https://stackoverflow.com/questions/10161198/is-there-a-way-to-autosign-commits-in-git-with-a-gpg-key

### Wanneer moet ik "release"-formulieren krijgen

Een release-formulier is over het algemeen vereist voor het maken van foto's van personen en privé-eigendommen - en het gebruik ervan voor niet-particuliere doeleinden. Hoewel de specifieke regels verschillen van jurisdictie tot jurisdictie, is het erg belangrijk dat je mensen een release-formulier laat ondertekenen, en als het duidelijk is waar de foto is genomen kan het nodig zijn om toestemming van de eigenaar te krijgen.

> Een slimme manier om met een release-formulier voor mensen om te gaan (als ze je echt willen ondersteunen) is een zogenaamd "wederkerig loon". Voorafgaand aan de fotoshoot bereid je twee betaalbewijzen voor. Op één betaalbewijs betaal je hem/haar bijvoorbeeld 5 EUR als model. Op het andere betaalbewijs betalen zij jou bijvoorbeeld 5 EUR voor een kopie van de foto. De regel (kreeg het geld, bewaar de kopie) is van toepassing, dus elke partij heeft een origineel betaalbewijs en een kopie van het betaalbewijs. Je stuurt ze een digitale kopie van de uiteindelijke afbeelding als link naar het open source-depot waar het gebruikt is, en noteert dit op de kopie van het betaalbewijs dat ze je hebben gegeven. Bewaar dit in je eigen administratie, en iedereen is blij.

Als je foto's gebruikt van mensen die jij hebt gemaakt en ze indient voor open source-projecten, moet je kunnen bewijzen dat de persoon je toestemming heeft gegeven en moet je hun release-formulier in het bestand en beschikbaar houden.

### Hoe kan ik "herkomst" documenteren

Herkomst is een woord dat de geschiedenis van een werk beschrijft. Code die wordt gedeeld onder een open source-licentie en binnen de context van een git-repository documenteert min of meer zichzelf. Beelden zijn minder voor de hand liggend, en het is vooral lastig bij digitale collages die een aantal bronnen combineren.

De omgang met herkomst van ontwerpers is belangrijk, omdat de rechten op visuele beelden fel worden bestreden en vaak leiden tot juridische gevechten. Zelfs als er alleen publieke domein-bronnen worden gebruikt, is het nog steeds een goede gewoonte om je werk vast te leggen in een herkomstdocument. Dit type document is als de bibliografie in een wetenschappelijk artikel, waarin de ideeën en auteurs zijn vastgelegd. Hoewel er geen "gestandaardiseerde" aanpak is, is de beste methode om niet alleen de bronnen en de tijden waarop ze zijn geraadpleegd vast te leggen, maar ook de licenties voor elk onderdeel op te sporen. Als je hier een voorbeeld van wilt hebben, kijk dan gerust naar de sectie citaten [in deze uitsplitsing van een afbeelding](https://busy.org/@nothingismagick/qcensus2018-campaign-graphics-breakdown) geschreven in de @utopian-io stijl.

> Het laatste wat iedereen wil is een juridische strijd omdat het middelen als tijd en geld uitput. Als je bijdraagt aan een open source-project, zorg er dan voor dat je ze niet in de problemen brengt. Bij Quasar, kun je er zeker van zijn dat de kunstafdeling dit zeer serieus neemt en dat schendingen van dit vertrouwen waarschijnlijk zullen leiden tot een plek op de zwarte lijst of een ban.

## Licensiesoorten

### Belangrijkste licenties voor code

Deze inleiding kan onmogelijk de subtiele verschillen tussen alle verschillende licenties voor code uitleggen, want er zijn er tientallen. Een licentie wordt aan de code toegevoegd door er een verwijzing naar te plaatsen in de header van het bestand dat gelicenseerd wordt in het geval van distributables, in een LICENSE-bestand in het root-niveau van een repository, in de LEESMIJ over het project of mogelijk in de package.json (als er een node gebruikt wordt).

Als je vooruit bent gesprongen en de eerdere hoofdstukken niet hebt gelezen, dan is hier een snelle samenvatting van de drie belangrijkste licentietypen en een populair voorbeeld van elk, samen met twee links die verder gaan in detail en analyse.

- **Soepel**: [MIT](http://www.opensource.org/licenses/MIT)
- **Beschermend**: [GPL-3](https://www.gnu.org/licenses/gpl-3.0.en.html)
- **Publiek Domein**: [WTFPL](http://www.wtfpl.net/)
- [Github's Licentiehulp](https://choosealicense.com/)
- [De uitputtende lijst van de GNU Foundation](https://www.gnu.org/licenses/license-list.html)

> In het Quasar Framework moeten alle bijdragen aan de kernbibliotheken MIT zijn. Door iets bij te dragen, ga je akkoord met deze licentie.

### Belangrijke licenties voor tekst / documentatie

Tekst en documentatie is ook een creatief werk en wordt over het algemeen ook beschermd door het auteursrecht. Je kunt deze rechten overdragen aan derden of aan projecteigenaren aan wie je jouw bijdragen levert door te kiezen voor een Creative Commons-bron of de Free Document License.

Het wordt als best practice beschouwd om de licentie en de auteur(s) te noemen aan het einde van het document waarvoor de licentie wordt verleend.

- [Creative Commons](https://creativecommons.org/)
- [Free Documentation License](https://www.gnu.org/licenses/fdl.html)

> Bij het Quasar Framework is (of wordt) alle documentatie gelicenseerd onder de FDL.

### Licenseren van kunstwerk / ontwerp / video

Er zijn letterlijk evenveel wettelijke regels voor dit soort bijdragen als er landen op aarde zijn, dus het is absoluut ongepast om in detail te treden over hoe de zaken van land tot land verschillen. Hoe dan ook, de persoon die het beeld heeft gemaakt kan nooit het recht verliezen om te zeggen dat hij of zij de eigenaar was (tenzij een absoluut draconisch contract dit verhindert - en in sommige gevallen zal dit geen stand houden in een rechtbank). Dit is de reden waarom er één algemene regel is die geldt: vermeld de auteur en noem de licentie. Als je dat niet kunt doen, gebruik het dan niet.

Afhankelijk van waar en hoe de bijdrage zal worden gebruikt, zijn er een aantal manieren waarop die verwijzing kan worden gemaakt:

1. Noem het bestand naar behoren
2. Zet licentie-informatie in een watermerk in het bestand
3. Injecteer de informatie in de metadata van het bestand
4. Vermeld de afbeeldingsbronnen/licenties zo mogelijk direct na de afbeelding
5. Zet dezelfde informatie in een voetnoot / eindnoot / gelinkt document
6. Plaats licentie-informatie of licenties en release-formulieren in de repository in dezelfde map als de afbeelding of een andere gedelegeerde locatie

Veelgebruikte licenties om te gebruiken voor afbeeldingen / ontwerpen / video's zijn:

- [Creative Commons](https://creativecommons.org/)
- [Publiek Domein / CC0](https://creativecommons.org/share-your-work/public-domain/cc0/)
- [Apache v2](https://apache.org/licenses/LICENSE-2.0)

> Quasar geeft de voorkeur aan CC-BY of CC0-licenties.

### Lettertype-licenties

Van de honderden lettertypen in [Google Fonts](https://fonts.google.com/attribution) zijn er precies twee verschillende licenties gebruikt: Ofwel de Apache License v2, ofwel de SIL Open Font License v1.1. De overgrote meerderheid is OFL, en het is in principe hetzelfde type soepele licentie als MIT.

Als je een lettertype gebruikt, moet je er zeker van zijn dat je er echt een licentie voor hebt, aangezien sommige professionele lettertype-webshops verschillende soorten licenties zullen verkopen, afhankelijk van de toepassing. (Zoals een licentie voor desktop-publicaties, een andere voor websites, enz.) Als je een open source-lettertype gebruikt, is het de beste praktijk om een kopie van de licentie te plaatsen in de map waar je je lettertypen onderhoudt.

Bovendien bieden sommige diensten zoals FontSquirrel een [WebfontGenerator](https://www.fontsquirrel.com/tools/webfont-generator) aan die ontwerpers in staat stelt om een set lettertype-bestanden te maken zodat individuele browsers het type kunnen selecteren waar ze het best voor zijn uitgerust om te gebruiken. Ze vereisen dat je controleert of je het recht hebt om het lettertype te converteren naar andere formaten. De SIL OFL staat dit wel toe. Als er geen licentie is die je kunt vinden, ga er dan vanuit dat je niet het recht hebt om het lettertype te gebruiken.

- [OFL-FAQ web versie (1.1-update5)](https://scripts.sil.org/cms/scripts/page.php?item_id=OFL-FAQ_web)

# Laatste woorden

Alleen omdat je je werk "openstelt" voor samenwerking van anderen, is dat niet het einde van het verhaal. Alleen omdat je een Creative Commons-licentie op een photoshop-bestand plakt betekent dit niet dat het open en vrij is. De mate van openheid van een object of project wordt ook bepaald door het besturingssysteem en de software die nodig is om het bestand te gebruiken en/of aan te passen. Overweeg om niet alleen de resultaten van het proces van je werk te publiceren, maar ook om mensen te informeren over hoe je het gedaan hebt.

Bovendien, gebruik alsjeblieft geen illegale software bij het werken aan open source-projecten. Niet alleen is het "uncool" en schadelijk voor de eer van de hele open source-gemeenschap, je brengt jezelf en je collega's in gevaar, vooral als je waardevolle referenties hebt, zoals server logins etc. Er is geen betere manier om jezelf (en mogelijk ook je team) gehackt te laten worden dan met cracks te werken.

# Meer bronnen

Voor het geval dat je dieper op deze onderwerpen in wilt gaan hebben we een paar extra bronnen die we ten zeerste aanbevelen:

- Stallmans onderscheid tussen [FLOSS en FOSS](https://www.gnu.org/philosophy/floss-and-foss.en.html)
- Dit hoofdstuk van de [ZeroMQ Guide](http://zguide.zeromq.org/page:all#toc141) gaat in detail in op beheer in open source-projecten met het specifieke voorbeeld van hun gemeenschap

#### Bewijs van gedaan werk (auteurschap)

De originele versie van dit artikel is samengesteld en geschreven door @nothingismagick https://github.com/nothingismagick

#### Licentie

Dit werk en alle afgeleide producten zijn [gelicenseerd onder de FDL 1.3](https://github.com/nothingismagick/quasar-articles/blob/master/LICENSE).

> Geschreven met [StackEdit](https://stackedit.io/).