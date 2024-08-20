function editUser(userId) {
  // Redirect to the edit page or open a modal with user details for editing
  console.log('Edit user with ID:', userId);
  window.location.href = `/edit-user/${userId}`;
}

// Function to handle the delete action
function deleteUser(userId) {
  // fetch(`/api/delete-user/${userId}`, {
  //   method: 'DELETE',
  // })
  //   .then(response => {
  //     if (response.ok) {
  //       console.log('User deleted successfully');
  //       location.reload(); // Reload the page to see the updated list
  //     } else {
  //       console.error('Failed to delete user');
  //     }
  //   })
  //   .catch(error => console.error('Error deleting user:', error));
}


function addButtonListener() {// Add event listeners for edit and delete buttons
  document.querySelectorAll(".edit_btn").forEach((button) => {
    button.addEventListener("click", function () {
      const userId = this.getAttribute("data-id");
      editUser(userId);
    });
  });

  document.querySelectorAll(".delete_btn").forEach((button) => {
    button.addEventListener("click", function () {
      const userId = this.getAttribute("data-id");
      deleteUser(userId);
    });
  });
}

fetch("api/users")
  .then((response) => response.json())
  .then((users) => {
    const UserDiv = document.getElementById("user_card_div");
    UserDiv.innerHTML = "";

    users.forEach((user) => {
      const userCard = document.createElement("div");
      userCard.className = "user_card";
      userCard.innerHTML = `
            <p class="col-3">${user.username}</p>
            <p class="col-3">${user.email}</p>
            <p class="col-3">${user.phoneno}</p>
            <div class="btn_div">
              <a class="delete_btn" data-id=${user._id}> <img src="/images/deleteicon.svg"> </a>
              <a class="edit_btn" data-id=${user._id}> <img src="/images/editicon.svg"> </a>
            </div>
        `;
      UserDiv.appendChild(userCard);
    });
    console.log(users);

    addButtonListener();
  })
  .catch((error) => console.error("Error fetching users:", error));

const searchfield = document.getElementById("searchField");
searchfield.addEventListener("input", () => {});
