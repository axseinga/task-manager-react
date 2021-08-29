import React from "react";
import "regenerator-runtime";
import "whatwg-fetch";

class TasksManager extends React.Component {
    state = {
        task: "",
        tasks: [],
    };

    onClick = () => {
        const { tasks } = this.state;
        console.log(tasks);
    };

    handleChange = (e) => {
        this.setState({ task: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.addItem(this.state.task);
    };

    addItem = (task) => {
        console.log(task);
        const options = {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(task),
            headers: { "Content-Type": "text/plain" },
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
                console.log(data);
            })
            .catch((err) => console.log(err));
    };

    render() {
        return (
            <div>
                <h1 onClick={this.onClick}>TasksManager</h1>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="task">Zadanie:</label>
                    <input
                        name="task"
                        value={this.state.task}
                        onChange={this.handleChange}
                    ></input>
                    <button>Dodaj zadanie</button>
                </form>
            </div>
        );
    }
}

export default TasksManager;
