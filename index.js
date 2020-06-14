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

       updateScreen(response);




    }


    setInterval(() => {

        let d = new Date()
        let cutoff = d.getTime() - (1000 * 60 * 60);        //get bales from last 1 hour

        console.log("senditerval time now at", cutoff.toString())

        xhr.open('GET', `${HOST}/current`);
        xhr.send();
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