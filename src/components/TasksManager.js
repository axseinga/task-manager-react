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
        const item = {
            name: task,
            time: 0,
            isRunning: false,
            isDone: false,
            isRemoved: false,
        };
        const options = {
            method: "POST",
            body: JSON.stringify(item),
            headers: { "Content-Type": "application/json" },
        };
        const url = "http://localhost:3005/data";

        const promise = fetch(url, options);

        promise
            .then((resp) => {
                if (resp.ok) {
                    return resp.json();
                }
                return Promise.reject(resp);
            })
            .then((data) => {
                const newItem = data;
                this.setState((state) => {
                    return {
                        tasks: [...state.tasks, newItem],
                    };
                });
            })
            .catch((err) => console.log(err));
    };

    handleToggle = () => {
        this.setState((state) => {
            const arr = state.tasks.map((item) => {
                if (item.isRunning === false) {
                    this.timer = setInterval(() => {
                        console.log("timer should start");
                        item.isRunning = true;
                        item.time = item.time + 1;
                        console.log(item.time);
                    }, 1000);
                } else if (item.isRunning === true) {
                    console.log("timer should stop");
                    clearInterval(this.timer);
                    item.isRunning = false;
                }
            });
            return arr;
        });
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
                {this.state.tasks.map((item) => (
                    <section key={item.id}>
                        <header>Zadanie 1, {item.time}</header>
                        <footer>
                            <button onClick={this.handleToggle}>
                                start/stop
                            </button>
                            <button>zakończone</button>
                            <button disabled={true}>usuń</button>
                        </footer>
                    </section>
                ))}
            </div>
        );
    }
}

export default TasksManager;
