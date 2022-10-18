const mongoose = require('mongoose');

const { Schema } = mongoose;

const MMModel = new Schema({
	agentId:{ type: String },
	phone: { type: String, unique: true, dropDups: true },
	pass: { type: String },
	otp: { type: String },
	setupKey: { type: String },
	phash: { type: String },
	imei: { type: String },
	token: { type: String },
	refresh_token: { type: String },
	name: { type: String, default: "null" },
	sotien: { type: Number, default: 0 },
	gioihan: { type: Number, default: 0 },
	status: { type: Number, default: 0 },
	gioihanthang: { type: Number, default: 0 },
	gioihanngay: { type: Number, default: 0 },
	solan: { type: Number, default: 0 }
},
	{ timestamps: true },
);

module.exports = mongoose.model('Momo', MMModel);