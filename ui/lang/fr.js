export default {
  isoName: 'fr',
  nativeName: 'Français',
  label: {
    clear: 'Effacer',
    ok: 'OK',
    cancel: 'Annuler',
    close: 'Fermer',
    set: 'Régler',
    select: 'Sélectionner',
    reset: 'Réinitialiser',
    remove: 'Supprimer',
    update: 'Mettre à jour',
    create: 'Créer',
    search: 'Rechercher',
    filter: 'Filtrer',
    refresh: 'Rafraîchir'
  },
  date: {
    days: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
    daysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
    months: 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre'.split('_'),
    monthsShort: 'Jan_Fev_Mar_Avr_Mai_Juin_Jui_Aou_Sep_Oct_Nov_Dec'.split('_'),
    headerTitle: function (date) {
      return new Intl.DateTimeFormat('fr', {
        weekday: 'short', day: 'numeric', month: 'short'
      }).format(date)
    },
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'jours'
  },
  table: {
    noData: 'Aucune donnée à afficher',
    noResults: 'Aucune donnée trouvée',
    loading: 'Chargement...',
    selectedRecords: function (rows) {
      return rows > 0
        ? rows + ' ' + (rows === 1 ? 'ligne sélectionnée' : 'lignes sélectionnées') + '.'
        : 'Aucune ligne sélectionnée.'
    },
    recordsPerPage: 'Lignes par page :',
    allRows: 'Tous',
    pagination: function (start, end, total) {
      return start + '-' + end + ' sur ' + total
    },
    columns: 'Colonnes'
  },
  editor: {
    url: 'URL',
    bold: 'Gras',
    italic: 'Italique',
    strikethrough: 'Barré',
    underline: 'Souligné',
    unorderedList: 'Liste non ordonnée',
    orderedList: 'Liste ordonnée',
    subscript: 'Indice',
    superscript: 'Exposant',
    hyperlink: 'Hyperlien',
    toggleFullscreen: 'Basculer en plein écran',
    quote: 'Citation',
    left: 'Aligner à gauche',
    center: 'Aligner au centre',
    right: 'Aligner à droite',
    justify: 'Justifier',
    print: 'Imprimer',
    outdent: "Diminuer l'indentation",
    indent: "Augmenter l'indentation",
    removeFormat: 'Supprimer la mise en forme',
    formatting: 'Mise en forme',
    fontSize: 'Taille de police',
    align: 'Aligner',
    hr: 'Insérer une règle horizontale',
    undo: 'Annuler',
    redo: 'Refaire',
    heading1: 'Titre 1',
    heading2: 'Titre 2',
    heading3: 'Titre 3',
    heading4: 'Titre 4',
    heading5: 'Titre 5',
    heading6: 'Titre 6',
    paragraph: 'Paragraphe',
    code: 'Code',
    size1: 'Très petit',
    size2: 'Petit',
    size3: 'Normal',
    size4: 'Moyenne',
    size5: 'Grand',
    size6: 'Très grand',
    size7: 'Maximum',
    defaultFont: 'Police par défaut',
    viewSource: 'Voir la source'
  },
  tree: {
    noData: 'Aucun nœud à afficher',
    noResults: 'Aucun nœud trouvé'
  }
}
