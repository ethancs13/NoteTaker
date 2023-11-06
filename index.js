const express = require('express');
const fs = require('fs')

const PORT = 3001;
const app = express();

app.use(express.static('public'));
app.use(express.json());       // to support JSON-encoded bodies


// This method sends a JSON response with the correct content type.
app.get('/notes', (req, res) => {
  // return the notes.html file
  res.sendFile(__dirname + '/public/notes.html')

});

app.get('/api/notes', (req, res) => {
  
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    res.send(data)
  })

})

app.post('/api/notes', (req, res) => {

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    let newNote = {
      title: req.body.title,
      text: req.body.text,
      id: Math.floor(Math.random() * 1001)
    }
    let noteList = JSON.parse(data)

    let array = [];



    noteList.forEach((item) => {
      let note = {
        title: item.title,
        text: item.text,
        id: Math.floor(Math.random() * 1001)
      }
      array.push(note)
    })
    array.push(newNote)

    // console.log(note)
    fs.writeFile('./db/db.json', JSON.stringify(array), (err) => {
      console.log(err)
    })

    res.send(newNote)
  })
})

// delete route
app.get('/api/notes/:id', (req, res) => {
  let array = [];

  console.log('got here')
  
  fs.readFile('./db/db.json', 'utf8', (err, data) => {

    if (err) {
      console.log(err)
    } else {
      JSON.parse(data).forEach((item) => {
        let note = {
          title: item.title,
          text: item.text,
          id: Math.floor(Math.random() * 1001)
        }
        
        if (item.id !== req.body.id) {
          array.push(note)
        }
      })

      fs.writeFile('./db/db.json', JSON.stringify(array), (err) => {
        err ? console.error(err) : console.log('success')
      })
    }


  })
})

// We can send a body parameter to the client using the res.send() method. This body parameter can be a string, buffer, or even an array.
app.get('*', (req, res) => {
  // return
  res.sendFile(__dirname + '/public/index.html')
});



app.listen(PORT, () =>
  console.log(`Note taker app listening at http://localhost:${PORT}`)
);