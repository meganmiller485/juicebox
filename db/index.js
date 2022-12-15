const {Client} = require('pg'); //this imports the pg module which we will use to link our data
const { resourceLimits } = require('worker_threads');

//supply the db name and location of the database
const client = new Client('postgres://localhost:5432/juicebox-dev');

//create some helper functions to use throughout the application

async function getAllUsers() {
    
    //deconstruct rows to get the user objects using the query, then return those objects
    const {rows} = await client.query(
        'SELECT id, username FROM users;'
    );

    return rows;
};

async function createUser({username, password}){
    try {
        const {rows} = await client.query(`
            INSERT INTO users (username, password) VALUES ($1, $2) 
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        `, [username, password]);

        return {rows};
    } catch (error) {
        throw error;
    };
};



module.exports = {
    client,
    getAllUsers,
    createUser,
};