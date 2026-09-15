// The typography classes as the page shows them: TypographyHeadings.vue
// and TypographyWeights.vue render samples (a heading's `sample` text,
// its `label` otherwise), the docs generator (build/mcp) lists them.
export const headings = [
  { label: 'Headline 1', cls: 'text-h1', equivalent: 'h1' },
  { label: 'Headline 2', cls: 'text-h2', equivalent: 'h2' },
  { label: 'Headline 3', cls: 'text-h3', equivalent: 'h3' },
  { label: 'Headline 4', cls: 'text-h4', equivalent: 'h4' },
  { label: 'Headline 5', cls: 'text-h5', equivalent: 'h5' },
  { label: 'Headline 6', cls: 'text-h6', equivalent: 'h6' },
  { label: 'Subtitle 1', cls: 'text-subtitle1' },
  { label: 'Subtitle 2', cls: 'text-subtitle2' },
  {
    label: 'Body 1',
    sample:
      'Body 1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.',
    cls: 'text-body1'
  },
  {
    label: 'Body 2',
    sample:
      'Body 2. Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate aliquid ad quas sunt voluptatum officia dolorum cumque, possimus nihil molestias sapiente necessitatibus dolor saepe inventore, soluta id accusantium voluptas beatae.',
    cls: 'text-body2'
  },
  { label: 'Caption text', cls: 'text-caption' },
  { label: 'Overline', cls: 'text-overline' }
]

export const weights = ['thin', 'light', 'regular', 'medium', 'bold', 'bolder']
