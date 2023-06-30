<script>
	//This function takes in two parameters, data and post, and creates a page variable from them. It then creates a url variable from the page variable, creates a regex variable to match the url, and creates a replacedUrl variable by replacing the url with the regex.

	//Parameters:
	//data (object): An object containing data.
	//post (object): An object containing post data.

	//Returns:
	//replacedUrl (string): A string containing the replaced url.

	export let data = undefined;
	export let post = undefined;

	// @ts-ignore
	let page = data ? data.data[0] : post;

	const url = page.yoast_head;
	const regex = /(https:\/\/wp-admin\.andrewcontreras\.com\/)(?!wp-content\/uploads)/g;
	const replacedUrl = url.replace(regex, 'https://andrewcontreras.com/');
</script>

{@html replacedUrl}
