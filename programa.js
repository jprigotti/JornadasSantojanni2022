const btnDay7 = document.querySelector('#btnDay7');
btnDay7.addEventListener('click', function(){
    document.querySelector('#btnDay7').classList.add('active');
    document.querySelector('#btnDay9').classList.remove('active');
    document.querySelector('#btnDay10').classList.remove('active');
    $('.agendaBody .day7').css({ 'display': 'block' });
    $('.agendaBody .day9').css({ 'display': 'none' });
    $('.agendaBody .day10').css({ 'display': 'none' });

});

const btnDay9 = document.querySelector('#btnDay9');
btnDay9.addEventListener('click', function(){
    document.querySelector('#btnDay7').classList.remove('active');
    document.querySelector('#btnDay9').classList.add('active');
    document.querySelector('#btnDay10').classList.remove('active');
    $('.agendaBody .day7').css({ 'display': 'none' });
    $('.agendaBody .day9').css({ 'display': 'block' });
    $('.agendaBody .day10').css({ 'display': 'none' });

});

const btnDay10 = document.querySelector('#btnDay10');
btnDay10.addEventListener('click', function(){
    document.querySelector('#btnDay7').classList.remove('active');
    document.querySelector('#btnDay9').classList.remove('active');
    document.querySelector('#btnDay10').classList.add('active');
    $('.agendaBody .day7').css({ 'display': 'none' });
    $('.agendaBody .day9').css({ 'display': 'none' });
    $('.agendaBody .day10').css({ 'display': 'block' });
});