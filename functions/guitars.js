const { randomUUID } = require('crypto');
const guitars = require('../guitarData.js');

exports.handler = async (event) => {
  const { httpMethod, body, queryStringParameters } = event;

  if (httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify(guitars),
    };
  }

  if (httpMethod === 'POST') {
    const newGuitar = JSON.parse(body);
    newGuitar.id = randomUUID();
    guitars.push(newGuitar);

    return {
      statusCode: 201,
      body: JSON.stringify(newGuitar),
    };
  }

  // ✅ DELETE /.netlify/functions/guitars?id=<ID>
  if (httpMethod === 'DELETE') {
    const id = queryStringParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing id' }),
      };
    }

    const index = guitars.findIndex((g) => g.id === id);

    if (index === -1) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Guitar not found' }),
      };
    }

    const deleted = guitars.splice(index, 1)[0];

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Guitar deleted', deleted }),
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method Not Allowed' }),
  };
};
