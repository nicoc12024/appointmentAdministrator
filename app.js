// Forms fields
const petInput = document.getElementById("pet");
const ownerInput = document.getElementById("owner");
const phoneInput = document.getElementById("phone");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const symptomsInput = document.getElementById("symptoms");

// UI
const form = document.getElementById("new-appointment");
const appointmentContainer = document.getElementById("appointments");

let editing;

class Appointments {
  constructor() {
    // this.appointments is created as soon we instanciate the class
    this.appointments = [];
  }

  // an array that we pass with many objects inside
  addAppointment(appointment) {
    this.appointments = [...this.appointments, appointment];
  }

  // deletes an appoinment
  deleteAppointment(id) {
    this.appointments = this.appointments.filter((appointment) => appointment.id !== id);
  }

  editAppointment(updatedAppointment) {
    this.appointments = this.appointments.map((appointment) =>
      appointment.id === updatedAppointment.id ? updatedAppointment : appointment
    );
  }
}

class UI {
  printAlert(message, type) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("text-center", "alert", "d-block", "col-12");
    if (type === "error") {
      messageDiv.classList.add("alert-danger");
    } else {
      messageDiv.classList.add("alert-success");
    }

    messageDiv.textContent = message;
    document.getElementById("content").insertBefore(messageDiv, document.querySelector(".book-appointment"));

    setTimeout(() => {
      messageDiv.remove();
    }, 4000);
  }

  // destructuring the array in the parametro of the method.. prints the appointments in the DOM
  printAppointments({ appointments }) {
    this.cleanHTML();

    // goes through each appointment, extract the info and creates the HTML and adds to the DOM
    appointments.forEach((appointment) => {
      const { pet, owner, phone, date, time, symptoms, id } = appointment;
      const appointmentDiv = document.createElement("div");
      appointmentDiv.classList.add("p-3");
      appointmentDiv.dataset.id = id;

      // Scripting elements from appointment object
      const petText = document.createElement("h2");
      petText.classList.add("card-title", "fw-bolder");
      petText.textContent = pet;

      const ownerText = document.createElement("p");
      ownerText.innerHTML = `<span class="fw-bolder">Owner: </span> ${owner}`;

      const phoneText = document.createElement("p");
      phoneText.innerHTML = `<span class="fw-bolder">Phone: </span> ${phone}`;

      const dateText = document.createElement("p");
      dateText.innerHTML = `<span class="fw-bolder">Date: </span> ${date}`;

      const timeText = document.createElement("p");
      timeText.innerHTML = `<span class="fw-bolder">Time: </span> ${time}`;

      const symptomsText = document.createElement("p");
      symptomsText.innerHTML = `<span class="fw-bolder">Symptoms: </span> ${symptoms}`;

      // Delete appointment button
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("btn", "btn-danger", "me-2");
      deleteBtn.innerHTML =
        'Delete <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> ';
      deleteBtn.onclick = () => deleteAppointment(id);

      // Adds a button for editing
      const editBtn = document.createElement("button");
      editBtn.classList.add("btn", "btn-info");
      editBtn.innerHTML =
        'Edit <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
      editBtn.onclick = () => loadEdition(appointment);

      // Add to Div
      appointmentDiv.appendChild(petText);
      appointmentDiv.appendChild(ownerText);
      appointmentDiv.appendChild(phoneText);
      appointmentDiv.appendChild(dateText);
      appointmentDiv.appendChild(timeText);
      appointmentDiv.appendChild(symptomsText);
      appointmentDiv.appendChild(deleteBtn);
      appointmentDiv.appendChild(editBtn);

      // Add to HTML
      appointmentContainer.appendChild(appointmentDiv);
    });
  }

  cleanHTML() {
    while (appointmentContainer.firstChild) {
      appointmentContainer.removeChild(appointmentContainer.firstChild);
    }
  }
}

const ui = new UI();
const appointmentAdministrator = new Appointments();

// Register events
eventListeners();
function eventListeners() {
  petInput.addEventListener("input", appointmentData);
  ownerInput.addEventListener("input", appointmentData);
  phoneInput.addEventListener("input", appointmentData);
  dateInput.addEventListener("input", appointmentData);
  timeInput.addEventListener("input", appointmentData);
  symptomsInput.addEventListener("input", appointmentData);
  form.addEventListener("submit", newAppointment);
}

// Obj with appointment data
const objDate = {
  pet: "",
  owner: "",
  phone: "",
  date: "",
  time: "",
  symptoms: "",
};

// Adds data to the objDate
function appointmentData(e) {
  objDate[e.target.name] = e.target.value;
}

// Add new appointment to the class Appointment
function newAppointment(e) {
  e.preventDefault();
  // Extract info from objDate
  const { pet, owner, phone, date, time, symptoms } = objDate;
  // Validate
  if (pet === "" || owner === "" || phone === "" || date === "" || time === "" || symptoms === "") {
    ui.printAlert("Complete all fields", "error");
    return;
  }

  if (editing) {
    ui.printAlert("Editing Done");

    //appointment objecto to edition
    appointmentAdministrator.editAppointment({ ...objDate });

    // change button text
    form.querySelector('button[type="submit"]').textContent = "Create Appointment";

    editing = false;
  } else {
    // Create unique ID
    objDate.id = Date.now();
    // Creates a new appointment /
    appointmentAdministrator.addAppointment({ ...objDate });
    // show msg
    ui.printAlert("The appointment was added");
  }

  // Reset object
  resetObject();

  // Reset form
  form.reset();

  // Show HTML of appointments
  ui.printAppointments(appointmentAdministrator);
}

function resetObject() {
  objDate.pet = "";
  objDate.owner = "";
  objDate.phone = "";
  objDate.date = "";
  objDate.time = "";
  objDate.symptoms = "";
}

function deleteAppointment(id) {
  // delete appointment
  appointmentAdministrator.deleteAppointment(id);

  // show msg
  ui.printAlert("The appointment was deleted");

  // refresh
  ui.printAppointments(appointmentAdministrator);
}

// Load data and edition mode
function loadEdition(appointment) {
  const { pet, owner, phone, date, time, symptoms, id } = appointment;

  // load inputs
  petInput.value = pet;
  ownerInput.value = owner;
  phoneInput.value = phone;
  dateInput.value = date;
  timeInput.value = time;
  symptomsInput.value = symptoms;

  objDate.pet = pet;
  objDate.owner = owner;
  objDate.phone = phone;
  objDate.date = date;
  objDate.time = time;
  objDate.symptoms = symptoms;
  objDate.id = id;

  // change button text
  form.querySelector('button[type="submit"]').textContent = "Save Changes";

  editing = true;
}
