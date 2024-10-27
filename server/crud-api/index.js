const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let items = [];
let id = 1;

// CREATE
app.post('/items', (req, res) => {
  const newItem = { id: id++, ...req.body };
  items.push(newItem);
  res.json(newItem);
});

// READ
app.get('/items', (req, res) => {
  res.json(items);
});

// UPDATE
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const index = items.findIndex((item) => item.id == id);
  if (index >= 0) {
    items[index] = { id: Number(id), ...req.body };
    res.json(items[index]);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// DELETE
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  items = items.filter((item) => item.id != id);
  res.json({ message: "Item deleted" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));