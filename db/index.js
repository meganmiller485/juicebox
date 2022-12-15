const {Client} = require('pg'); //this imports the pg module which we will use to link our data


//supply the db name and location of the database
const client = new Client('postgres://localhost:5432/juicebox-dev');

//create some helper functions to use throughout the application
async function createUser({username, password, name, location}){
    try {
        const {rows} = await client.query(`
            INSERT INTO users (username, password, name, location) VALUES ($1, $2, $3, $4) 
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        `, [username, password, name, location]);

        return rows;
    } catch (error) {
        throw error;
    };
};


async function getAllUsers() {
    
    //deconstruct rows to get the user objects using the query, then return those objects
    const {rows} = await client.query(
        'SELECT id, username, name, location, active FROM users;'
    );

    return rows;
};

async function updateUser(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    };
  
    try {
        const {rows} = await client.query(`
          UPDATE users
          SET ${ setString }
          WHERE id=${ id }
          RETURNING *;
        `, Object.values(fields));
    
        return rows;
    } catch (error) {
        throw error;
    };
};




module.exports = {
    client,
    getAllUsers,
    createUser,
    updateUser,
};