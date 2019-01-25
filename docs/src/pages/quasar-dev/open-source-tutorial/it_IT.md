*Un'introduzione approfondita all'Open-Source con alcuni esempi specifici tratti dall'approccio utilizzato dal Framework Quasar, dato che abbiamo intenzione di utilizzare questo tutorial come formazione e riferimento per tutti i futuri (ed esistenti) collaboratori.*

### Repository

https://github.com/nothingismagick/quasar-articles/blob/master/tutorials/openSourceTutorial.md

<center>
  <img src="https://ipfs.busy.org/ipfs/QmNh5ir9k6hrJNZNnhYXKgvMGfAzUPWFiVyDmss2J3kacJ" alt="GPL_MIT_glow.png" /> Image: CC0 by @nothingismagick
</center>

### Di cosa si parlerà?

> Imparerai a conoscere l'Open Source e le migliori pratiche per assicurarti che i tuoi contributi siano conformi.

#### **Introduzione**

- Imparerai la differenza tra diritto d'autore, concessione di licenze e attribuzioni
- Scoprirai il significato di "Software Gratuiti/Liberi e Software Open Source"
- Scoprirai qual è la differenza tra le licenze "Permissive" e "Protettive"
- Imparerai ad individuare la licenza e cosa sono gli accordi per la concessione di una licenza
- Imparerai ad usare il codice e altre risorse che sono open-source

#### **La tua Identità e i tuoi Diritti**

- Imparerai cosa sono gli "accordi di non divulgazione"
- Imparerai cosa sono i "Contratti di Licenza del Collaboratore" (CLA)
- Imparerai come si diventa un collaboratore "verificato"
- Imparerai perché vengono usati i "certificati di origine dello sviluppatore"
- Imparerai cosa significa "firmato da"
- Imparerai cosa sono le “liberatorie”
- Imparerai cosa è la "provenienza"

#### **Tipi di Licenza**

- Licenze per codice
- Licenze per testo / documentazione
- Licenze per opere d'arte / design / video
- Licenze per font

### Requisiti

- Devi saper leggere bene in inglese
- Una conoscenza di base di `git` 
- Conoscenza dei tipi di file rilevanti per il tuo settore di attività 

### Difficoltà

- Tra basilare e medio

# Contenuto del tutorial

> Questo tutorial è un primer per coloro che sono interessati a contribuire ai progetti di tipo open-source. Potrebbe tornare utile anche ai collaboratori attivi che sono sempre stati curiosi riguardo ad argomenti più avanzati. Ed infine, poiché le licenze possono essere un argomento molto controverso, questo è anche un testo per quelli che vogliono intraprendere una discussione riguardante l'open-source. Anche se stiamo usando esempi specifici del "Framework Quasar", le questioni qui contenute sono rilevanti per tutto lo spettro dello sviluppo di software open-source.
> 
> La nostra speranza è che possiate acquisire una visione più approfondita di tutte le grandi cose (e le potenziali insidie) che circondano le licenze nel mondo del software open-source. L'introduzione è un ottimo punto di partenza, in quanto definisce alcuni dei termini su cui questo tutorial tornerà costantemente. Inoltre, ti insegnerà alcuni semplici metodi per assicurarti che i tuoi contributi siano conformi allo schema di attribuzione di licenze adottato dal progetto su cui stai lavorando. Poi, inizia una discussione su di te, il collaboratore, e sui diritti e le responsabilità che hai. Infine, verranno approfonditi i vari domini della gestione delle licenze, tra cui codice, copia, design e font.

## Prefazione

