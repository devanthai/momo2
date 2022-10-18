const crypto = require("crypto");
const axios = require("axios");
const Lichsuck = require('../models/LichSuCk')




const { v4: uuidv4 } = require("uuid");
const MMModel = require("../models/momo.model");
const HttpsProxyAgent = require("https-proxy-agent");
// util functions
const md5 = (data) => crypto.createHash("md5").update(data).digest("hex");
const sha256 = (data) => crypto.createHash("sha256").update(data).digest("hex");
const randomkey = (len) =>
	crypto.randomBytes(len).toString("hex").substring(len);

async function getProxy() {
	let { data: dataProxy } = await axios.post(
		"https://tmproxy.com/api/proxy/get-current-proxy",
		{
			api_key: "",
		}
	);
	if (dataProxy.code != 0 || dataProxy.data.next_request == 0) {
		let { data: dataProxys } = await axios.post(
			"https://tmproxy.com/api/proxy/get-new-proxy",
			{
				api_key: "",
				sign: "string",
				id_location: 0,
			}
		);
		if (dataProxys.code != 5 && dataProxys.code != 0)
			throw new Error(
				"Hiện tại đang gặp lỗi từ Server vui lòng báo admin để fix"
			);
		const ipPort = dataProxys.data.https.split(":");
		const proxy = new HttpsProxyAgent({
			host: ipPort[0],
			port: ipPort[1],
		});
		axios.default.httpsAgent = proxy;
		return proxy;
	}
	const ipPort = dataProxy.data.https.split(":");
	const proxy = new HttpsProxyAgent({
		host: ipPort[0],
		port: ipPort[1],
	});
	axios.default.httpsAgent = proxy;

	return proxy;
}

const config = {
	appVer: 31152,
	appCode: "3.1.15",
	rkey: "01234567890123456789",
	ENCRYPT_KEY:
		"-----BEGIN RSA PUBLIC KEY-----\r\nMEgCQQDjtTNZJnbMWXON/mhhLzENzQW8TOH/gaOZ72u6FEzfjyWSfGsP6/rMIVjY\r\n2w44ZyqNG2p45PGmp3Y8bquPAQGnAgMBAAE=\r\n-----END RSA PUBLIC KEY-----\r\n",
};

async function encryptAES(body, key) {
	let iv = Buffer.alloc(16),
		cipher = crypto.createCipheriv("aes-256-cbc", key.substring(0, 32), iv),
		part1 = cipher.update(body, "utf8"),
		part2 = cipher.final();
	return Buffer.concat([part1, part2]).toString("base64");
}
async function decryptAES(body, key) {
	let iv = Buffer.alloc(16),
		cipher = crypto.createDecipheriv("aes-256-cbc", key.substring(0, 32), iv);
	return cipher.update(body, "base64") + cipher.final("utf8");
}
function encryptRSA(body) {
	return crypto
		.publicEncrypt(
			{ key: config.ENCRYPT_KEY, padding: crypto.constants.RSA_PKCS1_PADDING },
			Buffer.from(body)
		)
		.toString("base64");
}
async function decryptRSA(body) {
	return crypto.privateDecrypt("", Buffer.from(body, "base64")).toString();
}
async function checkSum(data, type, times) {
	let checkSumSyntax = `${data.phone}${times}000000${type}${times / 1000000000000.0
		}E12`;
	return await encryptAES(checkSumSyntax, data.setupKey);
}

