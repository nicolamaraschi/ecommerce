// Classe per la tabella DettagliOrdini
class DettaglioOrdine {
    constructor(ID, OrdineID, ProdottoID, Quantita, Prezzo) {
      this.ID = ID;
      this.OrdineID = OrdineID;
      this.ProdottoID = ProdottoID;
      this.Quantita = Quantita;
      this.Prezzo = Prezzo;
    }
  }

  module.exports = DettaglioOrdine;