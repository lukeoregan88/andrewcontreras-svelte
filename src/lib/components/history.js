export function goBackOrHomepage() {
	if (window.history.length > 1) {
		window.history.back();
	} else {
		window.location.href = 'http://yourhomepage.com'; // replace with your homepage URL
	}
}
