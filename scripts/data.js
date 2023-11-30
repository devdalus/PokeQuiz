function loadJSONfile(path) {
    return fetch(path).then((Response) =>
        Response.json().then((json) => {
            return json;
        })
    );
}