let HOST = "http://localhost:3000"
//let HOST = "http://10.1.10.131:3000"

window.onload = () => {

    console.log("Loaded");


    let xhr = new XMLHttpRequest();

    xhr.onload = () => {

        if (xhr.status >= 200 && xhr.status < 300) {
            // This will run when the request is successful
            
            response = JSON.parse(xhr.response);
        } else {
            // This will run when it's not
            console.log('The request failed!');
        }

       console.log("Got response ",response)

       updateScreen(response.bales.list);




    }


    setInterval(() => {

        let d = new Date()
        let cutoff = d.getTime() - (1000 * 60 * 60);        //get bales from last 1 hour

        console.log("senditerval time now at", cutoff.toString())

        xhr.open('GET', `${HOST}/latest/${cutoff}`);
        xhr.send();
    }, 5000);


}


function updateScreen(bales){

    let lastBale = undefined;

    console.log("In update bales are",bales)

    bales.forEach(bale => {

        if(lastBale === undefined || bale.time > lastBale.time){
            lastBale = bale;
        }

    })

    lastBale = lastBale? lastBale : {time:0, tag:0, weight:0};

    console.log("Lastbae is",lastBale)
    
    let tag = document.querySelector("#tag");
    tag.innerHTML = lastBale.tag;

    let weight = document.querySelector("#weight");
    weight.innerHTML = lastBale.weight;

    let time = document.querySelector("#time");
    let d = new Date(parseInt(lastBale.time));

    let hour = d.getHours()%12;
    hour = hour === 0 ? 12 : hour;
    let minute = d.getMinutes().toString().padStart(2,'0');
    let seconds = d.getSeconds().toString().padStart(2,'0');

    let timeString = `${hour}:${minute}:${seconds}`


    time.innerHTML = timeString;

}