// async function Re_Login(phone, pass) {
// 	await getUser(phone);
// 	let url = "https://api.momo.vn/backend/otp-app/public/RE_LOGIN",
// 		times = new Date().getTime(),
// 		imei = uuidv4(),
// 		dataBody = {
// 			user: phone,
// 			msgType: 'RE_LOGIN',
// 			cmdId: times + '000000',
// 			lang: "vi",
// 			time: times,
// 			channel: "APP",
// 			appVer: config.appVer,
// 			appCode: config.appCode,
// 			deviceOS: "IOS",
// 			buildNumber: 0,
// 			appId: "vn.momo.platform",
// 			result: true,
// 			errorCode: 0,
// 			errorDesc: '',
// 			momoMsg: {
// 				_class: 'mservice.backend.entity.msg.RegDeviceMsg',
// 				number: phone,
// 				imei: imei,
// 				cname: 'Vietnam',
// 				ccode: '084',
// 				device: 'iPhone 12',
// 				firmware: '15.0',
// 				hardware: 'iPhone',
// 				manufacture: 'Apple',
// 				csp: 'Viettel',
// 				icc: '',
// 				mcc: '452',
// 				mnc: '04',
// 				device_os: 'IOS',
// 			},
// 			extra: {
// 				rkey: 'dfec5f538bba252fd70704dd97e28f0578577e3657eadd32869972cc76a4c76a',
// 				AAID: '',
// 				IDFA: '',
// 				TOKEN: '',
// 				SIMULATOR: 'false',
// 				MODELID: 'D188013A-D0C4-49B9-8794-2B4A86441A63',
// 				DEVICE_TOKEN: "",
// 				checkSum: ""
// 			}
// 		},
// 		checkheader = {
// 			Msgtype: "RE_LOGIN",
// 			Accept: 'application/json',
// 			'Content-Type': 'application/json'
// 		},
// 		{ data: res } = await axios.post(url, dataBody, {
// 			headers: checkheader,
// 		});
// 	if (!res.result)
// 		throw new Error(res.errorDesc);
// 	let setupKey = await decryptAES(res.extra.setupKey, res.extra.rkey),
// 		phash = await encryptAES(`${imei}|${pass}`, setupKey),
// 		name = res.extra.NAME;
// 	await MMModel.findOneAndUpdate({ phone }, {
// 		$set: {
// 			phone, pass, imei, setupKey, phash, name
// 		},
// 	}, { upsert: true });
// 	checkValidSession(phone, true);
// 	return []
// }

