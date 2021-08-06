// recipeTemplate
export default {
  id: undefined,
  acapID: null,
  creator: '',
  creationDate: undefined,
  originalUrl: '',
  description: '',
  tools: [
    {
      name: '',
      required: false,
    },
  ],
  ingredients: [
    {
      group: '',
      qty: '',
      unit: '',
      name: '',
      optional: false,
      preparation: '',
    },
  ],
  methods: [
    {
      group: '',
      step: 1,
      text: '',
    },
  ],
  published: false,
  publishedDate: undefined,
  updatedDate: undefined,
  rating: 0,
  subTitle: '',
  tags: [
    {
      priority: 0,
      text: '',
    },
  ],
  title: '',
  variations: [
    {
      text: '',
    },
  ],
  notes: '',
};
