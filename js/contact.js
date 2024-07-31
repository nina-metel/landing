/*--------------------------------------------------
Function Contact Formular
---------------------------------------------------*/

	const errorMessageMap = new Map([
		['name', 'Attention! You must enter your name.'],
		['email', 'Attention! Please enter a valid email address.'],
		['comments', 'Attention! Please enter your message.'],
		['verify', 'Attention! Please enter the verification number.'],
		['incorrectVerify', 'Attention! The verification number you entered is incorrect.'],
		['request', 'Attention! Message has not been sent, please contact us by aso.metel@gmail.com.']
	])

	const emailValidation = /^\S+@\S+\.\S{2,}$/;

function successBlock(name) {
	return `
            <div id='success_page'>
                <h3>Email Sent Successfully.</h3>
                <p>Thank you <strong>${name}</strong>, your message has been submitted to us.</p>
            </div>
    `;
}

	function ContactForm() {
		function RenderSubmit (data, isSuccess = false){
			document.getElementById('message').innerHTML = data;
			$('#message').slideDown('slow');
			$('#contactform img.loader').fadeOut('slow',function(){$(this).remove()});
			$('#submit').removeAttr('disabled');
			if(isSuccess) $('#contactform').slideUp('slow');
		}

		if( $('#contact-formular').length > 0 ){

			$('#contactform').submit(function(event){
				event.preventDefault();

				const form = this;

				$("#message").slideUp(750,function() {
					$('#message').hide();
					$('#submit').attr('disabled','disabled');

					let errorMess;
					const nameValue = $('#name').val();
					const emailValue = $('#email').val();
					const commentsValue = $('#comments').val();
					const verifyValue = $('#verify').val();

					if (!nameValue.trim()) {
						errorMess = errorMessageMap.get('name');
					} else if (!emailValue || !emailValidation.test(emailValue)) {
						errorMess = errorMessageMap.get('email');
					} else if (!commentsValue.trim()) {
						errorMess = errorMessageMap.get('comments');
					} else if (!verifyValue) {
						errorMess = errorMessageMap.get('verify');
					} else if (+verifyValue !== 4) {
						errorMess = errorMessageMap.get('incorrectVerify');
					}

					const errorDiv = errorMess ? `<div class="error_message">${errorMess}</div>` : null;

					if (!errorMess) {
						var formData = new FormData(form);
						formData.append('service_id', 'default_service'); //TODO: add
						formData.append('template_id', 'template_abc'); //TODO: add
						formData.append('user_id', 'abc'); //TODO: add

						$.ajax('https://api.emailjs.com/api/v1.0/email/send-form', {
							type: 'POST',
							data: formData,
							contentType: false,
							processData: false
						}).done(function() {
							RenderSubmit(successBlock(nameValue), true)
						}).fail(function() {
							RenderSubmit(`<div class="error_message">${errorMessageMap.get('request')}</div>`)
						})

						return;
					}

					RenderSubmit(errorDiv)
				});
				return false;
			});
		}
	}//End ContactForm
