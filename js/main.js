class Employee {
  constructor(
    account,
    name,
    email,
    password,
    startDate,
    basicSalary,
    position,
    workHours
  ) {
    this.account = account;
    this.name = name;
    this.email = email;
    this.password = password;
    this.startDate = startDate;
    this.basicSalary = parseFloat(basicSalary);
    this.position = position;
    this.workHours = parseFloat(workHours);
    this.totalSalary = this.calculateTotalSalary();
    this.employeeType = this.classifyEmployee();
  }

  calculateTotalSalary() {
    if (this.position === "Giám đốc") {
      return this.basicSalary * 3;
    } else if (this.position === "Trưởng phòng") {
      return this.basicSalary * 2;
    } else {
      return this.basicSalary;
    }
  }

  classifyEmployee() {
    if (this.workHours >= 192) {
      return "Nhân viên xuất sắc";
    } else if (this.workHours >= 176) {
      return "Nhân viên giỏi";
    } else if (this.workHours >= 160) {
      return "Nhân viên khá";
    } else {
      return "Nhân viên trung bình";
    }
  }
}

let employees = loadEmployeesFromLocalStorage();

function addEmployee() {
  const account = document.getElementById("tknv").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const startDate = document.getElementById("datepicker").value;
  const basicSalary = document.getElementById("luongCB").value;
  const position = document.getElementById("chucvu").value;
  const workHours = document.getElementById("gioLam").value;

  if (
    validateEmployee(
      account,
      name,
      email,
      password,
      startDate,
      basicSalary,
      position,
      workHours
    )
  ) {
    const newEmployee = new Employee(
      account,
      name,
      email,
      password,
      startDate,
      basicSalary,
      position,
      workHours
    );
    employees.push(newEmployee);
    saveEmployeesToLocalStorage();
    displayEmployees();
    clearForm();
    $("#myModal").modal("hide");
  }
}

function validateEmployee(
  account,
  name,
  email,
  password,
  startDate,
  basicSalary,
  position,
  workHours
) {
  const accountPattern = /^\d{4,6}$/;
  const namePattern = /^[\p{L}\s]+$/u;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*\W).{6,10}$/;

  if (!accountPattern.test(account)) {
    alert("Tài khoản phải là 4-6 ký số và không để trống.");
    return false;
  }
  if (!namePattern.test(name)) {
    alert("Tên nhân viên phải là chữ và không để trống.");
    return false;
  }
  if (!emailPattern.test(email)) {
    alert("Email phải đúng định dạng và không để trống.");
    return false;
  }
  if (!passwordPattern.test(password)) {
    alert(
      "Mật khẩu từ 6-10 ký tự (chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt) và không để trống."
    );
    return false;
  }
  if (startDate === "") {
    alert("Ngày làm không để trống và phải đúng định dạng mm/dd/yyyy.");
    return false;
  }
  if (
    !isNumber(basicSalary) ||
    basicSalary < 1000000 ||
    basicSalary > 20000000
  ) {
    alert(
      "Lương cơ bản phải từ 1,000,000 - 20,000,000 và không để trống, phải là số."
    );
    return false;
  }
  if (!["Giám đốc", "Trưởng phòng", "Nhân viên"].includes(position)) {
    alert(
      "Chức vụ phải chọn chức vụ hợp lệ (Giám đốc, Trưởng phòng, Nhân viên)."
    );
    return false;
  }
  if (!isNumber(workHours) || workHours < 80 || workHours > 200) {
    alert(
      "Giờ làm trong tháng phải từ 80 - 200 giờ và không để trống, phải là số."
    );
    return false;
  }
  return true;
}

function isNumber(value) {
  return !isNaN(value) && isFinite(value);
}

