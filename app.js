const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Read data from JSON file
const dataPath = 'data.json';
let jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Basic validation middleware
function validateTable1Item(item) {
  if (!item.name || !item.description) {
    throw new Error('Name and description are required for table1 items');
  }

  if (isNaN(item.id)) {
    throw new Error('ID must be a numeric value for table1 items');
  }

  if (/\d/.test(item.name)) {
    throw new Error('First name cannot contain numbers');
  }
}

function validateTable2Item(item) {
  if (!item.title || !item.content) {
    throw new Error('Title and content are required for table2 items');
  }

  if (isNaN(item.id)) {
    throw new Error('ID must be a numeric value for table2 items');
  }
}

// CRUD interface for table1
app.get('/table1', (req, res) => {
  res.json(jsonData.table1);
});

app.post('/table1', (req, res) => {
  try {
    const newItem = req.body;
    validateTable1Item(newItem);
    newItem.id = (jsonData.table1.length + 1).toString();
    jsonData.table1.push(newItem);
    saveData();
    res.json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/table1/:id', (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedItem = req.body;
    validateTable1Item(updatedItem);
    const index = jsonData.table1.findIndex(item => item.id === itemId);

    if (index !== -1) {
      jsonData.table1[index] = updatedItem;
      saveData();
      res.json(updatedItem);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/table1/:id', (req, res) => {
  const itemId = req.params.id;
  const index = jsonData.table1.findIndex(item => item.id === itemId);

  if (index !== -1) {
    const deletedItem = jsonData.table1.splice(index, 1)[0];
    saveData();
    res.json(deletedItem);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// CRUD interface for table2
app.get('/table2', (req, res) => {
  res.json(jsonData.table2);
});

app.post('/table2', (req, res) => {
  try {
    const newItem = req.body;
    validateTable2Item(newItem);
    newItem.id = (jsonData.table2.length + 1).toString();
    jsonData.table2.push(newItem);
    saveData();
    res.json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/table2/:id', (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedItem = req.body;
    validateTable2Item(updatedItem);
    const index = jsonData.table2.findIndex(item => item.id === itemId);

    if (index !== -1) {
      jsonData.table2[index] = updatedItem;
      saveData();
      res.json(updatedItem);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/table2/:id', (req, res) => {
  const itemId = req.params.id;
  const index = jsonData.table2.findIndex(item => item.id === itemId);

  if (index !== -1) {
    const deletedItem = jsonData.table2.splice(index, 1)[0];
    saveData();
    res.json(deletedItem);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Save data to JSON file
function saveData() {
  fs.writeFileSync(dataPath, JSON.stringify(jsonData, null, 2), 'utf-8');
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
