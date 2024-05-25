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
    const taskCard = $('<div>');
    taskCard.addClass('card project-card draggable my-3');
    taskCard.attr('data-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.taskTitle);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.taskDescription);
    const cardDueDate = $('<p>').addClass('card-text').text(task.taskDueDate);

    //delete button on task card
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id);

    if (task.taskDueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.taskDueDate, 'DD/MM/YYYY');
    
        // ? If the task is due today, make the card yellow. If it is overdue, make it red.
        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    //append card description, due date and delete button to the card
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);

    //append the card header and card body to the card
    taskCard.append(cardHeader, cardBody);

    //return the card so it can be appended to the correct lane
    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList(tasks) {

    //empty existing cards out of the lanes
    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    //loop through tasks array and create task cards for each status
    for (let task of tasks) {
        const taskCard = createTaskCard(task);
        if (task.status === 'to-do') {
            todoList.append(taskCard);
        }
        else if (task.status === 'in-progress') {
            inProgressList.append(taskCard);
        }
        else if (task.status === 'done') {
            doneList.append(taskCard);
        }
    }

    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        // create clone of the card that is dragged
        helper: function (e) {
        //Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
        const original = $(e.target).hasClass('ui-draggable')
            ? $(e.target)
            : $(e.target).closest('.ui-draggable');
        // return the clone with the width set to the width of the original card. 
        return original.clone().css({
            width: original.outerWidth(),
        });
        },
    });
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

    
    //clear form inputs
    $('#taskTitle').val('');
    $('#taskDueDate').val('');
    $('#taskDescription').val('');

    // Close the modal
    $('#formModal').modal('hide');
    //render the task list

    renderTaskList(tasks);

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    event.preventDefault();
    const taskId = $(this).attr('data-task-id');
    const tasks = readTasksFromStorage();

    //loop through the tasks array and remove the project witht the matching id
    tasks.forEach((task) => {
        if(task.id === taskId) {
            tasks.splice(tasks.indexOf(task), 1)
        }
    })
    saveTasksToLocalStorage(tasks);

    renderTaskList(tasks);
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    //read from local storage
    const tasks = readTasksFromStorage();
    // get the project id from the event
    const taskId = ui.draggable[0].dataset.id
    // get the id of the lane that  the card was dropped into
    const newStatus = event.target.id;

    for(let task of tasks) {
        //find the card by the id and update the status
        if (task.id === taskId) {
            task.status = newStatus;
        }
    }
    //save the udated projcets array to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList(tasks);
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
    const tasks = readTasksFromStorage();
    renderTaskList(tasks);

    //listen for dlete button click event
    const taskDisplayEl = $('.lane');
    taskDisplayEl.on('click', '.btn', handleDeleteTask);
    

    $('.lane').droppable({
        accept: ".draggable",
        drop: handleDrop
    });
});