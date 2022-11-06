const mongoose = require('mongoose');
const Cuoc = require('./models/Cuoc')

mongoose.connect("mongodb://127.0.0.1:27017/momo", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }, () =>
{
    console.log('Connected to db')

    Cuoc.aggregate([
        { $match: { } }
        ,
        {
            $group: {
                _id: {
                    "sdtchuyen": "$sdtchuyen"
                },
                "tiencuoc": { $sum: "$tiencuoc" }
            }
        },
        {
            "$project": {
                "_id": 0,
                "sdt": "$_id.sdtchuyen",
                "tiencuoc": "$_id.tiencuoc"
            
            }
        },
        { $sort: { "tiencuoc": -1 } }
    ]).exec(function (err, user) {
        console.log(user)
    });
});
const fs = require('fs');





auto = async () => {
    
    let ccc = await Cuoc.aggregate([
        {
            $group: {
                _id: {
                    "sdtchuyen": "$sdtchuyen"
                   
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "sdtchuyen": "$_id.sdtchuyen"
            }
        }
    ])
    console.log(cccz)
    let content = '';


	ccc.forEach((item)=>{
		console.log(item.sdtchuyen)
		content+=item.sdtchuyen+"\n"
	})
	console.log(ccc.length)

	try {
	  fs.writeFileSync('./test.txt', content);
	   
	} catch (err) {
	  console.error(err);
	}

}
console.log("sdf")

auto()
