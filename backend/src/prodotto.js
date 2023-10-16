// prodotto.js

class Prodotto {
  constructor(ID, Nome, Descrizione, Prezzo, Stock, CategoriaID,ImmaginePath) {
    this.ID = ID;
    this.Nome = Nome;
    this.Descrizione = Descrizione;
    this.Prezzo = Prezzo;
    this.Stock = Stock;
    this.CategoriaID = CategoriaID;
    this.ImmaginePath= ImmaginePath;
  }
}

module.exports = Prodotto;
