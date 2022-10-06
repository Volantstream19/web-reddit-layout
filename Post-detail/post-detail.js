import '../auth/user.js';
import { getPost } from '../fetch-utils.js';

const errorDisplay = document.getElementById('error-display');
const postTitle = document.getElementById('post-title');
const postBio = document.getElementById('post-bio');

let error = null;
let post = null;

window.addEventListener('load', async () => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    if (!id) {
        location.replace('/');
        return;
    }

    const response = await getPost(id);
    error = response.error;
    post = response.data;

    if (error) {
        displayError();
    }

    if (!post) {
        location.assign('/');
    } else {
        displayPost();
    }
});

function displayPost() {
    postTitle.textContent = post.title;
    postBio.textContent = post.bio;
}

function displayError() {
    if (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        errorDisplay.textContent = error.message;
    } else {
        errorDisplay.textContent = '';
    }
}
