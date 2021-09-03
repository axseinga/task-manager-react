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

    incrementTime = (id) => {
        this.setState((state) => {
            const newTasks = state.tasks.map((task) => {
                console.log(id, task.id);
                if (task.id === id) {
                    return { ...task, time: task.time + 1 };
                } else {
                    return task;
                }
            });

            return {
                tasks: newTasks,
            };
        });
    };

    handleToggle = () => {
        this.setState((state) => {
            state.tasks.map((item) => {
                console.log(item);
                if (item.isRunning === false) {
                    console.log("interval should start");
                    this.timer = setInterval(() => {
                        item.isRunning = true;
                        this.incrementTime(item.id);
                    }, 1000);
                } else if (item.isRunning === true) {
                    item.isRunning = false;
                    clearInterval(this.timer);
                }
            });
        });
    };

    formatTime = (time) => {
        let hrs = Math.floor(time / 3600);
        let mins = Math.floor((time % 3600) / 60);
        let secs = Math.floor(time % 60);

        let ret = "";

        ret += "" + (hrs < 10 ? "0" : "");
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
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
                        <header>Zadanie 1, {this.formatTime(item.time)}</header>
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
