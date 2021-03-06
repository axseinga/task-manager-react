import React from "react";
import "regenerator-runtime";
import "whatwg-fetch";
import ManagerApi from "./../ManagerApi";

class TasksManager extends React.Component {
    state = {
        task: "",
        tasks: [],
    };
    api = new ManagerApi();

    // handlers

    handleChange = (e) => {
        this.setState({ task: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const newItem = this.addItem(this.state.task);
    };

    handleToggle = (id) => {
        this.state.tasks.forEach((item) => {
            if (item.id === id && item.isRunning === false) {
                this.timer = setInterval(() => {
                    item.isRunning = true;
                    this.updateState(item, id, true);
                    this.incrementTime(item.id);
                }, 1000);
            } else if (item.id === id && item.isRunning === true) {
                item.isRunning = !item.isRunning;
                this.updateState(item, id, false);
                clearInterval(this.timer);
                this.timer = 0;
                this.api.updateAPI(item);
            }
        });
    };

    updateState = (item, id, boolean) => {
        if (item.id === id) {
            this.setState((state) => {
                const newTasks = state.tasks.map((task) => {
                    if (task.id === id) {
                        const newItem = {
                            ...task,
                            isRunning: boolean,
                        };
                        this.api.updateAPI(newItem);
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
    };

    handleFinish = (id) => {
        this.state.tasks.forEach((item) => {
            if (item.id === id) {
                this.setState((state) => {
                    const newTasks = state.tasks.map((task) => {
                        if (task.id === id) {
                            clearInterval(this.timer);
                            this.timer = 0;
                            const newItem = {
                                ...task,
                                isDone: true,
                                isRunning: false,
                            };
                            this.api.updateAPI(newItem);
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
                            this.api.updateAPI(newItem);
                            return newItem;
                        } else return task;
                    });

                    return { tasks: newTasks };
                });
            }
        });
    };

    addItem = (task) => {
        const item = {
            name: task,
            time: 0,
            isRunning: false,
            isDone: false,
            isRemoved: false,
        };
        this.api
            .addToAPI(item)
            .then((data) =>
                this.setState((state) => {
                    const newItem = data;
                    return {
                        task: "",
                        tasks: [...state.tasks, newItem],
                    };
                })
            )
            .catch((err) => console.log("error"));
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

    isStartStopButtonDisabled(task) {
        if (task.isRunning) {
            return false;
        }
        if (task.isDone) {
            return true;
        }

        if (this.timer > 0) {
            return true;
        }
    }

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
                                    <footer className="TasksManager-footer">
                                        <button
                                            className="TasksManager-btn"
                                            disabled={this.isStartStopButtonDisabled(
                                                item
                                            )}
                                            onClick={() =>
                                                this.handleToggle(item.id)
                                            }
                                        >
                                            start/stop
                                        </button>
                                        <button
                                            className="TasksManager-btn"
                                            disabled={this.isStartStopButtonDisabled(
                                                item
                                            )}
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
