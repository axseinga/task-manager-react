import React from "react";
import "regenerator-runtime";
import "whatwg-fetch";
import { managerApi } from "./../ManagerApi";

class TasksManager extends React.Component {
    state = {
        task: "",
        tasks: [],
    };

    // handlers

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
        this.setState({ task: "" });
    };

    handleToggle = (id) => {
        this.state.tasks.forEach((item) => {
            if (item.id === id && item.isRunning === false) {
                this.timer = setInterval(() => {
                    item.isRunning = true;
                    this.incrementTime(item.id);
                }, 1000);
            } else if (item.id === id && item.isRunning === true) {
                item.isRunning = !item.isRunning;
                clearInterval(this.timer);
                this.updateAPI(item);
            }
        });
    };

    handleFinish = (id) => {
        this.state.tasks.forEach((item) => {
            if (item.id === id) {
                this.setState((state) => {
                    const newTasks = state.tasks.map((task) => {
                        if (task.id === id) {
                            clearInterval(this.timer);
                            const newItem = {
                                ...task,
                                isDone: true,
                                isRunning: false,
                            };
                            this.updateAPI(newItem);
                            return newItem;
                        } else {
                            return task;
                        }
                    });
                    return {
                        tasks: newTasks,
                    };
                });
            } else return;
        });
    };

    handleDelete = (id) => {
        this.state.tasks.forEach((item) => {
            if (item.id === id) {
                this.setState((state) => {
                    const newTasks = state.tasks.map((task) => {
                        if (task.id === id) {
                            const newItem = {
                                ...task,
                                isRemoved: true,
                            };
                            this.updateAPI(newItem);
                            return newItem;
                        } else return task;
                    });

                    return { tasks: newTasks };
                });
            }
        });
    };

    // API

    addToAPI(item) {
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
    }

    updateAPI(task) {
        const options = {
            method: "PUT",
            body: JSON.stringify(task),
            headers: { "Content-Type": "application/json" },
        };

        const url = `http://localhost:3005/data/${task.id}`;

        const promise = fetch(url, options);

        promise
            .then((resp) => {
                if (resp.ok) {
                    return resp.json();
                }
                return Promise.reject(resp);
            })
            .catch((err) => console.error(err));
    }

    addItem = (task) => {
        const item = {
            name: task,
            time: 0,
            isRunning: false,
            isDone: false,
            isRemoved: false,
        };
        this.addToAPI(item);
    };

    incrementTime = (id) => {
        this.setState((state) => {
            const newTasks = state.tasks.map((task) => {
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
            <div className="TasksManager">
                <h1 className="TasksManager-title" onClick={this.onClick}>
                    TasksManager
                </h1>
                <form
                    className="TasksManager-form"
                    onSubmit={this.handleSubmit}
                >
                    <label className="TasksManager-label" htmlFor="task">
                        Task:
                    </label>
                    <input
                        className="TasksManager-input"
                        name="task"
                        value={this.state.task}
                        onChange={this.handleChange}
                    ></input>
                    <button className="TasksManager-btn">Add task</button>
                </form>
                {this.state.tasks
                    .sort(function (x, y) {
                        return x.isDone - y.isDone;
                    })
                    .map((item) => {
                        if (item.isRemoved === false) {
                            return (
                                <section
                                    className="TasksManager-task"
                                    key={item.id}
                                >
                                    <header className="TasksManager-task-header">
                                        Task {item.id}: {item.name},{" "}
                                        {this.formatTime(item.time)}
                                    </header>
                                    <footer className="TasksManager-task-footer">
                                        <button
                                            className="TasksManager-btn"
                                            disabled={
                                                item.isDone === true
                                                    ? true
                                                    : false
                                            }
                                            onClick={() =>
                                                this.handleToggle(item.id)
                                            }
                                        >
                                            start/stop
                                        </button>
                                        <button
                                            className="TasksManager-btn"
                                            disabled={
                                                item.isDone === true
                                                    ? true
                                                    : false
                                            }
                                            onClick={() =>
                                                this.handleFinish(item.id)
                                            }
                                        >
                                            done
                                        </button>
                                        <button
                                            className="TasksManager-btn"
                                            disabled={
                                                item.isDone === true
                                                    ? false
                                                    : true
                                            }
                                            onClick={() =>
                                                this.handleDelete(item.id)
                                            }
                                        >
                                            remove
                                        </button>
                                    </footer>
                                </section>
                            );
                        }
                    })}
            </div>
        );
    }
}

export default TasksManager;
