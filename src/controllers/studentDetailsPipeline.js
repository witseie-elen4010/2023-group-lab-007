const studentDetailsPipeline = (email) => {
    return [
      {
        $match: {
          emailAddress: email
        }
      }
    ];
  };

  module.exports = studentDetailsPipeline;