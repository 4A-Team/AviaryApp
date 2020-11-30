//requiring path and fs modules
const express = require('express')
const path = require('path');
const {MongoClient} = require('mongodb');

const fs = require('fs');

const Birds =  ['Gymnorhina tibicen (Australian Magpie)', 'Platycercus elegans (Crimson Rosella)', 'Eolophus roseicapilla (Galah)'];

const app = express();
app.use('/scripts', express.static('scripts'))
app.use('/Sounds', express.static('Sounds'))
app.use('/img', express.static('img'))

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname,'/calendar.html'));
});

var server = app.listen(8887);



const listing =  [];


var socket = require('socket.io');

var io = socket(server);

//listen for client connection
io.sockets.on('connection', newConnection);

//do this when a new client connect to the server
function newConnection(socket){
    //console.log('new connection detected: '+ socket.id);

    //it receives the date selected on the calendar interface and send it to dateMessage function.
    socket.on('dateSelected', dateMessage); 

    function dateMessage(data){
        //this function receives the date and send it to the main function to fetch data from MongoDb
        main(data).catch(console.error);
    }
    
}

async function main(selectedDay){
    /**
     * Fetches data from the DB hourly and send the sounds to be played to the calendar app
    const uri = "mongodb+srv://admin:<password>@cluster0.nwygw.mongodb.net/<db name>?retryWrites=true&w=majority"
 

    const client = new MongoClient(uri);
    
     */

    try {
        // Connect to the MongoDB cluster
        //await client.connect();
 
        // Make the appropriate DB calls
        setAsyncInterval(findBirdSounds(selectedDay), (60*60000)); //Searches the DB every 60min
 
    } catch (e) {
        console.error(e);
    } finally {
        //await client.close();
    }
}

const asyncIntervals = [];

const runAsyncInterval = async (cb, interval, intervalIndex) => {
  await cb();
  if (asyncIntervals[intervalIndex]) {
    setTimeout(() => runAsyncInterval(cb, interval, intervalIndex), interval);
  }
};

const setAsyncInterval = (cb, interval) => {
  if (cb && typeof cb === "function") {
    const intervalIndex = asyncIntervals.length;
    asyncIntervals.push(true);
    runAsyncInterval(cb, interval, intervalIndex);
    return intervalIndex;
  } else {
    throw new Error('Callback must be a function');
  }
};

const clearAsyncInterval = (intervalIndex) => {
  if (asyncIntervals[intervalIndex]) {
    asyncIntervals[intervalIndex] = false;
  }
};


function getBirds(time, entries){
    const regex = new RegExp(time, 'g');
    const matchedSites = entries.filter(dtime => dtime['datetime'].match(regex) && Birds.includes(dtime['bird']));
    let birdDetected = [];
    if(matchedSites.length>0){
        matchedSites.forEach(function (matchedSite) {
            birdDetected.push(matchedSite['bird']);
        });
    }
    return birdDetected;
}


function fetchSounds(bird){
    
    //fetches a random sound from the sounds folder of the detected bird
    const listing =  [];
    const directoryPath = path.join(__dirname, '/Sounds/'+bird+'/');

    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {

        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 

        //listing all files using forEach
        files.forEach(function (file) {
            //create an array of the music files names
            listing.push(file);
        });
        //generate a random number within the number of sounds in the folder
        let num = Math.floor(Math.random() * listing.length);  
        let soundPath =  '/Sounds/'+bird+'/'+ listing[num];
        io.sockets.emit('sounds', soundPath);
        //console.log(soundPath);
        //returns the path to the randomly selected sound
        return soundPath;
    });
}

