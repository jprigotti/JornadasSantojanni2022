const btnDay7 = document.querySelector('#btnDay7');
btnDay7.addEventListener('click', function(){
    document.querySelector('#btnDay7').classList.add('btnActive');
    document.querySelector('#btnDay9').classList.remove('btnActive');
    document.querySelector('#btnDay10').classList.remove('btnActive');
    document.querySelector('#day7').classList.add('dayActive');
    document.querySelector('#day9').classList.remove('dayActive');
    document.querySelector('#day10').classList.remove('dayActive');
    $('.agendaBody .day7').css({ 'display': 'block' });
    $('.agendaBody .day9').css({ 'display': 'none' });
    $('.agendaBody .day10').css({ 'display': 'none' });

});

const btnDay9 = document.querySelector('#btnDay9');
btnDay9.addEventListener('click', function(){
    document.querySelector('#btnDay7').classList.remove('btnActive');
    document.querySelector('#btnDay9').classList.add('btnActive');
    document.querySelector('#btnDay10').classList.remove('btnActive');
    document.querySelector('#day7').classList.remove('dayActive');
    document.querySelector('#day9').classList.add('dayActive');
    document.querySelector('#day10').classList.remove('dayActive');
    $('.agendaBody .day7').css({ 'display': 'none' });
    $('.agendaBody .day9').css({ 'display': 'block' });
    $('.agendaBody .day10').css({ 'display': 'none' });

});

const btnDay10 = document.querySelector('#btnDay10');
btnDay10.addEventListener('click', function(){
    document.querySelector('#btnDay7').classList.remove('btnActive');
    document.querySelector('#btnDay9').classList.remove('btnActive');
    document.querySelector('#btnDay10').classList.add('btnActive');
    document.querySelector('#day7').classList.remove('dayActive');
    document.querySelector('#day9').classList.remove('dayActive');
    document.querySelector('#day10').classList.add('dayActive');
    $('.agendaBody .day7').css({ 'display': 'none' });
    $('.agendaBody .day9').css({ 'display': 'none' });
    $('.agendaBody .day10').css({ 'display': 'block' });
});