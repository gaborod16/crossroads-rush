$(document).ready(function(){

	$('#register-form').on('submit', function(e){

		var errors = '';
		var password = $('#register-form input[name="password"]').val();
		var confirmPassword = $('#register-form input[name="confirmPassword"]').val();
		
		if ($('#register-form input[name="username"]').val() === '') {
			errors += '<li>The username cannot be empty</li>';
		}
		if (password === '') {
			errors += '<li>The password cannot be empty</li>';
		}
		else if (password !== confirmPassword) {
			errors += '<li>The passwords doesn\' match</li>';
		}

		console.log(errors)
		if (errors !== '') {
			e.preventDefault();
			$('#register-errors p[name="errors"]').html(errors);
			$('#register-errors').removeClass('hidden');
		}
	});

    $('#close-errors').click(function(e){
    	console.log('close');
    	e.preventDefault();
        $('#register-errors').addClass('hidden');
    });
});