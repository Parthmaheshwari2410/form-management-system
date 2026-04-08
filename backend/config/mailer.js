const sendLoginAlert = async ({ name, email, role }) => {
    console.log(`Login alert → ${name} (${role}) - ${email}`);
};

module.exports = { sendLoginAlert };