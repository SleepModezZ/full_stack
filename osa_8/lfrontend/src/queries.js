import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
  query allBooks($genre: String!) {
    allBooks(genre: $genre) {
      title
      published
      id
      genres
      author {
        name
      }
    }
  }
`
export const GENRES = gql`
  query {
    genres
  }
`
export const BOOKS_BY_GENRE = gql`
  query booksByGenre($genre: String!) {
    allBooks(genre: $genre) {
      title
      published
      id
      author {
        name
      }
    }
  }
`
export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      id
      bookCount
    }
  }
`

export const ME = gql`
  query {
    me {
      favoriteGenre
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $year: Int!
    $author: String!
    $genres: [String]!
  ) {
    addBook(title: $title, published: $year, author: $author, genres: $genres) {
      title
      published
      genres
    }
  }
`

export const LOGIN = gql`
  mutation createBook($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation addYear($name: String!, $year: Int!) {
    editAuthor(name: $name, setBornTo: $year) {
      name
      born
    }
  }
`
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      author {
        name
      }
    }
  }
`
