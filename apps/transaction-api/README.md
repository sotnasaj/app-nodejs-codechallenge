# wWIP
Some queries
mutation Mutation($createTransactionInput: CreateTransactionInput!) {
  createTransaction(createTransactionInput: $createTransactionInput) {
    id
    value
    createdAt
  }
}

query Query($getTransactionId: String!) {
  getTransaction(id: $getTransactionId) {
    transactionExternalId
    transactionType {
      name
    }
    transactionStatus {
      name
    }
    value
    createdAt
  }
}
