const deletePostButtonElements = document.querySelectorAll(".buttons button");

async function deletePostHandler(event) {
  const buttonElement = event.target;
  const postId = buttonElement.dataset.postid;
  let response;

  try {
    console.log(postId);
    response = await fetch(`/admin/posts/${postId}`, {
      method: "DELETE",
    });

    buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
  } catch (error) {
    console.log(error);
  }

  if (!response.ok) {
    alert("something went wrong!");
    return;
  }
}

for (const deletePostButtonElement of deletePostButtonElements) {
  deletePostButtonElement.addEventListener("click", deletePostHandler);
}
