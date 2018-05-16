// recipeTemplate
export default {
  id: undefined,
  acapID: null,
  creator: '',
  creationDate: undefined,
  originalUrl: '',
  description: '',
  ingredients: [
    {
      group: '',
      qty: '',
      unit: '',
      name: '',
      optional: false,
      preparation: ''
    }
  ],
  method: [
    {
      step: 1,
      text: ''
    }
  ],
  published: false,
  publishedDate: undefined,
  updatedDate: undefined,
  rating: 0,
  subTitle: '',
  tags: [
    {
      priority: 0,
      text: ''
    }
  ],
  title: '',
  variations: [
    {
      text: ''
    }
  ],
  notes: ''
};
