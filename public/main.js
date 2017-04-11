/**
 * Created by arttu on 4/10/17.
 */


document.getElementById('addUserBtn').addEventListener('click', (evt) => {
    evt.preventDefault();
    const userInput = document.getElementById('addUserInput').value;

    fetch('/users/' + userInput + "/0", {
        method: 'post'
    });
});

document.getElementById('updateUserBtn').addEventListener('click', (evt) => {
    evt.preventDefault();
    const userToUpdate = document.getElementById('updateUsername').value;
    const newUserName = document.getElementById('updateNewUsername').value;

    fetch('/users/' + userToUpdate + '/' + newUserName, {
        method: 'put'
    });
});

document.getElementById('removeUserBtn').addEventListener('click', (evt) => {
    evt.preventDefault();
    const userToRemove = document.getElementById('removeUsername').value;

    fetch('/users/' + userToRemove + "/0", {
        method: 'delete'
    }).then((res) => {
        if(res.status != 200){
            alert("Error happened while deleting");
        }
    });
});
