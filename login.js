$('form.ajax').submit(function (evento) {

    evento.preventDefault();  // avoid to execute the actual submit of the form.
    evento.preventDefault();  // avoid to execute the actual submit of the form.

    let that = $(this),
        url = that.attr('action'),
        method = that.attr('method'),
        data = {}; //this is gonna be a JS object to store all input values

    //loop through all the "name" items in the Form to load the data object

    that.find('[name]').each(function (index, value) {
        var that = $(this),
            name = that.attr('name'),
            value = that.val();
        data[name] = value;
    });

    console.log(data);


    $.ajax({
        method: method,
        redirect: "follow",
        url: url,
        dataType: 'json',
        accepts: 'application/json',
        data,
        success: (status) => console.log(status),
        error: (err) => console.log(err)
    });
});
