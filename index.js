const express = require('express');
const multer = require("multer");
const path = require('path'); // Add this line for the path module

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/images");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public'));

// In-memory task storage
let tasks = [];

// Display tasks
app.get('/tasks', (req, res) => {

    res.render('tasks', { tasks, taskIndex: 0 }); // Replace 0 with the appropriate index value

});

app.post("/create-task", upload.single("taskImage"), async (req, res) => {
  const taskName = req.body.taskName;
  let taskImage = "";

  tasks.push({ name: taskName, image: taskImage });
  res.redirect("/tasks");
});

app.post('/edit-task', upload.single('taskImage'), (req, res) => {
  const taskIndex = req.body.taskIndex;
  const updatedTaskName = req.body.updatedTaskName;

  if (taskIndex >= 0 && taskIndex < tasks.length) {
    const task = tasks[taskIndex];
    task.name = updatedTaskName;

    if (req.file) {
      task.image = '/images/' + req.file.filename;
    }
  }

  res.redirect('/tasks');
});

// Delete a task
app.post('/delete-task', (req, res) => {
  const taskIndex = req.body.taskIndex;
  tasks.splice(taskIndex, 1);
  res.redirect('/tasks');
});

// Start the server
app.listen(port, () => {
  console.log(`Task management app listening at http://localhost:${port}`);
});