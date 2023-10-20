class ShoppingCartItem {
    constructor(ID, UtenteID, ProdottoID, Quantita, Prezzo) {
      this.ID = ID;
      this.UtenteID = UtenteID;
      this.ProdottoID = ProdottoID;
      this.Quantita = Quantita;
      this.Prezzo = Prezzo;
    }
  }
  
  module.exports = ShoppingCartItem;