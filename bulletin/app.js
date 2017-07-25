// Bulletin Board Application
// Create a website that allows people to post messages to a page.
// A message consists of a title and a body.
// The site should have two pages:
// - The first page shows people a form where they 
//can add a new message.
// - The second page shows each of the messages people
// have posted.
// Make sure there's a way to navigate the site 
//so users can access each page.

// Messages must be stored in a postgres database.
// Create a "messages" table with three columns:
// column name / column data type:
// - id: serial primary key
// - title: text
// - body: text

const { Client } = require('pg')
const client = new Client({
	database: 'bulletinboard',
  host: 'localhost',
  user: process.env.POSTGRES_USER
})

// connecting to database
client.connect();

//set-up
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('views', './views');
app.set('view engine', 'pug');

// get index page with form
app.get('/', (req, res) => {
	res.render('index');
	});

// posting the message and redirecting to all messages
app.post('/addpost', (req, res) => {
	var title = req.body.title;
	var message = req.body.message;

	console.log(title);
	console.log(message);

	client.query('insert into messages (title, body) values ($1, $2)', [title, message], (err) => {
  	console.log(err ? err.stack : 'new message added to the database')

	res.redirect('/allposts');
})
})

// show all messages
app.get('/allposts', (req, res) => {
	var messages = [];
	client.query('select * from messages', (err, result) => {
		if(err) {
			return console.error('error', err);
		}

		for (let i = 0; i < result.rows.length; i++) {
			var message = {
				'title': result.rows[i].title,
				'body': result.rows[i].body
			}
			messages.push(message);
		}

		console.log(messages)
		console.log(result.rows[0].body)
		res.render('messages', {posts: messages});
	});
});

const server = app.listen(3000, () => {
	console.log('Listening on port: ' + server.address().port);
});