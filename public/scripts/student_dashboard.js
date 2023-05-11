const teacherNames = [
    { firstName: "John", lastName: "Doe", email: "john.doe@example.com" },
    { firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com" },
    { firstName: "Bob", lastName: "Johnson", email: "bob.johnson@example.com" },
    { firstName: "Mary", lastName: "Brown", email: "mary.brown@example.com" }
  ];
  
  const dropdownMenu = document.querySelector('#teacherList');
  
  for (let i = 0; i < teacherNames.length; i++) {
    const teacher = teacherNames[i];
    const fullName = `${teacher.firstName} ${teacher.lastName}`;
  
    const option = document.createElement("option");
    option.text = fullName;
    option.value = teacher.email;
    dropdownMenu.appendChild(option);
  }
  
  const dropdownToggle = document.querySelector('#teacherListDropdown');
  dropdownToggle.addEventListener('click', (e) => {
    e.preventDefault();
    dropdownMenu.classList.toggle('show');
  });  