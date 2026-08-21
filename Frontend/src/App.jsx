import React from 'react'
import books from './assets/book.js'
import './App.css'

export default function App() {
  return (
    <div className="bookstore-app">
      <header className="bookstore-header simple">
        <h1>ABES Bookstore</h1>
        <p className="muted">Poster gallery — simplified and beginner-friendly.</p>
      </header>

      <section className="books-grid">
        {books.map((book, index) => (
          <article key={`${book.title}-${index}`} className="book-card simple">
            <img src={book.poster} alt={`${book.title} poster`} className="book-poster small" />
            <div className="book-details">
              <h2>{book.title}</h2>
              <p className="muted">{book.author}</p>
              <p className="book-price">${book.price.toFixed(2)}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
