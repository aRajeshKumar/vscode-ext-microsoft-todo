export let APIs = {
    // API to fetch all folders.
    listAPI : {
        url : "https://graph.microsoft.com/beta/me/todo/lists",
        timeout : 2000, // 2 secs
        method : 'GET'
    },
    // API to fetch task from a folder.
    taskAPI : {
        url : "https://graph.microsoft.com/beta/me/todo/lists/" + "{}" + "/tasks",
        timeout : 2000,
        method : 'GET'
    },
    // API to add a task inside a folder. 
    addTask : {
        url : "https://substrate.office.com/todo/api/v1/taskfolders/" + "{}" + "/tasks",
        timeout : 2000,
        method : 'POST'
    }
}
