//Countdown code
//Set the date we are counting down to



var countDownDate = new Date("Nov 7, 2022, 09:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function(){
    
    //Get toda's
    var now = new Date().getTime();
    console.log(now);

    //Find the distance between now and the countDown date
    var distance = countDownDate - now;

    //Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance/(1000*60*60*24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

   console.log(days.toString());

    // $('input[name=days]').val(days.toString());
document.querySelector('.days').innerHTML = days;
document.querySelector('.hours').innerHTML = hours;
document.querySelector('.minutes').innerHTML = minutes;
document.querySelector('.seconds').innerHTML = seconds;


},1000);