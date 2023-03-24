const express = require('express');
const router = express.Router();
const axios = require('axios');

const { fetch, save, update, fetchRowCount } = require('../../utils/db.js');

// ❓🤨 List Questions (Returns Loaded Questions, Excludes Newly Inserted Qs for some reason ())
// =============================================
//                Questions
// =============================================
// GET /qa/questions
// Parameters: product_id (int), page (int), count (int)
router.get('/questions', async (req, res) => {
	let url = req.url.slice(1)
	// console.log('URL LOG IS RIGHT HERE!', url);

	await fetch(url, (err, payload) => {
		if (err) {
			console.log('FETCH Q\'s Error:', err);
			res.status(500).json(err);
		} else {
			// console.log('Q Data', payload);
			res.status(200).json(payload); // Expected Status: 200 OK
		}
	});
});

// ✅ GET ROW COUNTS
router.get('/questions/:table_name/rows', (req, res) => {
	let table = req.params['table_name'];

	fetchRowCount(table, (err, payload) => {
		if (err) {
			console.log('FETCH Row Count Error:', err);
			res.status(500).json(err);
		} else {
			// console.log('Q Data', payload);
			res.status(200).json(payload); // Expected Status: 200 <row-count>
		}
	});
});

// ✅ Add a Question
// POST /qa/questions
// Body Parameters: body, name, email, product_id
router.post('/questions', async (req, res) => {
	console.log('GOT BODY', req.body);

	const question = {
		product_id: req.body.product_id,
		question_body: req.body.body,
		asker_name: req.body.name,
		asker_email: req.body.email
	};

	await save('questions', question, (err, payload) => {
		if (err) {
			console.log('POST Question Error:', err)
			res.status(500).json(err);
		} else {
			console.log('SAVE Q PAYLOAD: ', payload);
			res.status(201).send('CREATED'); // Expected Status: 201 CREATED
		}
	});

});

// Mark Question as Helpful
// PUT /qa/questions/:question_id/helpful
router.put('/questions/:question_id/helpful', (req, res) => {
	// Parameters: question_id
	update('helpful', { id: req.params['question_id'] }, (err, payload) => {
		if (err) {
			console.log('Report Q Helpful Err', err);
			res.status(500).send(err);
		} else {
			console.log('Report Question HELPFUL SUCCESS: ', payload);
			res.status(204).send('(temp/todo) NO CONTENT'); // Expected Status: 204 NO CONTENT
		}
	});

});

// Report Question
// PUT /qa/questions/:question_id/report
// Parameters: question_id
router.put('/questions/:question_id/report', (req, res) => {
	update('reported', { id: req.params['question_id'], value: true }, (err, payload) => {
		if (err) {
			console.log('Report Question Error: ', err);
			res.status(500).send(err);
		} else {
			console.log('Report Question SUCCESS: ', payload);
			res.status(204).send('NO CONTENT'); // Expected Status: 204 NO CONTENT
		}
	});
});

// =============================================
//                Answers
// =============================================
// ✅ Answers List
// GET /qa/questions/:question_id/answers

//  Parameters: question_id
// Query Parameters: page, count
router.get('/questions/:question_id/answers', (req, res) => {
	let url = req.url.slice(1);
  fetch(url, (err, payload) => {
		if (err) {
			console.log('FETCH A\'s Error:', err);
			res.status(500).json(err);
		} else {
			// console.log('A Data', payload);
			res.status(200).json(payload); // Expected Status: 200 OK
		}
	});
});

// // Add an Answer
// // POST /qa/questions/:question_id/answers
// router.post('/questions/:question_id/answers', (req, res) => {
// 	// Parameters: question_id
// 	// Body Parameters: body, name, email, photos
// 	save();
// 	res.status(201).send('CREATED'); // Expected Response: Status: 201 CREATED
// });

// // Mark Answer as Helpful
// // PUT /qa/answers/:answer_id/helpful
// router.put('/answers/:answer_id/helpful', (req, res) => {
// 	// Parameters: answer_id
// 	res.status(204).send('NO CONTENT'); // Expected Status: 204 NO CONTENT
// });

// // Report Answer
// // PUT /qa/answers/:answer_id/report
// router.put('/answers/:answer_id/report', (req, res) => {
// 	// Parameters: answer_id
// 	res.status(204).send('NO CONTENT'); // Expected Status: 204 NO CONTENT
// });

module.exports = router;