async function findBirdSounds(selectedDay){
    /*
    const uri = "mongodb+srv://admin:<password>@cluster0.nwygw.mongodb.net/<db name>?retryWrites=true&w=majority"
    const client = new MongoClient(uri);
    //console.log("out: "+ selectedDay);
    await client.connect();

    //filter by hour!!!!!
    let selectedday = selectedDay.split('T')[0]; //split the date and time from calendar
    var hour = new Date().getHours();
    //search the DB for entries from the selected day and current hour
    const cursor = await client.db("Birds").collection("Birds").find({'datetime': {'$regex':"^"+selectedday+" 0?"+hour}});


    //convert the fetched data entries to list of dictionaries
    const results = await cursor.toArray();
    */

    //remove the comment on result above!!!!
    let results = [
        {
            datetime: '2020-11-07 15:01:33',
            bird: 'Platycercus elegans (Crimson Rosella)',
            percentage: 10.546875
        },
        {
            datetime: '2020-11-07 15:04:43',
            bird: 'Eolophus roseicapilla (Galah)',
            percentage: 48.828125
        },
        {
            datetime: '2020-11-07 15:05:33',
            bird: 'Gymnorhina tibicen (Australian Magpie)', 
            percentage: 3.125
        },
        {
            datetime: '2020-11-07 15:07:33',
            bird: 'Platycercus elegans (Crimson Rosella)',
            percentage: 10.546875
        },
        {
            datetime: '2020-11-07 15:10:33',
            bird: 'Platycercus elegans (Crimson Rosella)',
            percentage: 10.546875
        },
        {
            datetime: '2020-11-07 15:12:43',
            bird: 'Eolophus roseicapilla (Galah)',
            percentage: 48.828125
        },
        {
            datetime: '2020-11-07 15:15:43',
            bird: 'Eolophus roseicapilla (Galah)',
            percentage: 48.828125
        },
        {
            datetime: '2020-11-07 15:16:33',
            bird: 'Platycercus elegans (Crimson Rosella)',
            percentage: 10.546875
        },
        {
            datetime: '2020-11-07 15:19:33',
            bird: 'Gymnorhina tibicen (Australian Magpie)', 
            percentage: 3.125
        },
        {
            datetime: '2020-11-07 15:20:43',
            bird: 'Eolophus roseicapilla (Galah)',
            percentage: 48.828125
        },
        {
            datetime: '2020-11-07 15:23:33',
            bird: 'Platycercus elegans (Crimson Rosella)',
            percentage: 10.546875
        },
        {
            datetime: '2020-11-07 15:25:33',
            bird: 'Gymnorhina tibicen (Australian Magpie)', 
            percentage: 3.125
        },
        {
            datetime: '2020-11-07 15:29:33',
            bird: 'Gymnorhina tibicen (Australian Magpie)', 
            percentage: 3.125
        },
        {
            datetime: '2020-11-07 15:31:43',
            bird: 'Eolophus roseicapilla (Galah)',
            percentage: 48.828125
        },
        {
            datetime: '2020-11-07 15:32:43',
            bird: 'Eolophus roseicapilla (Galah)',
            percentage: 48.828125
        },
        {
            datetime: '2020-11-07 15:36:33',
            bird: 'Gymnorhina tibicen (Australian Magpie)', 
            percentage: 3.125
        },
        {
            datetime: '2020-11-07 15:39:33',
            bird: 'Platycercus elegans (Crimson Rosella)',
            percentage: 10.546875
        },
        {
            datetime: '2020-11-07 15:40:43',
            bird: 'Eolophus roseicapilla (Galah)',
            percentage: 48.828125
        },
        {
            datetime: '2020-11-07 15:43:33',
            bird: 'Platycercus elegans (Crimson Rosella)',
            percentage: 10.546875
        },
        {
            datetime: '2020-11-07 15:46:33',
            bird: 'Gymnorhina tibicen (Australian Magpie)', 
            percentage: 3.125
        },
        {
            datetime: '2020-11-07 15:48:33',
            bird: 'Gymnorhina tibicen (Australian Magpie)', 
            percentage: 3.125
        },
        {
            datetime: '2020-11-07 15:50:33',
            bird: 'Platycercus elegans (Crimson Rosella)',
            percentage: 10.546875
        },
        {
            datetime: '2020-11-07 15:51:33',
            bird: 'Gymnorhina tibicen (Australian Magpie)', 
            percentage: 3.125
        },
        {
            datetime: '2020-11-07 15:52:43',
            bird: 'Eolophus roseicapilla (Galah)',
            percentage: 48.828125
        },
        {
            datetime: '2020-11-07 15:54:33',
            bird: 'Platycercus elegans (Crimson Rosella)',
            percentage: 10.546875
        },
        {
            datetime: '2020-11-07 15:56:33',
            bird: 'Gymnorhina tibicen (Australian Magpie)', 
            percentage: 3.125
        },
        {
            datetime: '2020-11-07 15:58:43',
            bird: 'Eolophus roseicapilla (Galah)',
            percentage: 48.828125
        },
        {
            datetime: '2020-11-07 15:59:43',
            bird: 'Eolophus roseicapilla (Galah)',
            percentage: 48.828125
        }
    ] 

    /*
    make it automatically restart timer when new hour begin - to avoid spillover for events not started at 0'clock time
    */

    //filter by min, only display sounds entered at a particular time
    if(results.length>0){
        let now_min = new Date().getMinutes().toString();
        //let time = selectedday+" 0?"+hour+":0?"+now_min;
        let time = selectedday+" 0?15:0?"+now_min;
        //console.log(time);
        let m = 0;
        detectedBirds = getBirds(time, results);
        if (detectedBirds.length>0){
            fetchSounds(detectedBirds[0]);
        }
        setInterval(function(){ 
            let now_min = new Date().getMinutes().toString();
            let time = selectedday+" 0?15:0?"+now_min;
            //console.log(time);
            detectedBirds = getBirds(time, results);
            if (detectedBirds.length>0){
                fetchSounds(detectedBirds[0]);
            }
        }, 60000);   //every second - change to minute
    }else{
        console.log("no listing");
    }
}
