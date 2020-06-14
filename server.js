const file = require('fs')
const cors = require('cors')
const SerialPort = require('serialport');
const express = require('express')
const app = express()
const Readline = require('@serialport/parser-readline')
const port = 3000
const parser = new Readline({delimiter: '\r'});
const parser2 = new Readline({delimiter: '\r'});
const stream = require('stream')

const config = require('./config.json')



console.log("server read config file: ",config);

let weight = 0;
let tag = 0;
let dayTotal = 0;


process.stdin.setEncoding('utf8');

const readline = require('readline');



function writeToFile(tagOut, weightOut){

    console.log('Got tag and weigt, writing to file',tag,weight);

    let d = new Date();

    outFile.write(`${d.getTime()},${tagOut},${weightOut}\n`);

    dayTotal++;

}



app.use(cors())

const serialIndicator = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 }, function (err) {

    if (err) {
        return console.log("Error : " + err);
    }else{
        console.log("Opened indicator serial port at 9600");
    }
})

const serialScanner = new SerialPort('/dev/ttyACM0', { baudRate: 9600 }, function (err) {

    if (err) {
        return console.log("Error : " + err);
    }else{
        console.log("Opened barcode scanner serial port at 9600");
    }
})

serialIndicator.pipe(parser);

serialScanner.pipe(parser2);

parser.on('data', data => {

    let line = data.toString("utf8").trim().split(/\s+/).filter(elem => !elem.match(/(\s+)/));

    console.log(data,"filtered to",line)

    weight = line[1];

    console.log("got weight", weight);

    if( tag != 0){
        writeToFile(tag, weight);
        tag = 0;
        weight = 0;
    }
    


});

parser2.on('data', data => {

    data = data.trim()

    console.log("Got scan data", data," length of data is ", data.length)

    if(data.length != 12){
        console.log("Not valid PBI tag");
        return;
    }

    tag = data;

    if(weight != 0){
        writeToFile(tag, weight);
        tag = 0;
        weight = 0;
    }
    


});


app.get('/gin', (req, res) => {


    res.send(config);


})



app.get('/latest/:cutoff', (req, res) => {

    let cutoff = parseInt(req.params.cutoff);
    console.log("Hit latest cutoff route");

    file.readFile('bales.txt', 'utf8', (err, data) => {

        if (err){
            console.log("Read error:", err)
            return;
            
        } 


        let lines = data.trim().split("\n");
        let bales_data = {};
        let bales_list = []

        for(let i = 0; i < lines.length; i++){
            let item = lines[i].split(",");

            // let d = new Date()
            // let cutoff = d.getTime() - (1000 * 60 * 60);        //in response to GET /latest send bales from previous 1 hr

            if(item[0] > cutoff){

                console.log("In filter comparing", item[0], cutoff)

                bales_list.push({time: item[0], tag: item[1], weight: item[2]});
            }
        }

        bales_data.bales = {list: bales_list};

        res.send(bales_data);
    });

});

app.get("/current", (req, res) => {

    let current = {tag, weight, dayTotal};

    res.send(current);

})

app.listen(port, () => console.log(`Example app listening at http ://localhost:${port}`));

const outFile = file.createWriteStream("bales.txt", {flags:'a'},err =>{
    console.log("Create write err",err)
} );