async function getUser(phone) {
	let url = "https://api.momo.vn/backend/auth-app/public/CHECK_USER_BE_MSG",
		times = new Date().getTime();
	(dataBody = {
		user: phone,
		msgType: "CHECK_USER_BE_MSG",
		cmdId: times + "000000",
		lang: "vi",
		time: times,
		channel: "APP",
		appVer: config.appVer,
		appCode: config.appCode,
		deviceOS: "IOS",
		buildNumber: 0,
		appId: "vn.momo.platform",
		result: true,
		errorCode: 0,
		errorDesc: "",
		momoMsg: {
			_class: "mservice.backend.entity.msg.RegDeviceMsg",
			number: phone,
			imei: "71ddaf6b-7f8d-42e8-886b-8c0f6d03e4fc",
			cname: "Vietnam",
			ccode: "084",
			device: "iPhone 12",
			firmware: "15.0",
			hardware: "iPhone",
			manufacture: "Apple",
			csp: "Viettel",
			icc: "",
			mcc: "452",
			mnc: "04",
			device_os: "IOS",
		},
		extra: { checkSum: "" },
	}),
		(checkheader = {
			Msgtype: "SEND_OTP_MSG",
			Accept: "application/json",
			"Content-Type": "application/json",
		}),
		({ data: res } = await axios.post(url, dataBody, {
			headers: checkheader,
		}));
	//console.log(res)
	if (!res.result) throw new Error(res.errorDesc);
	return { name: res.extra.NAME, name_kyc: res.extra.NAME_KYC };
}
async function GET_OTP(phone, pass) {
	await getUser(phone);
	let url = "https://api.momo.vn/backend/otp-app/public/SEND_OTP_MSG",
		times = new Date().getTime(),
		imei = uuidv4(),
		dataBody = {
			user: phone,
			msgType: "SEND_OTP_MSG",
			cmdId: times + "000000",
			lang: "vi",
			time: times,
			channel: "APP",
			appVer: config.appVer,
			appCode: config.appCode,
			deviceOS: "IOS",
			buildNumber: 0,
			appId: "vn.momo.platform",
			result: true,
			errorCode: 0,
			errorDesc: "",
			momoMsg: {
				_class: "mservice.backend.entity.msg.RegDeviceMsg",
				number: phone,
				imei: imei,
				cname: "Vietnam",
				ccode: "084",
				device: "iPhone 12",
				firmware: "15.0",
				hardware: "iPhone",
				manufacture: "Apple",
				csp: "Viettel",
				icc: "",
				mcc: "452",
				mnc: "04",
				device_os: "IOS",
			},
			extra: {
				action: "SEND",
				rkey: "01234567890123456789",
				AAID: "",
				IDFA: "",
				TOKEN: "",
				SIMULATOR: "false",
				isVoice: false,
				REQUIRE_HASH_STRING_OTP: true,
				MODELID: imei,
				DEVICE_TOKEN: "",
				checkSum: "",
			},
		},
		checkheader = {
			Msgtype: "SEND_OTP_MSG",
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		{ data: res } = await axios.post(url, dataBody, {
			headers: checkheader,
		});
	if (!res.result) throw new Error(res.errorDesc);
	await MMModel.findOneAndUpdate(
		{ phone },
		{
			$set: {
				phone,
				pass,
				imei,
			},
		},
		{ upsert: true }
	);
	return [];
}
async function Check_OTP(phone, otp) {
	let currentAccount = await checkValidSession(phone, false),
		url = "https://api.momo.vn/backend/otp-app/public/REG_DEVICE_MSG",
		times = new Date().getTime(),
		dataBody = {
			user: phone,
			msgType: "REG_DEVICE_MSG",
			cmdId: times + "000000",
			lang: "vi",
			time: times,
			channel: "APP",
			appVer: config.appVer,
			appCode: config.appCode,
			deviceOS: "IOS",
			buildNumber: 0,
			appId: "vn.momo.platform",
			result: true,
			errorCode: 0,
			errorDesc: "",
			momoMsg: {
				_class: "mservice.backend.entity.msg.RegDeviceMsg",
				number: phone,
				imei: currentAccount.imei,
				cname: "Vietnam",
				ccode: "084",
				device: "iPhone 12",
				firmware: "15.0",
				hardware: "iPhone",
				manufacture: "Apple",
				csp: "Viettel",
				icc: "",
				mcc: "452",
				mnc: "04",
				device_os: "IOS",
			},
			extra: {
				ohash: sha256(phone + "01234567890123456789" + otp),
				AAID: "",
				IDFA: "",
				TOKEN: "",
				SIMULATOR: "false",
			},
		},
		checkheader = {
			Msgtype: "REG_DEVICE_MSG",
			Accept: "application/json",
			"Content-Type": "application/json",
			Userhash: md5(phone),
		},
		{ data: res } = await axios.post(url, dataBody, {
			headers: checkheader,
		});
	if (!res.result) throw new Error(res.errorDesc);

	let setupKey = await decryptAES(res.extra.setupKey, res.extra.ohash),
		phash = await encryptAES(
			`${currentAccount.imei}|${currentAccount.pass}`,
			setupKey,

		),
		name = res.extra.NAME;

	await MMModel.findOneAndUpdate(
		{ phone },
		{
			$set: {
				setupKey,
				phash,
				name
			},
		}
	);
	await login(phone);
	return [];
}
async function checkValidSession(phone, status = true) {
	let currentAccount = await MMModel.findOne({ phone }).lean();
	if (!currentAccount) throw new Error("Chưa có thông tin trong hệ thống.");
	//await getProxy();
	if (status && new Date() - currentAccount.updatedAt > 1740000)
		currentAccount = await GENERATE_TOKEN(currentAccount, phone);
	return currentAccount;
}
async function login(phone) {
	await MMModel.findOneAndUpdate({ phone: phone }, { agentId: "" })
	let currentAccount = await MMModel.findOne({ phone }).lean();
	(url = "https://owa.momo.vn/public/login"),
		(times = new Date().getTime()),
		(checksum = await checkSum(currentAccount, "USER_LOGIN_MSG", times)),
		(dataBody = {
			user: phone,
			pass: currentAccount.pass,
			msgType: "USER_LOGIN_MSG",
			cmdId: times + "000000",
			lang: "vi",
			time: times,
			channel: "APP",
			appVer: config.appVer,
			appCode: config.appCode,
			deviceOS: "IOS",
			buildNumber: 0,
			appId: "vn.momo.platform",
			result: true,
			errorCode: 0,
			errorDesc: "",
			momoMsg: {
				_class: "mservice.backend.entity.msg.LoginMsg",
				isSetup: true,
			},
			extra: {
				checkSum: checksum,
				pHash: currentAccount.phash,
				AAID: "",
				IDFA: "",
				TOKEN: "",
				SIMULATOR: "false",
			},
		}),
		(checkheader = {
			Msgtype: "USER_LOGIN_MSG",
			Accept: "application/json",
			"Content-Type": "application/json",
			Userhash: md5(phone),
		}),
		({ data: res } = await axios.post(url, dataBody, {
			headers: checkheader,
		}));

	if (!res.result)
		throw new Error(res.errorDesc || "Login thất bại, vui lòng đăng nhập lại");
	await MMModel.findOneAndUpdate(
		{ phone },
		{
			$set: {
				agentId: res.momoMsg.agentId,
				token: res.extra.AUTH_TOKEN,
				refresh_token: res.extra.REFRESH_TOKEN,
			},
		}
	);
	try {
		await getBalance(phone)
	}
	catch {

	}
	return await MMModel.findOne({ phone }).lean();
}


async function getLink(phone) {
	let currentAccount = await checkValidSession(phone),
		url = "https://api.momo.vn/p2p/money-request-link/",
		times = new Date().getTime(),



		data = {
			app_code: "3.1.14",
			msgtype: "GET_CUSTOM_MONEY_REQUEST_LINKS",
			userId: phone,
			fromTime: times - begin * 1000,
			toTime: times,
			limit: 50,
			cursor: "",
		},
		checkheader = {
			Accept: "application/json",
			Authorization: `Bearer ${currentAccount.token}`,
		},
		{ data: res } = await axios.post(url, data, {
			headers: checkheader,
		});
	if (!res.success) throw new Error(res.errorDesc || "Hệ thống momo đang lỗi");
	var transactions = [],
		datas = res.message.data.notifications;
	console.log(res)
	for (var i in datas) {
		if (datas[i].refId == "receive_money_p2p") {
			let extra = JSON.parse(datas[i].extra);
			transactions.push({
				tranId: extra.tranId,
				partnerId: extra.partnerId,
				partnerName: extra.partnerName,
				amount: extra.amount,
				comment: extra.comment,
				time: datas[i].time,
			});
		}
	}
	return transactions;
}

async function getNoti(phone, begin) {
	let currentAccount = await checkValidSession(phone),
		url = "https://m.mservice.io/hydra/v2/user/noti",
		times = new Date().getTime(),
		data = {
			userId: phone,
			fromTime: times - begin * 1000,
			toTime: times,
			limit: 50,
			cursor: "",
		},
		checkheader = {
			Accept: "application/json",
			Authorization: `Bearer ${currentAccount.token}`,
		},
		{ data: res } = await axios.post(url, data, {
			headers: checkheader,
		});
	if (!res.success) throw new Error(res.errorDesc || "Hệ thống momo đang lỗi");
	var transactions = [],
		datas = res.message.data.notifications;
	//console.log(res.message.data.notifications)
	for (var i in datas) {
		let extra = JSON.parse(datas[i].extra);
		//console.log(extra)
		if (datas[i].refId == "receive_money_p2p") {

			transactions.push({
				tranId: extra.tranId,
				partnerId: extra.partnerId,
				partnerName: extra.partnerName,
				amount: extra.amount,
				comment: extra.comment,
				time: datas[i].time,
			});
		}
	}
	return transactions;
}



async function getNoti2(phone, begin) {
	let currentAccount = await checkValidSession(phone),
		url = "https://m.mservice.io/hydra/v2/user/noti",
		times = new Date().getTime(),
		data = {
			userId: phone,
			fromTime: times - begin * 1000,
			toTime: times,
			limit: 50,
			cursor: "",
		},
		checkheader = {
			Accept: "application/json",
			Authorization: `Bearer ${currentAccount.token}`,
		},
		{ data: res } = await axios.post(url, data, {
			headers: checkheader,
		});
	if (!res.success) throw new Error(res.errorDesc || "Hệ thống momo đang lỗi");
	var transactions = [],
		datas = res.message.data.notifications;
	//console.log(res.message.data.notifications)

	return datas;
}


async function getTranshis(phone, begin, end, limit, currentAccounts = null) {
	let currentAccount = currentAccounts || (await checkValidSession(phone)),
		keyrd = randomkey(32),
		requestkey = encryptRSA(keyrd),
		url = "https://api.momo.vn/sync/transhis/browse",
		times = new Date().getTime(),
		data = await encryptAES(
			JSON.stringify({
				requestId: times,
				startDate: begin,
				endDate: end,
				offset: 0,
				limit,
				lang: "vi",
				channel: "APP",
				appVer: config.appVer,
				appCode: config.appCode,
				deviceOS: "IOS",
				buildNumber: 3779,
				appId: "vn.momo.transactionhistory",
			}),
			keyrd
		),
		checkheader = {
			"Content-Type": "application/json",
			requestkey: requestkey,
			Authorization: `Bearer ${currentAccount.token}`,
		},
		{ data: res } = await axios.post(url, data, {
			headers: checkheader,
		}),
		response = JSON.parse(await decryptAES(res, keyrd));
	if (response.resultCode != 0)
		throw new Error(response.message || "Lỗi chưa xác định");
	return response;
}
async function getTranId(phone, tranId, currentAccounts = null) {
	let currentAccount = currentAccounts || (await checkValidSession(phone)),
		keyrd = randomkey(32),
		requestkey = encryptRSA(keyrd),
		url = "https://api.momo.vn/sync/transhis/details",
		times = new Date().getTime(),
		data = await encryptAES(
			JSON.stringify({
				requestId: times,
				transId: tranId,
				serviceId: "transfer_p2p",
				lang: "vi",
				channel: "APP",
				appVer: config.appVer,
				appCode: config.appCode,
				deviceOS: "IOS",
				buildNumber: 3779,
				appId: "vn.momo.transactionhistory",
			}),
			keyrd
		),
		checkheader = {
			"Content-Type": "application/json",
			requestkey: requestkey,
			Authorization: `Bearer ${currentAccount.token}`,
		},
		{ data: res } = await axios.post(url, data, {
			headers: checkheader,
		}),
		response = JSON.parse(await decryptAES(res, keyrd));
	if (response.resultCode != 0)
		throw new Error(response.message || "Không tìm thấy mã gd này");
	let oldData = {};
	let comment = null;


	//console.log(response)
	try {
		if (!response.momoMsg.serviceData) {
			oldData = JSON.parse(response.momoMsg.oldData);

			comment = oldData.commentValue;
		} else {
			oldData = JSON.parse(response.momoMsg.serviceData);
			comment = oldData.COMMENT_VALUE;
		}
	} catch (ex) { console.log(ex.message) }
	if (comment == undefined || comment == null) {
		//console.log(response.momoMsg)
	}
//	console.log(response.momoMsg.transId, comment)
	//console.log(response)
	const transactions = {
		phone,
		transId: response.momoMsg.transId,
		io: response.momoMsg.io,
		partnerId: response.momoMsg.sourceId,
		partnerName: response.momoMsg.sourceName,

		targetId: response.momoMsg.targetId,
		targetName: response.momoMsg.targetName,

		serviceData: response.momoMsg.serviceData,

		amount: response.momoMsg.totalOriginalAmount,
		postBalance: response.momoMsg.postBalance,
		time: response.momoMsg.lastUpdate,
		comment: comment,
	};

	return transactions;
}
async function getBalance(phone, currentAccounts = null) {
	let currentAccount = currentAccounts || (await checkValidSession(phone)),
		keyrd = randomkey(32),
		requestkey = encryptRSA(keyrd),
		url = "https://owa.momo.vn/api/SOF_GROUP_LIST_MSG",
		times = new Date().getTime(),
		checksum = await checkSum(currentAccount, "SOF_GROUP_LIST_MSG", times),
		data = await encryptAES(
			JSON.stringify({
				user: phone,
				msgType: "SOF_GROUP_LIST_MSG",
				cmdId: times + "000000",
				lang: "vi",
				time: times,
				channel: "APP",
				appVer: config.appVer,
				appCode: config.appCode,
				deviceOS: "IOS",
				buildNumber: 0,
				appId: "vn.momo.platform",
				result: true,
				errorCode: 0,
				errorDesc: "",
				momoMsg: {
					_class: "mservice.backend.entity.msg.ForwardMsg",
				},
				extra: {
					checkSum: checksum,
				},
			}),
			keyrd
		),
		checkheader = {
			msgtype: "SOF_GROUP_LIST_MSG",
			userid: phone,
			requestkey,
			Authorization: `Bearer ${currentAccount.token}`,
		},
		{ data: res } = await axios.post(url, data, { headers: checkheader });
	response = JSON.parse(await decryptAES(res, keyrd));
	if (!response.result)
		throw new Error(response.errorDesc || "Lỗi chưa xác định");

	try {
		await MMModel.findOneAndUpdate({ phone: phone }, { sotien: response.momoMsg.momo[0].balance })
	}
	catch { }

	return { balance: response.momoMsg.momo[0].balance } || {};
	/*
	  [
		  {
			  type: 1,
			  moneySource: 1,
			  logo: "https://img.mservice.io/momo_app_v2/new_version/img/appx_icon/logo_momo.png",
			  sourceName: "Ví MoMo",
			  displayName: "Ví MoMo",
			  balance: 1000,
			  description: "Miễn phí thanh toán",
			  detail: {
				  allowAutoPick: true
			  }
		  }
	  ]*/
}
async function getDetails(phone, tranId, currentAccounts = null) {
	let currentAccount = currentAccounts || (await checkValidSession(phone)),
		keyrd = randomkey(32),
		requestkey = encryptRSA(keyrd),
		url = "https://api.momo.vn/sync/transhis/details",
		times = new Date().getTime(),
		dataBody = await encryptAES(
			JSON.stringify({
				requestId: times,
				transId: tranId,
				serviceId: "transfer_p2p",
				lang: "vi",
				channel: "APP",
				appVer: config.appVer,
				appCode: config.appCode,
				deviceOS: "IOS",
				buildNumber: 3779,
				appId: "vn.momo.transactionhistory",
			}),
			keyrd
		),
		checkheader = {
			"Content-Type": "application/json",
			requestkey: requestkey,
			Authorization: `Bearer ${currentAccount.token}`,
		},
		{ data: res } = await axios.post(url, JSON.stringify(dataBody), {
			headers: checkheader,
		}),
		response = JSON.parse(await decryptAES(res, keyrd));
	if (response.resultCode != 0) return [response.resultCode, null];
	let oldData = {};
	let comment = null;
	//	console.log(response)
	// if (!response.momoMsg.serviceData) {
	// 	oldData = JSON.parse(response.momoMsg.oldData);

	// 	comment = oldData.commentValue;
	// } else {
	oldData = JSON.parse(response.momoMsg.serviceData);
	comment = oldData.COMMENT_VALUE;
	//	}
	console.log(comment)
	var transactions = [
		0,
		{
			io: response.momoMsg.io,
			transId: response.momoMsg.transId,
			partnerId: response.momoMsg.sourceId,
			partnerName: response.momoMsg.sourceName,
			amount: response.momoMsg.totalOriginalAmount,
			postBalance: response.momoMsg.postBalance,
			time: response.momoMsg.lastUpdate,
			comment: comment,
		},
	];
	return transactions;
}
async function Transhis_p2p(phone, begin, end, limit) {
	let currentAccount = await checkValidSession(phone),
		response = await getTranshis(phone, begin, end, limit, currentAccount),
		datas = response.momoMsg,
		onedayago = new Date().setHours(0, 0, 0, 0),
		transactions = [];

	for (var i in datas) {

		const checkz = await Lichsuck.findOne({ magd: datas[i].transId })
		if (!checkz) {
			if (
				(datas[i].serviceId == "transfer_p2p" ||
					datas[i].serviceId == "transfer_via_chat") &&
				(datas[i].io == 1 || datas[i].io == -1) &&
				datas[i].lastUpdate >= onedayago
			) {
				let tras = await getDetails(phone, datas[i].transId, currentAccount);
				if (tras[0] == 0) transactions.push(tras[1]);
			}
		}
	}
	return transactions;
}
async function Oder_cash(currentAccount, sdt, amount, name, comment) {
	let keyrd = randomkey(32),
		requestkey = encryptRSA(keyrd),
		url = "https://owa.momo.vn/api/M2MU_INIT",
		times = new Date().getTime(),
		checksum = await checkSum(currentAccount, "M2MU_INIT", times),
		data = await encryptAES(
			JSON.stringify({
				user: currentAccount.phone,
				msgType: "M2MU_INIT",
				cmdId: times + "000000",
				lang: "vi",
				time: times,
				channel: "APP",
				appVer: config.appVer,
				appCode: config.appCode,
				deviceOS: "IOS",
				buildNumber: 0,
				appId: "vn.momo.platform",
				result: true,
				errorCode: 0,
				errorDesc: "",
				momoMsg: {
					clientTime: times,
					tranType: 2018,
					comment,
					amount,
					partnerId: sdt,
					partnerName: name,
					ref: "",
					serviceCode: "transfer_p2p",
					serviceId: "transfer_p2p",
					_class: "mservice.backend.entity.msg.M2MUInitMsg",
					tranList: [
						{
							partnerName: name,
							partnerId: sdt,
							originalAmount: amount,
							serviceCode: "transfer_p2p",
							stickers: "",
							themeUrl:
								"https://img.mservice.com.vn/app/img/transfer/theme/theme_tet_750x260.png",
							transferSource: "",
							socialUserId: "",
							chatId: "",
							receiverType: 1,
							_class: "mservice.backend.entity.msg.M2MUInitMsg",
							tranType: 2018,
							comment,
							moneySource: 1,
							partnerCode: "momo",
							serviceMode: "transfer_p2p",
							serviceId: "transfer_p2p",
							extras:
								'{"loanId":0,"appSendChat":false,"loanIds":[],"stickers":"","themeUrl":"https://img.mservice.com.vn/app/img/transfer/theme/theme_tet_750x260.png","vpc_CardType":"SML","vpc_TicketNo":"171.250.164.186","vpc_PaymentGateway":""}',
						},
					],
					extras:
						'{"loanId":0,"appSendChat":false,"loanIds":[],"stickers":"","themeUrl":"https://img.mservice.com.vn/app/img/transfer/theme/theme_tet_750x260.png","vpc_CardType":"SML","vpc_TicketNo":"171.250.164.186","vpc_PaymentGateway":""}',
					moneySource: 1,
					defaultMoneySource: 1,
					partnerCode: "momo",
					rowCardId: "",
					giftId: "",
					useVoucher: 0,
					discountCode: null,
					prepaidIds: "",
					usePrepaid: 0,
				},
				extra: {
					checkSum: checksum,
				},
			}),
			keyrd
		),
		checkheader = {
			requestkey: requestkey,
			userid: currentAccount.phone,
			Authorization: `Bearer ${currentAccount.token}`,
		},
		{ data: res } = await axios.post(url, data, {
			headers: checkheader,
		});
	if (!res) {
		throw new Error("Lỗi kết quả dữ liệu từ server Momo.");
	}
	let response = JSON.parse(await decryptAES(res, keyrd));

	if (!response.result) {
		throw new Error(response.errorDesc || "Lỗi dữ liệu từ server Momo.");
	}

	return {
		ids: response.momoMsg.replyMsgs[0].ID,
		tranHisMsg: response.momoMsg.replyMsgs[0].tranHisMsg,
	};
}
async function Comfirm_oder(phone, sdt, amount, comment) {
	// if (hash != md5(phone + "xsowz.dev")) {
	// 	throw new Error("Không có quyền truy cập.");
	// }
	let currentAccount = await checkValidSession(phone),
		check = await getBalance(phone, currentAccount);
	if (check.balance < amount)
		throw new Error("Số dư không đủ để chuyển khoảng.");
	//{ name_kyc } = await getUser(phone),
	let name_kyc = "Nguyen Van A",
		{ ids, tranHisMsg } = await Oder_cash(
			currentAccount,
			sdt,
			amount,
			name_kyc,
			comment
		),
		keyrd = randomkey(32),
		requestkey = encryptRSA(keyrd),
		url = "https://owa.momo.vn/api/M2MU_CONFIRM",
		times = new Date().getTime(),
		checksum = await checkSum(currentAccount, "M2MU_CONFIRM", times),
		data = await encryptAES(
			JSON.stringify({
				user: currentAccount.phone,
				msgType: "M2MU_CONFIRM",
				pass: currentAccount.pass,
				cmdId: times + "000000",
				lang: "vi",
				time: times,
				channel: "APP",
				appVer: config.appVer,
				appCode: config.appCode,
				deviceOS: "IOS",
				buildNumber: 0,
				appId: "vn.momo.platform",
				result: true,
				errorCode: 0,
				errorDesc: "",
				momoMsg: {
					otpType: "NA",
					ipAddress: "N/A",
					enableOptions: {
						voucher: true,
						discount: true,
						prepaid: true,
						desc: "",
					},
					_class: "mservice.backend.entity.msg.M2MUConfirmMsg",
					quantity: 1,
					idFirstReplyMsg: ids,
					moneySource: 1,
					cbAmount: 0,
					tranHisMsg,
					desc: "Thành công",
					error: 0,
					tranType: 2018,
					ids: [ids],
					amount,
					originalAmount: amount,
					fee: 0,
					feeCashIn: 0,
					feeMoMo: 0,
					cashInAmount: amount,
					otp: "",
					extras: "{}",
				},
				extra: {
					checkSum: checksum,
				},
			}),
			keyrd
		),
		checkheader = {
			requestkey: requestkey,
			userid: currentAccount.phone,
			Authorization: `Bearer ${currentAccount.token}`,
		},
		{ data: res } = await axios.post(url, data, {
			headers: checkheader,
		});
	if (!res) {
		throw new Error("Lỗi kết quả dữ liệu từ server Momo.");
	}
	let response = JSON.parse(await decryptAES(res, keyrd));

	if (!response.result) {
		throw new Error(response.errorDesc || "Lỗi dữ liệu từ server Momo.");
	}

	try {
		await MMModel.findOneAndUpdate({ phone }, { sotien: response.extra.BALANCE })
	}
	catch { }


	return {
		msg: response.momoMsg.replyMsgs[0].tranHisMsg.desc,
		balance: response.extra.BALANCE,
		transId: response.momoMsg.replyMsgs[0].transId,
	};
}
async function GENERATE_TOKEN(currentAccount, phone) {
	let url =
		"https://api.momo.vn/backend/auth-app/public/GENERATE_TOKEN_AUTH_MSG",
		times = new Date().getTime(),
		checksum = await checkSum(currentAccount, "GENERATE_TOKEN_AUTH_MSG", times),
		data = JSON.stringify({
			user: currentAccount.phone,
			msgType: "GENERATE_TOKEN_AUTH_MSG",
			cmdId: times + "000000",
			lang: "vi",
			time: times,
			channel: "APP",
			appVer: config.appVer,
			appCode: config.appCode,
			deviceOS: "IOS",
			buildNumber: 0,
			appId: "vn.momo.platform",
			result: true,
			errorCode: 0,
			errorDesc: "",
			momoMsg: {
				_class: "mservice.backend.entity.msg.RefreshTokenMsg",
				refreshToken: currentAccount.refresh_token,
			},
			extra: {
				AAID: "",
				IDFA: "",
				TOKEN: "",
				ONESIGNAL_TOKEN: "",
				SIMULATOR: "false",
				MODELID: currentAccount.imei,
				DEVICE_TOKEN: "",
				checkSum: checksum,
			},
		}),
		checkheader = {
			userid: currentAccount.phone,
			Authorization: `Bearer ${currentAccount.token}`,
		},
		{ data: response } = await axios.post(url, data, {
			headers: checkheader,
			validateStatus: () => true
		});
	if (!response) {
		throw new Error("Lỗi kết quả dữ liệu từ server Momo.");
	}
	//let response = JSON.parse(await decryptAES(res, keyrd));

	if (!response.result) {
		let checkLogin = await login(phone);
		if (!checkLogin)
			throw new Error(
				response.errorDesc ||
				`Lấy Authorization thất bại. [${response.errorCode}]`
			);
	} else
		await MMModel.findOneAndUpdate(
			{ phone },
			{
				$set: {
					token: response.extra.AUTH_TOKEN,
				},
			}
		);
	return await MMModel.findOne({ phone }).lean();
}

async function createRoom(phone, targetPhone) {
	try {
		let currentAccount = await checkValidSession(phone),
			url = "https://m.mservice.io/helios/chat-api/v1/room/create",
			data = { "partnerIds": [targetPhone] },
			checkheader = {
				Accept: "application/json",
				Authorization: `Bearer ${currentAccount.token}`,
			},
			{ data: res } = await axios.post(url, data, {
				headers: checkheader,
			});
		if (!res.success) {
			return { error: true, message: "Lỗi không xác định", data: res }
		}
		else {
			if (res.error) {
				return { error: true, message: "Lỗi", data: res }
			}
			else {
				return { error: false, message: "ok", data: res }
			}
		}
	} catch (ex) {
		return { error: true, message: "Loi", data: ex.message }
	}
}

async function getRoom(phone, targetPhone) {
	try {
		let currentAccount = await checkValidSession(phone),
			url = "https://m.mservice.io/helios/chat-api/v1/room/get/room",
			data = { "roomId": "", "partnerIds": [targetPhone], "trackingId": "", "source": "" },
			checkheader = {
				Accept: "application/json",
				Authorization: `Bearer ${currentAccount.token}`,
			},
			{ data: res } = await axios.post(url, data, {
				headers: checkheader,
			});
		if (!res.success) {
			return { error: true, message: "Lỗi không xác định", data: res }
		}
		else {
			if (res.error) {
				return { error: true, message: "Lỗi", data: res }
			}
			else {
				return { error: false, message: "ok", data: res }
			}
		}
	} catch (ex) {
		return { error: true, message: "Loi", data: ex.message }
	}
}

module.exports = {createRoom,getRoom,
	getDetails,
	getUser,
	GET_OTP,
	Check_OTP,
	getNoti,
	getNoti2,
	login,
	getTranId,
	getBalance,
	Transhis_p2p,
	Comfirm_oder,
	getTranshis,
	GENERATE_TOKEN,
};
