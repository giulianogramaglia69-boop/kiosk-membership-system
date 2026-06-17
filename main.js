// Ciclo continuo per tenere l'applicazione sempre attiva e reattiva
while(true) {
  let fm = FileManager.local()
  let dir = fm.documentsDirectory()
  let path = fm.joinPath(dir, "abbonati_nativo.json")

  // Carica il database dal telefono
  let abbonati = {}
  if (fm.fileExists(path)) {
    abbonati = JSON.parse(fm.readString(path))
  }

  // Crea la tabella nativa in stile iOS
  let table = new UITable()
  table.showSeparators = true

  // --- INTESTAZIONE ---
  let header = new UITableRow()
  header.isHeader = true
  header.height = 60
  let title = header.addText(" GESTIONE ABBONAMENTI", "Tocca un cliente per registrare l'ingresso")
  title.widthWeight = 70
  
  let addBtn = header.addButton(" NUOVO")
  addBtn.widthWeight = 30
  addBtn.dismissOnTap = true // Chiude temporaneamente la tabella per mostrare il modulo
  
  let azioneScelta = null
  addBtn.onTap = () => { azioneScelta = "aggiungi" }
  table.addRow(header)

  // --- LISTA ABBONATI ---
  let oggi = new Date().setHours(0,0,0,0)
  let nomi = Object.keys(abbonati)

  if (nomi.length === 0) {
    let vuoto = new UITableRow()
    vuoto.height = 80
    vuoto.addText("Nessun abbonato in lista.", "Tocca '+ NUOVO' in alto a destra per iniziare.")
    table.addRow(vuoto)
  }

  for (let nome of nomi) {
    let info = abbonati[nome]
    let expDate = new Date(info.scadenza).setHours(0,0,0,0)
    let attivo = expDate >= oggi
    let stato = attivo ? " Attivo" : " SCADUTO"
    
    let row = new UITableRow()
    row.height = 70
    row.dismissOnTap = true // Chiude la tabella al tocco per elaborare l'azione
    
    let cell = row.addText(`${nome}  (Ingressi: ${info.ingressi})`, `${stato} — Scadenza: ${info.scadenza}`)
    cell.widthWeight = 100
    
    row.onSelect = () => {
      azioneScelta = { tipo: "gestisci", nome: nome, attivo: attivo, scadenza: info.scadenza }
    }
    table.addRow(row)
  }

  // Mostra l'interfaccia nativa di Apple
  await table.present()

  // --- LOGICA DOPO IL CLIC ---
  if (azioneScelta === "aggiungi") {
    let a = new Alert()
    a.title = "Nuovo Abbonato"
    a.addTextField("Nome e Cognome")
    a.addTextField("Scadenza (AAAA-MM-GG)", new Date().toISOString().split('T')[0])
    a.addAction("Salva")
    a.addCancelAction("Annulla")
    
    if (await a.presentAlert() == 0) {
      let n = a.textFieldValue(0).trim()
      let s = a.textFieldValue(1).trim()
      if (n && s) {
        abbonati[n] = { scadenza: s, ingressi: 0 }
        fm.writeString(path, JSON.stringify(abbonati))
      }
    }
  } 
  else if (azioneScelta && azioneScelta.tipo === "gestisci") {
    let nome = azioneScelta.nome
    let m = new Alert()
    m.title = nome
    m.message = `Scadenza: ${azioneScelta.scadenza}\nIngressi totali: ${abbonati[nome].ingressi}`
    m.addAction(" REGISTRA INGRESSO (+1)")
    m.addDestructiveAction(" Elimina Abbonato")
    m.addCancelAction("Annulla")
    
    let sceltaMenu = await m.presentSheet()
    if (sceltaMenu === 0) {
      // Controllo validità abbonamento
      if (!azioneScelta.attivo) {
        let err = new Alert()
        err.title = " INGRESSO NEGATO"
        err.message = `L'abbonamento di ${nome} è SCADUTO!\nImpossibile aggiungere l'ingresso.`
        await err.presentAlert()
      } else {
        abbonati[nome].ingressi++
        fm.writeString(path, JSON.stringify(abbonati))
      }
    } else if (sceltaMenu === 1) {
      delete abbonati[nome]
      fm.writeString(path, JSON.stringify(abbonati))
    }
  } 
  else {
    // Se premi "Done / Fatto" in alto a sinistra, l'applicazione si chiude correttamente
    break
  }
}
