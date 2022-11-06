const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/momo", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }, () => console.log('Connected to db'));
const fs = require('fs');

const Cuoc = require('./models/Cuoc')

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
    let content = '';


	ccc.forEach((item)=>{
		//console.log(item.sdtchuyen)
		content+=item.sdtchuyen+"\n"
	})
	console.log(ccc.length)

	try {
	  fs.writeFileSync('./test.txt', content);
	   
	} catch (err) {
	  console.error(err);
	}

}
auto()
