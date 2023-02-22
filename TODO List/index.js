window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const list_element = document.querySelector("#tasks");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = input.value;

    if (!task) {
      alert("Add a task");
      return;
    }

    /*<div class="task">
		<div class="content">
			<input 
				type="text" 
				class="text" 
				value="A new task"
				readonly>
		</div>
		<div class="actions">
				<button class="edit">Edit</button>
				<button class="delete">Delete</button>
		</div>
    </div>*/

    const task_element = document.createElement("div");
    task_element.classList.add("task");

    const task_content_element = document.createElement("div");
    task_content_element.classList.add("content");

    //content div csatolása a szülőhöz(task div)
    task_element.appendChild(task_content_element);

    const task_input_element = document.createElement("input");
    task_input_element.classList.add("text");
    task_input_element.type = "text";
    task_input_element.value = task.text;

    task_input_element.setAttribute("readonly", "readonly");

    //input elemet hozzáaadom a szülőhöz(content div)
    task_content_element.appendChild(task_input_element);

    const task_action_element = document.createElement("div");
    task_action_element.classList.add("actions");

    const task_edit_element = document.createElement("button");
    task_edit_element.classList.add("edit");
    task_edit_element.innerHTML = "Edit";

    const task_delete_element = document.createElement("button");
    task_delete_element.classList.add("delete");
    task_delete_element.innerHTML = "Delete";

    task_action_element.appendChild(task_edit_element);
    task_action_element.appendChild(task_delete_element);
    task_element.appendChild(task_action_element);

    //task div csatolása a szülőhöz (tasks div)
    list_element.appendChild(task_element);

    input.value = "";

    task_edit_element.addEventListener("click", () => {
      if (task_edit_element.innerText.toLowerCase() == "edit") {
        task_edit_element.innerText = "Save";
        task_input_element.removeAttribute("readonly");
        task_input_element.focus();
      } else {
        task_edit_element.innerText = "Edit";
        task_input_element.setAttribute("readonly", "readonly");
      }
    });

    task_delete_element.addEventListener("click", () => {
      list_element.removeChild(task_element);
    });
  });
});
