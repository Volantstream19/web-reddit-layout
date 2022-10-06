import '../auth/user.js';
import { getPost, createComment } from '../fetch-utils.js';
import { renderComment } from '../render-utils.js';

const errorDisplay = document.getElementById('error-display');
const postTitle = document.getElementById('post-title');
const postBio = document.getElementById('post-bio');
const commentList = document.getElementById('comment-list');
const addCommentForm = document.getElementById('add-comment-form');

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
        displayComments();
    }
});

addCommentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(addCommentForm);

    let commentInsert = {
        post_id: post.id,
        text: formData.get('text'),
    };

    const response = await createComment(commentInsert);
    error = response.error;
    const comment = response.data;

    if (error) {
        displayError();
    } else {
        addCommentForm.reset();
        post.comments.unshift(comment);
        displayComments();
    }
    return;
});

function displayPost() {
    postTitle.textContent = post.title;
    postBio.textContent = post.bio;
}

function displayComments() {
    commentList.innerHTML = '';

    for (const comment of post.comments) {
        const commentEl = renderComment(comment);
        commentList.append(commentEl);
    }
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