function displayEmployees() {
  const employeeTable = document.getElementById("tableDanhSach");
  employeeTable.innerHTML = "";

  employees.forEach((employee, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${employee.account}</td>
      <td>${employee.name}</td>
      <td>${employee.email}</td>
      <td>${employee.startDate}</td>
      <td>${employee.position}</td>
      <td>${employee.totalSalary.toLocaleString()}</td>
      <td>${employee.employeeType}</td>
      <td>
        <button class="btn btn-danger" onclick="deleteEmployee(${index})">Xóa</button>
        <button class="btn btn-primary" onclick="editEmployee(${index})">Sửa</button>
      </td>
    `;
    employeeTable.appendChild(row);
  });
}

function clearForm() {
  document.getElementById("tknv").value = "";
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("datepicker").value = "";
  document.getElementById("luongCB").value = "";
  document.getElementById("chucvu").value = "Chọn chức vụ";
  document.getElementById("gioLam").value = "";
}

function deleteEmployee(index) {
  employees.splice(index, 1);
  saveEmployeesToLocalStorage();
  displayEmployees();
}

function editEmployee(index) {
  const employee = employees[index];
  document.getElementById("tknv").value = employee.account;
  document.getElementById("name").value = employee.name;
  document.getElementById("email").value = employee.email;
  document.getElementById("password").value = employee.password;
  document.getElementById("datepicker").value = employee.startDate;
  document.getElementById("luongCB").value = employee.basicSalary;
  document.getElementById("chucvu").value = employee.position;
  document.getElementById("gioLam").value = employee.workHours;
  document.getElementById("btnCapNhat").onclick = function () {
    updateEmployee(index);
  };
  $("#myModal").modal("show");
}

function updateEmployee(index) {
  const account = document.getElementById("tknv").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const startDate = document.getElementById("datepicker").value;
  const basicSalary = document.getElementById("luongCB").value;
  const position = document.getElementById("chucvu").value;
  const workHours = document.getElementById("gioLam").value;

  if (
    validateEmployee(
      account,
      name,
      email,
      password,
      startDate,
      basicSalary,
      position,
      workHours
    )
  ) {
    employees[index] = new Employee(
      account,
      name,
      email,
      password,
      startDate,
      basicSalary,
      position,
      workHours
    );
    saveEmployeesToLocalStorage();
    displayEmployees();
    clearForm();
    $("#myModal").modal("hide");
  }
}

function searchNhanVien(event) {
  const searchKeyWord = removeVietnameseTones(
    event.target.value.toLowerCase().trim()
  );
  const filteredEmployees = employees.filter((employee) => {
    const normalizedEmployeeType = removeVietnameseTones(
      employee.employeeType.toLowerCase().trim()
    );
    return normalizedEmployeeType.includes(searchKeyWord);
  });
  displayFilteredEmployees(filteredEmployees);
}

function displayFilteredEmployees(filteredEmployees) {
  const employeeTable = document.getElementById("tableDanhSach");
  employeeTable.innerHTML = "";

  filteredEmployees.forEach((employee, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${employee.account}</td>
      <td>${employee.name}</td>
      <td>${employee.email}</td>
      <td>${employee.startDate}</td>
      <td>${employee.position}</td>
      <td>${employee.totalSalary.toLocaleString()}</td>
      <td>${employee.employeeType}</td>
      <td>
        <button class="btn btn-danger" onclick="deleteEmployee(${index})">Xóa</button>
        <button class="btn btn-primary" onclick="editEmployee(${index})">Sửa</button>
      </td>
    `;
    employeeTable.appendChild(row);
  });
}

function saveEmployeesToLocalStorage() {
  localStorage.setItem("employees", JSON.stringify(employees));
}

function loadEmployeesFromLocalStorage() {
  const employeesJSON = localStorage.getItem("employees");
  if (employeesJSON) {
    const employeesArray = JSON.parse(employeesJSON);
    return employeesArray.map(
      (emp) =>
        new Employee(
          emp.account,
          emp.name,
          emp.email,
          emp.password,
          emp.startDate,
          emp.basicSalary,
          emp.position,
          emp.workHours
        )
    );
  }
  return [];
}

function removeVietnameseTones(str) {
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str.replace(/đ/g, "d").replace(/Đ/g, "D");
  return str;
}

document.getElementById("btnThemNV").addEventListener("click", addEmployee);
document.getElementById("searchName").addEventListener("input", searchNhanVien);

// Display employees on initial load
displayEmployees();
