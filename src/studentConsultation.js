const consultations = [
    {
      date: '2023-05-15',
      time: '10:00 - 12:00',
      lecturer: 'John Doe'
    },
    {
      date: '2023-05-17',
      time: '14:00 - 16:00',
      lecturer: 'Jane Smith'
    },
    {
      date: '2023-05-19',
      time: '09:00 - 11:00',
      lecturer: 'Bob Johnson'
    }
  ];
  
 
  // Public
module.exports = {
    getS: function () {
    return consultations
    },
}