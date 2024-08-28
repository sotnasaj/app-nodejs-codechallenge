# WIP
- improvements should be made to gracefully catch unexpected errors
- improvement should be made to enhanced validations
- unit testing
- integration testing

all services can be run with docker-compose up .

service will be exposed in 3001


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
