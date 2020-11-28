export default function (title, desc) {
  return {
    title: {
      name: 'title',
      content: title
    },
    ogTitle: {
      name: 'og:title',
      content: title
    },
    twitterTitle: {
      name: 'twitter:title',
      content: title
    },

    description: {
      name: 'description',
      content: desc
    },
    ogDesc: {
      name: 'og:description',
      content: desc
    },
    twitterDesc: {
      name: 'twitter:description',
      content: desc
    }
  }
}
