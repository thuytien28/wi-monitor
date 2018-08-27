const influx = require('./utils/influx');
const express = require('express');
const moment = require('moment-timezone');
const convertTime = require('./utils/time-convert');
let router = express.Router();

router.post('/response/count', function (req, res) {
	console.log(req.body);
	let query = 'select count(*) from ' + req.body.col;
	influx.query(query).then(result => {
		res.json(result);
	}).catch(err => {
		res.send(err);
	})
});

router.post('/response/all', function (req, res) { 
	let whereClause = "";
	let hours = req.query.hours || 1;
	if (req.query.username) whereClause += " AND username = '" + req.query.username + "'";
	whereClause += " AND time > now() - " + hours + "h";
	let query = "SELECT * FROM " + req.body.col + " WHERE 1=1 " + whereClause;
	console.log(query);
	// influx.query(query).then ((result)=> {
	// 	console.log(result); 
	// }).catch(err => {
	// 	console.log(err);
	// })
	influx.query(query).then(result => {
		convertTime(result).then(r => { 
			res.send(r);
		})
	}).catch(err => { 
		res.send(err);
	})
});

router.post('/response/mean/all', (req, res)=>{
	let whereClause = "";
	let days = req.query.days || 1;
	if (req.query.username) whereClause += " AND username = '" + req.query.username + "'";
	whereClause += " AND time > now() - " + days + "d";
	//let query = "SELECT * FROM three_months.mean_response_times_2 WHERE 1=1 " + whereClause;
	let query = "SELECT * FROM " + req.body.col + " WHERE 1=1 " + whereClause;
	console.log(query);
	influx.query(query).then(result => {
		//console.log(result);
		convertTime(result).then(r => {
			res.send(r);
		})
	}).catch(err => {
		res.send(err);
	});
});

module.exports = router;