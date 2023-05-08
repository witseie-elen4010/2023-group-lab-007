const loginBtn = document.querySelector('#loginBtn');
const loginAlert = document.querySelector('#loginAlert');

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    console.log("here hjefhj;asdj")
    const toast = new bootstrap.Toast(loginAlert)
    toast.show()
  });
};
