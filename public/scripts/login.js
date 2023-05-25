// const logger = require("../../logger");

const loginBtn = document.querySelector('#loginBtn');
const loginAlert = document.querySelector('#loginAlert');
const logoutBtn = document.querySelector('#logoutBtn');

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const toast = new bootstrap.Toast(loginAlert)
    toast.show()
    // logger.info('Clicked login button [unknown user]');
  });
};

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    // logger.info('Clicked logout button [unknown user]');
    window.location.href = "/logout";
  });
};
