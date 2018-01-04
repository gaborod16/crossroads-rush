$(document).ready(function(){

	$('#login-form').on('submit', function(e){

		var errors = '';

		if ($('#login-form input[name="username"]').val() === '') {
			errors += '<li>The username cannot be empty</li>';
		}
		if ($('#login-form input[name="password"]').val() === '') {
			errors += '<li>The password cannot be empty</li>';
		}
		if (errors !== '') {
			e.preventDefault();
			$('#login-errors p[name="errors"]').html(errors);
			$('#login-errors').removeClass('hidden');
		}
	});

    $('#close-errors').click(function(e){
    	console.log('close');
    	e.preventDefault();
        $('#login-errors').addClass('hidden');
    });
});