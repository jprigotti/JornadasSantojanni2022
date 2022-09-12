

// CODIGO PARA EL FORM DE CONTACTO
$('form.ajax').submit(function (evento) {

    evento.preventDefault();  // avoid to execute the actual submit of the form.


    //Data already validated - proceed to submit using AJAX-SUBMITFORM
    let that = $(this),
         url = that.attr('action'),
        method = that.attr('method'),
        data = {}; //this is gonna be a JS object holding data

    //Loop through all the elements in the Form

    that.find('[name]').each(function (index, value) {
        var that = $(this),
            name = that.attr('name'),
            value = that.val();

        data[name] = value;

        console.log(data);

    });



    $.ajax({
        method: method,
        crossDomain: true,
        url: url,
        dataType: 'json',
        accepts: 'application/json',
        data: data,
        success: (data) => {
            document.querySelector("form.ajax").reset();
            console.log(data);
            updateSubmitButton();
        },
        error: (err) => console.log(err)
    });


});


function updateSubmitButton() {
    $("#formSubmit").val("Enviado");
    $("#formSubmit").addClass("btnSubmit");
  
    setTimeout(function () {
      $("#formSubmit").val("Enviar");
      $("#formSubmit").removeClass("btnSubmit");
    }, 3000);
  
  }