> Alcuni software hanno un codice sorgente che può essere modificato solo dalla persona, dal team o dall'organizzazione che l'ha creato e che detiene il controllo esclusivo su di esso. La gente chiama questo tipo di software "proprietario" o "closed source". ... Il software di tipo open source è differente. I suoi sviluppatori [rendono il relativo codice sorgente disponibile](https://opensource.com/business/13/5/open-source-your-code) per coloro che desiderano visualizzarlo, copiarlo, imparare da esso, modificarlo o condividerlo. [LibreOffice](https://www.libreoffice.org/) e [GNU Image Manipulation Program](http://www.gimp.org/) sono degli esempi di software di tipo open source.

https://opensource.com/resources/what-open-source

Ogni atto creativo può essere attribuito a qualcuno o a un gruppo di persone che lavorano insieme. Effettivamente, è abbastanza sciocco pensare che una qualsiasi cosa possa esistere nel vuoto. Siamo tutti connessi, e le idee sono cose che spesso prendono vita da sole. Tuttavia, attualmente, molte persone hanno iniziato a proteggere le loro idee dal furto rinunciando ad esse - pubblicando il loro lavoro in modo che altre persone vengano incaricate e incoraggiate a contribuire al progetto - o addirittura a portarlo in una direzione completamente differente.

Non diversamente dal modo in cui le corporazioni dei secoli passati proteggevano i loro segreti commerciali, la scusa di una protezione "proprietaria" delle idee e un inglobamento del "closed source" nella legislazione e negli accordi di libero scambio può essere ricondotta direttamente a molti dei problemi che il turbo-capitalismo ha scatenato sul nostro pianeta. Ma indovina un po’ - puoi fare qualcosa. Puoi prendere parte al movimento open-source.

## Introduzione

### Copyright, Assegnazione di Licenze e Attribuzione

Nella nostra società è un usanza comune che un avviso di copyright sia richiesto come prefazione per tutte le licenze, perché qualcuno deve essere responsabile di dichiarare in che modo può essere usata la cosa per cui si sta rilasciando la licenza. In un intreccio strano (ma in qualche modo anche logico), se vuoi condividere il tuo lavoro come di Pubblico Dominio o Copyleft, devi prima dichiarare di essere il proprietario del tuo lavoro (e che tutti coloro che hanno contribuito ad esso sono d'accordo con te su questo fatto).

Una volta che un copyright è stato dichiarato, il titolare del copyright può informare i lettori e gli utilizzatori del codice / testo / opera d'arte in quali circostanze è opportuno utilizzarlo. Indipendentemente dal tipo di approccio adottato dall'autore originale / detentore del copyright per la concessione della licenza, nel caso in cui si utilizzino opere open-source concesse su licenza da terzi, è sempre opportuno conservare le copie di queste licenze nella repository che ospita l'opera. Non è in alcun caso corretto rimuovere o modificare i file di licenza o i riferimenti di licenza nelle intestazioni o nei metadata dei file sorgente - perché questo è letteralmente un furto e una forma di plagio.

Finché i "consumatori" delle tue creazioni (sito web, app, ecc.) sono informati su dove possono visualizzare le licenze dei progetti creati da terzi che hai usato per costruire il tuo progetto, puoi anche evitare di spedire loro queste licenze.

Qualora decidessi di utilizzare qualsiasi cosa creata da terzi all'interno del tuo progetto, ad eccezione delle opere di dominio pubblico (per le quali personalmente ritengo che dovresti comunque citare la fonte), sei obbligato (sia legalmente che moralmente) a citare la fonte. Tutto ciò viene chiamato **attribuzione**, ed è una regola generale includere riferimenti su tutto il codice che stai utilizzando. Torneremo su questo punto più avanti nel tutorial, perché ci sono diversi requisiti a seconda dei domini a cui appartiene la risorsa che viene attribuita.

### "Software Gratuito/Libero e Open Source"

> Il termine "open source" si riferisce a qualcosa che le persone possono modificare e condividere poiché il suo design è pubblicamente accessibile.
> 
> https://opensource.com/resources/what-open-source

C'è una discussione perpetua da parte dei hardliners FLOSS sul grado di **libertà** insito nell'"open source" - e anche su cosa significa **libero**. Comunque, potrebbe essere una buona idea fare un passo indietro nel tempo, tornando al 1998, e [leggere questo articolo](https://opensource.com/article/18/2/coining-term-open-source-software) scritto da Christine Peterson, la donna che ha inventato il nome "open source". Nonostante Richard Stallman e Linus Torvalds siano due tra i sostenitori più visibili, espressivi e di successo in questo ambito; il punto è che anche se il termine è iniziato come un "espediente di marketing", è rimasto e ha cambiato la vita di tutti sul pianeta - probabilmente in meglio.

Stallman e la "Free Software Foundation" (FSF), che sono probabilmente i più anziani nel campo, definirebbero la libertà come una parte importante dell'open source, perché la libertà di utilizzare e modificare il codice è anche una responsabilità che uno si prende nel nome dell'intera comunità.

<center><strong>Cosa significa gratuito? Cosa significa libero?</strong></center>

Se si ignora per un momento il fastidioso fatto che in inglese *“free”* significa sia libero che gratuito (che è stato il motivo principale per cui si è aggiunto anche il termine “libre”), c'è ancora, di fatto, un problema semantico irrisolto, un problema che forse non verrà mai risolto:

A seconda del proprio punto di vista, la Gnu Public License non è COMPLETAMENTE libera, perché chiede di restituire alla comunità le modifiche apportate al codice - ed essere liberi significherebbe che si può decidere come lavorare e cosa fare con il codice che si usa. Contemporaneamente e su uno spettro diverso, c'è chi ritiene che la licenza MIT non sia completamente libera. La pensano così perché ci sono alcune circostanze in cui il codice può essere modificato senza poi essere restituito alla comunità - in un certo senso "imprigionando", il codice.

> In questi casi non esiste un pensiero giusto o sbagliato, perché dipende tutto dalla prospettiva con cui si guardano le cose. Comunque ogni sviluppatore e ogni organizzazione devono decidere da soli su cosa vogliono concentrare la propria attenzione. Su Quasar Framework, non siamo puristi a tal punto da credere che il Codice sia, di per sé, un’entità spirituale meritevole di diritti trasferibili. Forse, se stessimo lavorando sul Kernel Linux sarebbe stato diverso - ma noi siamo più preoccupati della parte umana del codice e crediamo che le persone che utilizzano il nostro progetto dovrebbero avere la libertà di decidere che cosa vogliono fare. Per questo motivo abbiamo adottato un approccio "permissivo" e abbiamo scelto la licenza MIT.

Ci sono sempre molte discussioni su "quanto rendere libero il proprio codice". Per questo vi propongo di farvi quattro domande:

1. Preferisci lavorare da solo?
2. Hai paura che qualcuno possa rubare il tuo lavoro?
3. Hai scritto da solo tutto il codice, incluse le librerie?
4. Hai firmato qualche accordo di non divulgazione riguardante il progetto in questione?

Se hai risposto **no** a qualcuna di queste domande, allora la migliore cosa sarebbe scegliere una licenza di tipo open source.

Se hai risposto **si** a tutte queste domande, forse attribuire una licenza di tipo open-source è comunque uno dei migliori modi per proteggere il tuo lavoro e assicurarti che abbia un impatto sul resto del mondo. Basti pensare a questo: se tutti i software che ti circondano oggi non fossero open source, saresti ancora in grado di lavorare come fai di solito? Non hai il dovere verso la comunità di condividere il tuo lavoro?

### Licenza Permissiva vs. Licenza Protettiva

Una delle idee sbagliate più diffuse riguardanti la concessione di licenze per il vostro progetto con GPL, è che impedirà alle aziende di prendere la vostra idea e usarla per fare soldi - il tutto senza darvi alcuna parte dei profitti. Questo è palesemente falso. Se qualcuno vuole rubare il vostro codice e infrangere la legge, lo farà. Se una società vuole usare la vostra libreria GPL, può isolarla dal resto del loro sistema e non rivelare nulla del loro codice proprietario. Possono prendere il vostro codice, decodificarlo e riscriverlo. Se questa è la vostra maggiore preoccupazione, allora fermatevi, tornate all'inizio di questo tutorial e leggete attentamente per decidere se volete prendere parte all'open-source - o semplicemente sfruttarlo.

MIT, BSD e Apache sono quelle che la comunità del software open-source chiama licenze "permissive". Permissiva significa che l'autore vi sta concedendo una gran parte di diritti per utilizzare il software che sta condividendo, persino il diritto di usarlo per trarne profitto e modificarlo per adattarlo ai vostri scopi. Finché si conservano copie della licenza originale e si informano coloro che sono interessati che si sta utilizzando quel particolare software, è possibile fare qualsiasi cosa con il codice - persino modificarlo senza dire a nessuno che l'avete fatto.

> Il copyleft è la pratica di offrire alle persone il diritto di distribuire liberamente copie e versioni modificate di un'opera con la clausola che gli stessi diritti siano conservati nelle ["opere derivate"](https://en.wikipedia.org/wiki/Derivative_works) create successivamente. https://it.wikipedia.org/wiki/Copyleft

Questo tipo di licenze "protettive" va oltre le licenze "permissive" viste con il MIT e APACHE, cercando di proteggere il codice e i diritti della comunità. Qualsiasi modifica apportata al codice sorgente deve essere restituita alla comunità, e non si può concedere in sublicenza il codice. GPL e CC-SA sono due tipi di licenze che funzionano in questo modo.

### Rilevamento delle licenze e requisiti per la concessione di licenze

L'uso di software open-source nei vostri progetti è un’ottima cosa, ma dovete rimanere diligenti, specialmente quando state contribuendo a un altro progetto. E questo è doppiamente vero se siete tenuti a dare riscontro in merito alla conformità delle licenze (ad esempio nel caso di agenzie pubbliche o nei firewall legali aziendali). In ogni caso, rivedere e rintracciare manualmente tutti i file di licenza può essere una rottura di scatole.

Ci sono alcuni progetti che trattano questo tema della ricerca, come ad esempio [nlf](https://www.npmjs.com/package/nlf) e [https://fossa.io/](https://fossa.io/ "https://fossa.io/") e nello specifico [il loro **CLI** gratuito che non richiede alcuna registrazione](https://github.com/fossas/fossa-cli).

    $ nlf --summary detail > nlf.txt
    

[Ecco un rapporto fatto dal repo Quasar usando l'approccio **nlf**.](https://raw.githubusercontent.com/nothingismagick/quasar-articles/master/tutorials/nlf_report_licenses_quasar.txt.md)

Se volete visualizzare un rapporto di licenza generato da **fossa CLI** nel vostro repository, dopo aver seguito le loro istruzioni per l'installazione, potete semplicemente usare questo comando:

    $ fossa report licenses > fossa.txt
    

[Questo è un report creato dalla repo Quasar utilizzando l'approccio **fossa cli**.](https://raw.githubusercontent.com/nothingismagick/quasar-articles/master/tutorials/fossa_report_licenses_quasar.txt.md) Come potete vedere, la maggior parte dei moduli usa una licenza MIT, ma molti non sono chiari solo dal report: 15 dei progetti non sono stati rilevati automaticamente da **fossa**. Ho seguito ognuno dei link, ho rintracciato le loro licenze e ho creato una nota non solo della licenza, ma anche del fatto che sono stato io a farlo.

Inoltre, ho notato che solo una delle nostre librerie (stylint) richiede una licenza GPL, ma gli sviluppatori hanno un conflitto di licenza nella dichiarazione nel package.json (GPL-2) e nel file di licenza vero e proprio (GPL-3).

Questo è ciò che dovreste fare anche voi. Se un file di licenza non dovesse essere incluso nel progetto, è non riesci a trovarne uno, sarebbe opportuno contattare l'autore.

**Un avvertimento**: Questi sistemi automatizzati non sono infallibili (ad esempio un modulo di ricerca potrebbe rilevare molteplici licenze, anche se lui stesso ne sta utilizzando un’altra). Se siete vincolati dalle normative, è necessario esaminarli tutti manualmente - e non abbiate paura di contattare l'autore se avete bisogno di chiarimenti - o persino di una licenza diversa. A volte può capitare. Ricorda, è meglio chiedere il permesso piuttosto che chiedere scusa.

### Utilizzando l'open-source

Se stai utilizzando qualsiasi cosa che è open-source, è necessario dichiarare il suo utilizzo e rendere le licenze originali facilmente accessibili. Se, per esempio, stai utilizzando, moduli di nodo nel tuo progetto, allora queste licenze sono disponibili nel codice sorgente del progetto quando qualcuno scarica i file del progetto ed "installa" le dipendenze. Di solito puoi trovarla come un file chiamato `LICENSE` nella cartella principale oppure nel campo "license" nel `package.json`

Normalmente questo è sufficiente, tuttavia, se si apportano modifiche alla libreria originale, potrebbe essere necessario avvisare e/o inviare queste modifiche alla comunità. Questo dipende dal tipo di licenza, ma tratteremo le specifiche per la concessione della licenza nella sezione finale.

> **Stack Overflow**: Un errore comune è semplicemente copiare e incollare le cose che si trovano su stackoverflow.com - ma questo è pericoloso, perché anche se è sottinteso che l'utente sta condividendo queste informazioni, non si sa con certezza al 100% se è opportuno (o permesso) usare l'esempio di codice 1 a 1. La pratica comune di citare la fonte è meglio di niente, ma dovresti davvero considerare la possibilità di riscrivere l'esempio per adattarlo al tuo stile di codice, alle esigenze del tuo progetto E citare la fonte come "ispirazione".

## La tua Identità e i tuoi Diritti

### Cos’è un "Accordo di Non Divulgazione" (NDA)

Un accordo di non divulgazione è un contratto che vi potrebbe essere richiesto di firmare se lavorerete con un'organizzazione che ha segreti commerciali da proteggere. In qualità di firmatario dell'accordo di non divulgazione, sarete vincolati dal contratto a mantenere la segretezza sulle informazioni che vi sono state fornite, e può includere clausole di non concorrenza in un settore simile per un determinato periodo di tempo. Anche se questo è solitamente raro nel settore open-source, può essere richiesto se si ha accesso a "segreti" come chiavi API, credenziali di accesso e simili.

> Se vi viene presentato un accordo di non divulgazione, come per qualsiasi contratto, è una scelta saggia leggere tutto, fare domande e chiedere il parere di un avvocato. Quasar non ti chiederà mai di firmare un accordo di non divulgazione.

### Cosa è un "Accordo di licenza del collaboratore" (CLA)

Un accordo di licenza del collaboratore è un contratto tra il proprietario di un progetto e chi contribuisce al codice. Contrariamente da un NDA (il quale è restrittivo), un CLA è "reciproco" dato che esiste per proteggere i diritti del proprietario e del collaboratore. Con un CLA, i collaboratori danno esplicitamente al proprietario il permesso di utilizzare il contributo, e i proprietari permettono esplicitamente al collaboratore di utilizzare i loro contributi come meglio credono.

Tuttavia, molti sviluppatori ritengono che un CLA sia problematico a causa dei diritti che conferisce al proprietario, che includono la possibilità di cambiare la licenza del codice. [Ecco qui un ottimo resoconto di gitlab](https://about.gitlab.com/2017/11/01/gitlab-switches-to-dco-license/) sul perché sono passati da un CLA a un DCO - ed ecco la loro [analisi approfondita dal punto di vista della gestione del progetto](https://docs.google.com/a/gitlab.com/document/d/1zpjDzL7yhGBZz3_7jCjWLfRQ1Jryg1mlIVmG8y6B1_Q/edit?usp=sharing).

### Cos’è un "Certificato di Origine dello Sviluppatore" (DCO)

Un Certificato di Origine dello Sviluppatore è una dichiarazione legale fatta da un collaboratore che certifica di essere l'autore del contributo e di avere l'autorità legale per contribuire con questo codice. Come nell'esempio Gitlab visto in precedenza, questo è solitamente combinato con una licenza di tipo MIT o Apache. Potete leggere l'intera licenza qui (è breve): https://developercertificate.org/

Aggiungendo la voce `firmato da` al tuo contributo, stai affermando che stai agendo in conformità al DCO. Nonostante non sia necessaria per ogni contributo, è lì per fornire una sorta di “catena di responsabilità” qualora le cose andassero male. È buona prassi consigliata usare il nome reale del collaboratore. Puoi approfondire i dettagli di questa operazione qui: https://stackoverflow.com/a/1962112

Alcuni IDE, come ad esempio [Webstorm](https://www.jetbrains.com/help/webstorm/2017.2/using-git-integration.html#commit), ti offrono la possibilità di aggiungere questo flag direttamente dalla finestra di commit mentre stai revisionando il tuo codice. Questo aggiungerà la seguente riga alla fine del messaggio di commit: `Firmato da:<username>`

Nota: se i responsabili del progetto su cui stai lavorando ti chiedono di firmare, controlla se vogliono davvero che tu firmi per ogni commit, oppure se è sufficiente firmare i tag o le PR. Tecnicamente parlando, chi deve firmare è la persona che unifica il codice, ma aggiungendo il tuo nome ai singoli commit diventa chiaro chi sia l’effettivo responsabile di ciascun cambiamento. È una questione di preferenze.

> Su Quasar vi chiediamo di firmare su tutti i commit.

### Diventa un collaboratore "verificato"

I collaboratori verificati su Github o Gitlab sono sviluppatori che hanno aggiunto una chiave GPG al loro account e utilizzano questa chiave per firmare i loro commit. Anche se non è necessario per l'integrazione, alcuni project manager potrebbero richiederlo - soprattutto perché è più facile rubare le credenziali di accesso di qualcuno e modificare una repository importante, che rubare la loro chiave GPG.

I seguenti link vi mostreranno come creare una chiave GPG e usarla con Github o Gitlab, a seconda delle necessità.

- [Aggiungi una chiave GPG a Github](https://help.github.com/articles/adding-a-new-gpg-key-to-your-github-account/)
- [Firmare i commit su Gitlab](https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/index.html)
- https://blog.github.com/2016-04-05-gpg-signature-verification/
- https://stackoverflow.com/questions/10161198/is-there-a-way-to-autosign-commits-in-git-with-a-gpg-key

### Quando ho bisogno di ottenere "liberatorie"

Una liberatoria è generalmente richiesta quando si realizzano fotografie di persone e proprietà private - e le si utilizza per qualsiasi scopo non privato. Anche se le specifiche variano da giurisdizione a giurisdizione, è molto importante che tu faccia firmare una liberatoria, e se è chiaro DOVE è stata scattata la foto, allora potrebbe essere necessario ottenere il permesso del proprietario.

> Un modo intelligente per gestire una liberatoria per le persone fisiche (se vogliono davvero sostenerti) è il cosiddetto "pagamento reciproco". Prima di scattare la foto, preparate due ricevute. Su una ricevuta, voi li pagate ad es. 5 euro per essere un modello. Nella seconda ricevuta, loro vi pagano ad es. 5 euro per una copia della foto. Si applica la regola (hai ricevuto i soldi, tieni la copia), quindi ogni parte ha una ricevuta originale e una copia della ricevuta. Inviate loro una copia digitale dell'immagine finale come link alla repository open-source in cui è stata utilizzata, e annotatelo sulla copia della ricevuta che vi hanno dato. Tenete tutto questo nei vostri archivi, e tutti sono felici.

Se usate fotografie di persone scattate da voi e le usate nei progetti open source, dovete poter essere in grado di dimostrare che la persona inquadrata vi ha autorizzato e dovreste tenere la loro liberatoria su file e disponibile.

### Come posso documentare la "provenienza"

Provenienza è una parola che descrive la storia di un lavoro. Il codice condiviso sotto licenza open-source e nel contesto di una repository git è più o meno auto-documentante. Le immagini sono meno evidenti, ed è particolarmente difficile con i lavori di collage digitale che combinano una serie di risorse.

Per i designer è importante gestire la provenienza, in quanto i diritti sulle immagini sono fortemente contestati e spesso portano a battaglie legali. Anche se vengono utilizzate solo risorse di pubblico dominio, è comunque una buona pratica registrare il proprio lavoro in un certificato di provenienza. Questo tipo di documento è come la bibliografia in un articolo scientifico, in cui sono registrate le idee e gli autori. Anche se non esiste un approccio "standardizzato", il metodo migliore è quello di non solo registrare le fonti e i tempi di accesso, ma anche di rintracciare le licenze per ogni componente. Se volete un esempio, sentitevi liberi di guardare la sezione citazioni [in questa suddivisione grafica](https://busy.org/@nothingismagick/qcensus2018-campaign-graphics-breakdown) scritta in stile @utopian-io.

> L'ultima cosa che chiunque desidera è una battaglia legale perché questa drena risorse come tempo e denaro. Se state contribuendo ad un progetto open-source, assicuratevi di non metterli in difficoltà. Su Quasar, potete star certi che il Dipartimento Artistico prende la cosa MOLTO seriamente e le violazioni di questo rapporto fiduciario possono portare all’inserimento in una lista nera oppure al ban immediato.

## Tipi di Licenza

### Principali licenze per il codice

Questa introduzione non può spiegare le sottili differenze tra tutte le diverse licenze per il codice, perché ce ne sono decine. A license is added to code by either placing a reference to it in the header of the file being licensed in the case of distributables, in a LICENSE file in the root level of a repository, in the README about the project or potentially in the package.json (if using node).

Se avete saltato qualche parte e non avete letto i capitoli precedenti, ecco un rapido riassunto dei tre principali tipi di licenza e un esempio popolare di ciascuno di essi, insieme a due link che vanno più in dettaglio e analisi.

- **Permissiva**: [MIT](http://www.opensource.org/licenses/MIT)
- **Protettiva**: [GPL-3](https://www.gnu.org/licenses/gpl-3.0.en.html)
- **Dominio Pubblico**: [WTFPL](http://www.wtfpl.net/)
- [Helper Licenza di Github](https://choosealicense.com/)
- [L'elenco completo di GNU Foundation](https://www.gnu.org/licenses/license-list.html)

> Su Quasar Framework tutti i contributi alle librerie di base devono essere MIT. Contribuendo a qualsiasi cosa, accettate questa licenza.

### Licenze importanti per testo / documentazione

Anche il testo e la documentazione sono un'opera creativa e sono generalmente protetti dalle leggi sul copyright. Puoi trasferire questi diritti a terzi o a proprietari di progetti a cui darai i tuoi contributi scegliendo o una risorsa Creative Commons o la Licenza Documenti Liberi.

Viene considerata una buona prassi nominare la licenza e l'autore(i) alla fine del documento che viene concesso in licenza.

- [Creative Commons](https://creativecommons.org/)
- [Licenza per documentazione libera](https://www.gnu.org/licenses/fdl.html)

> Su Quasar Framework tutta la documentazione è (oppure sarà) concessa sotto licenza FDL.

### Creare una licenza per un'opera d'arte / design / video

Ci sono letteralmente tante norme giuridiche per questo tipo di contributi quanti sono i Paesi del pianeta, quindi è assolutamente inopportuno entrare nel dettaglio su come le cose siano diverse da nazione a nazione. Qualsiasi cosa succeda, la persona che ha realizzato l'immagine non può mai perdere il diritto di dire di esserne il proprietario (a meno che un contratto assolutamente draconiano non glielo impedisca - e in alcuni casi neanche questo reggerà in tribunale). Per questo motivo esiste una regola comune: Citare l'autore e nominare la licenza. Se non puoi farlo, allora non utilizzare la risorsa.

A seconda di dove e come il contributo deve essere utilizzato, ci sono diversi modi per creare questa citazione:

1. Nominare il file di conseguenza
2. Mettere le informazioni riguardanti la licenza in un watermark all'interno del file
3. Iniettare le informazioni nei metadati del file
4. Se possibile, citare la fonte / le licenze dell'immagine subito dopo l'immagine
5. Mettere queste stesse informazioni in una nota a piè di pagina / nota finale / documento collegato
6. Inserire le informazioni sulla licenza o le licenze e i moduli di rilascio nella repository nella stessa cartella dell'immagine o in un altra posizione delegata

Le licenze comuni da usare per Immagini / Design / Video sono:

- [Creative Commons](https://creativecommons.org/)
- [Dominio Pubblico / CC0](https://creativecommons.org/share-your-work/public-domain/cc0/)
- [Apache v2](https://apache.org/licenses/LICENSE-2.0)

> Quasar preferisce le licenze CC-BY oppure CC0.

### Licenze per i font

Delle centinaia di font elencati in [Google Fonts](https://fonts.google.com/attribution), ci sono esattamente due diverse licenze utilizzate: O la licenza Apache v2, o la SIL Open Font License v1.1. La stragrande maggioranza sono OFL, ed è fondamentalmente lo stesso tipo di licenza permissiva della MIT.

Se si utilizza un font, è necessario assicurarsi di avere davvero la licenza per esso, in quanto alcune fucine di font professionali venderanno diversi tipi di licenze a seconda dell'applicazione. (Come per una licenza per il desktop publishing, un'altra per i siti web, ecc.) Se si utilizza un font open-source, è buona prassi mettere una copia della licenza nella cartella in cui si mantengono i font.

Inoltre, alcuni servizi come FontSquirrel offrono un [WebfontGenerator](https://www.fontsquirrel.com/tools/webfont-generator) che permette ai designer di creare un insieme di file di font in modo che i singoli browser possano selezionare il tipo per il quale sono più attrezzati all'utilizzo. Questi ti chiederanno di verificare di avere il diritto di convertire il font in altri formati. Il SIL OFL permette questo. Se non riesci a trovare alcuna licenza, supponi sempre di non avere il diritto di utilizzare il font.

- [QFL versione web FAQ (1.1-aggiornamento5)](https://scripts.sil.org/cms/scripts/page.php?item_id=OFL-FAQ_web)

# Ultime parole

Solo perché "apri" il tuo lavoro alla collaborazione da parte degli altri, la storia non finisce qui. Solo perché schiaffi una licenza Creative Commons su un file photoshop non significa che questo sia aperto e gratuito. Il grado di apertura di un bene o di un progetto è determinato anche dal sistema operativo e dal software necessario per utilizzare e modificare il file. Si prega di considerare la pubblicazione non solo dei risultati del processo del vostro lavoro, ma anche di informare le persone su come lo avete fatto.

Inoltre, si prega di non usare software pirata mentre state lavorando a progetti open source. Non solo è "scortese" e dannoso per l'onore dell'intera comunità open-source, ma mettete voi stessi e i vostri colleghi a rischio, soprattutto se avete accesso a credenziali di alto valore, come i login al server, ecc. Non c'è modo più facile per diventare vittima degli hacker (coinvolgendo eventualmente anche la vostra squadra) che usare software crackati.

# Altre risorse

Nel caso in cui vogliate approfondire questi argomenti, abbiamo alcune risorse aggiuntive che vi raccomandiamo vivamente:

- La distinzione tra [FLOSS E FOSS](https://www.gnu.org/philosophy/floss-and-foss.en.html) di Stallman
- Questo capitolo della [Guida ZeroMQ](http://zguide.zeromq.org/page:all#toc141) approfondisce molto la governanza nei progetti di tipo open-source con l'esempio specifico della loro comunità

#### Prova del Lavoro Svolto (Diritti d'autore)

La versione originale di questo articolo è stata compilata e scritta da @nothingismagick https://github.com/nothingismagick

#### Licenza

Quest'opera e tutti i suoi derivati sono [concessi in licenza sotto FDL 1.3](https://github.com/nothingismagick/quasar-articles/blob/master/LICENSE).

> Scritto con [StackEdit](https://stackedit.io/).