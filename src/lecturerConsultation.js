const consultations = [
    { title: 'Consultation 1', date: '2023-05-11' },
    { title: 'Consultation 2', date: '2023-05-12' },
    { title: 'Consultation 3', date: '2023-05-13' },
];

// Public
module.exports = {
    get: function () {
    return consultations
    },
}