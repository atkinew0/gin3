let HOST = "http://localhost:3000"
//let HOST = "http://10.1.10.131:3000"

window.onload = () => {

    console.log("Loaded");


    let xhr = new XMLHttpRequest();
    let xhr2 = new XMLHttpRequest();

    xhr.onload = () => {

        if (xhr.status >= 200 && xhr.status < 300) {
            // This will run when the request is successful
            
            response = JSON.parse(xhr.response);
        } else {
            // This will run when it's not
            console.log('The request failed!');
        }

       console.log("Got response ",response)

       updateScreen(response);

    }

    xhr2.onload = () => {
        if (xhr2.status >= 200 && xhr2.status < 300) {
            // This will run when the request is successful
            
            response = JSON.parse(xhr2.response);
        } else {
            // This will run when it's not
            console.log('The request failed!');
        }

       console.log("Got response ",response)

       updateLast(response.bales.list);
    }


    setInterval(() => {

        let d = new Date()
        let cutoff = d.getTime() - (1000 * 60 * 60 * 12);        //get bales from last 12 hour

        console.log("senditerval time now at", cutoff.toString())

        xhr.open('GET', `${HOST}/current`);
        xhr.send();


        xhr2.open('GET', `${HOST}/latest/${cutoff}`);
        xhr2.send();

    }, 5000);


}


function updateScreen(current){

    console.log("In update current is", current)
    
    let tag = document.querySelector("#tag");
    tag.innerHTML = current.tag;

    let weight = document.querySelector("#weight");
    weight.innerHTML = current.weight;

    let bales = document.querySelector("#bales");
    bales.innerHTML = current.dayTotal;

    let time = document.querySelector("#time");
    let d = new Date();

    let hour = d.getHours()%12;
    hour = hour === 0 ? 12 : hour;
    let minute = d.getMinutes().toString().padStart(2,'0');
    let seconds = d.getSeconds().toString().padStart(2,'0');

    let timeString = `${hour}:${minute}:${seconds}`


    time.innerHTML = timeString;

}

function updateLast(array){

    let lastTime = -Infinity;
    let bale;

    array.forEach(elem => {
        if(elem.time > lastTime){
            lastTime = elem.time;
            bale = elem;
        }
    });

    console.log("In updateLast last bale is", bale)

    let last = document.querySelector("#last");
    last.innerHTML = `${bale.tag} ${bale.weight}`



}