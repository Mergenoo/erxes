export const types = `
  type ResponseTemplate {
    _id: String!
    name: String!
    brandId: String!
    content: String
    status: String
    brand: Brand,
    files: JSON
  }
`;

export const queries = `
  responseTemplates(page: Int, perPage: Int, searchValue: String, brandId: String, status: String): [ResponseTemplate]
  responseTemplatesTotalCount(searchValue: String, brandId: String): Int
`;

export const mutations = `
  responseTemplatesAdd(
    brandId: String!,
    name: String!,
    content: String,
    files: JSON
  ): ResponseTemplate

  responseTemplatesEdit(
    _id: String!,
    brandId: String!,
    name: String!,
    content: String,
    files: JSON
  ): ResponseTemplate

  responseTemplatesRemove(_id: String!): JSON
  responseTemplatesChangeStatus(_id: String!, status: String): ResponseTemplate

`;
