export default function (title, desc) {
  return {
    ogTitle: {
      name: 'og:title',
      content: title
    },
    description: {
      name: 'description',
      content: desc
    },
    twitterDesc: {
      name: 'twitter:description',
      content: desc
    },
    ogDesc: {
      name: 'og:description',
      content: desc
    }
  }
}
