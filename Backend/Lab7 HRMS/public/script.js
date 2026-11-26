const API = "/employee";
let editId = null;
async function getEmployees() {
    const response = await fetch(API);
    const employees = await response.json();
    const table = document.getElementById("employeeTable");
    table.innerHTML = "";
    employees.forEach((emp) => {
        const row = table.insertRow();
        row.insertCell().textContent = emp.Empid;
        row.insertCell().textContent = emp.Name;
        row.insertCell().textContent = emp.Designation;
        row.insertCell().textContent = emp.MOB;
        row.insertCell().textContent = emp.DOJ.split("T")[0];
        row.insertCell().textContent = emp.Department;
        row.insertCell().textContent = emp.Salary;
        row.insertCell().innerHTML = `
            <button class="edit"
                onclick="editEmployee(${emp.Empid})">
                Edit
            </button>

            <button class="delete"
                onclick="deleteEmployee(${emp.Empid})">
                Delete
            </button>
        `;
    });
}
document.getElementById("employeeForm")
    .addEventListener("submit", async (e) => {

    e.preventDefault();

    const employee = {
        Empid: Number(document.getElementById("Empid").value),
        Name: document.getElementById("Name").value,
        Designation: document.getElementById("Designation").value,
        MOB: document.getElementById("MOB").value,
        DOJ: document.getElementById("DOJ").value,
        Department: document.getElementById("Department").value,
        Salary: Number(document.getElementById("Salary").value)
    };

    let response;

    if (editId === null) {

        response = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        });

    } else {

        response = await fetch(`${API}/${editId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        });
    }

    if (!response.ok) {
        alert("Operation failed");
        return;
    }

    alert("Employee saved successfully");

    editId = null;

    document.getElementById("employeeForm").reset();

    document.getElementById("submitBtn").innerText =
        "Add Employee";

    getEmployees();
});

// EDIT - Get employee details

async function editEmployee(id) {

    const response = await fetch(`${API}/${id}`);
    const emp = await response.json();

    if (!response.ok || !emp) {
        alert("Employee not found");
        return;
    }

    document.getElementById("Empid").value = emp.Empid;
    document.getElementById("Name").value = emp.Name;
    document.getElementById("Designation").value = emp.Designation;
    document.getElementById("MOB").value = emp.MOB;
    document.getElementById("DOJ").value = emp.DOJ.split("T")[0];
    document.getElementById("Department").value = emp.Department;
    document.getElementById("Salary").value = emp.Salary;

    editId = id;

    document.getElementById("submitBtn").innerText =
        "Update Employee";
}

// DELETE

async function deleteEmployee(id) {

    if (confirm("Are you sure you want to delete this employee?")) {

        const response = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            alert("Delete failed");
            return;
        }

        alert("Employee deleted successfully");

        getEmployees();
    }
}


getEmployees();