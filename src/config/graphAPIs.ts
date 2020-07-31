export let APIs = {
    listAPI : {
        url : "https://graph.microsoft.com/beta/me/todo/lists",
        timeout : 1000, // 1 secs
        method : 'GET'
    },
    taskAPI : {
        url : "https://graph.microsoft.com/beta/me/todo/lists/" + "{}" + "/tasks",
        timeout : 1000,
        method : 'GET'
    }
}
