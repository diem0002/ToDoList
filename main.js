// Seleccionamos elementos del DOM
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('new-task');
const taskList = document.getElementById('task-list');

// Cargar las tareas guardadas en localStorage al iniciar
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

// Evento para agregar una nueva tarea
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const taskText = taskInput.value;
    if (taskText.trim() === '') return;

    addTaskToDOM(taskText);
    saveTaskToLocalStorage(taskText);

    taskInput.value = '';
});

// Evento para marcar o eliminar una tarea
taskList.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-task')) {
        // Eliminar tarea con animación
        const taskItem = e.target.parentElement;
        taskItem.classList.add('fade-out');
        setTimeout(() => {
            removeTaskFromLocalStorage(taskItem.firstChild.textContent);
            taskItem.remove();
        }, 500);  // Esperamos a que termine la animación (0.5s)
    } else {
        // Marcar como completada
        e.target.classList.toggle('completed');
        updateTaskStatusInLocalStorage(e.target.firstChild.textContent);
    }
});

// Función para agregar una tarea al DOM con animación
function addTaskToDOM(taskText, completed = false) {
    const li = document.createElement('li');
    li.textContent = taskText;

    if (completed) {
        li.classList.add('completed');
    }

    li.classList.add('fade-in'); // Aplicamos la animación de entrada

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.classList.add('delete-task');
    li.appendChild(deleteBtn);
    
    taskList.appendChild(li);
}

// Función para guardar una tarea en localStorage
function saveTaskToLocalStorage(taskText) {
    let tasks = getTasksFromLocalStorage();
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Función para cargar las tareas desde localStorage
function loadTasksFromLocalStorage() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => addTaskToDOM(task.text, task.completed));
}

// Función para obtener tareas desde localStorage
function getTasksFromLocalStorage() {
    let tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// Función para eliminar una tarea de localStorage
function removeTaskFromLocalStorage(taskText) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.text !== taskText.trim());
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Función para actualizar el estado de una tarea en localStorage
function updateTaskStatusInLocalStorage(taskText) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.map(task => {
        if (task.text === taskText.trim()) {
            task.completed = !task.completed;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('Service Worker registrado con éxito:', registration.scope);
        }, function(err) {
            console.log('Error al registrar el Service Worker:', err);
        });
    });
}
