import React from "react";
import "regenerator-runtime";
import "whatwg-fetch";

class ManagerApi {
    addToAPI(item) {
        const options = {
            method: "POST",
            body: JSON.stringify(item),
            headers: { "Content-Type": "application/json" },
        };
        const url = "http://localhost:3005/data";

        const promise = fetch(url, options);

        return promise
            .then((resp) => {
                if (resp.ok) {
                    return resp.json();
                }
                return Promise.reject(resp);
            })
            .then((data) => {
                const newItem = data;
                /*this.setState((state) => {
                    return {
                        tasks: [...state.tasks, newItem],
                    };
                });*/
                const newItem = data;
                return data;
            })
            .catch((err) => console.log(err));
    }

    updateAPI(task) {
        const options = {
            method: "PUT",
            body: JSON.stringify(task),
            headers: { "Content-Type": "application/json" },
        };

        const url = `http://localhost:3005/data/${task.id}`;

        const promise = fetch(url, options);

        return promise
            .then((resp) => {
                if (resp.ok) {
                    return resp.json();
                }
                return Promise.reject(resp);
            })
            .catch((err) => console.error(err));
    }
}

export default ManagerApi;
