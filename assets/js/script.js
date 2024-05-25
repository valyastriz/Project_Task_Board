// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

function readTasksFromStorage() {
  
    //Retrieve projects from localStorage and parse the JSON to an array. If there are no projects in localStorage, initialize an empty array and return it.
    let tasks = JSON.parse(localStorage.getItem('tasks'));
  
    if(!tasks) {
      tasks = []
    }
    return tasks;
  }

  function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return crypto.randomUUID();
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    //create a new card el and add class for card,
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    //create object from the data entered into the form 
    event.preventDefault();
    const taskTitle = $('#taskTitle').val();
    const taskDueDate = $('#taskDueDate').val();
    const taskDescription = $('#taskDescription').val();

    const newTask = {
        id: generateTaskId(),
        taskTitle: taskTitle,
        taskDueDate: taskDueDate,
        taskDescription: taskDescription,
        status: 'to-do'
    }

    // pull the tasks from the localstorate and push the new task to the array
    const tasks = readTasksFromStorage();
    tasks.push(newTask);

    //save the updated tasks array to local storage
    saveTasksToLocalStorage(tasks);

    //_-----------_______________________----------------------------------------------------need to come back to finish re-rendering to screen-------------------

    //clear form inputs
    $('#taskTitle').val('');
    $('#taskDueDate').val('');
    $('#taskDescription').val('');

    // Close the modal
    $('#formModal').modal('hide');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $('#taskDueDate').datepicker({
        changeMonth: true,
        changeYear: true,
      });


    // trigger modal to pop-up
    const formModal = document.getElementById('formModal');
    const taskTitle = document.getElementById('taskTitle');
    formModal.addEventListener('shown.bs.modal', () => {
    taskTitle.focus();
    });

    $('#save-task').on('click', handleAddTask);

});