// grab our client with destructuring from the export in index.js
const {client, getAllUsers, createUser, updateUser} = require('./index');





//call a query which will drop all tables from our database
async function dropTables(){
    try {
        console.log("Starting to drop tables...");

        await client.query(`
            DROP TABLE IF EXISTS users;
        `);

        console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error; //we pass the error up to the function that calls dropTables
    };
};



async function createTables() {
    try {
        console.log("Starting to build tables...");

        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                active BOOLEAN DEFAULT true
            );
        `);

        console.log("Finished building tables!");
    } catch (error) {
        console.error("Error building tables!");
        throw error; //pass the error up to where we call create tabels
    };
};


async function createInitialUsers() {
    try {
        console.log("Starting to create initial users...");

        const albert = await createUser({ username: 'albert', password: 'bertie99', name: 'Bert', location:'Eugene, OR'});
        const sandra = await createUser({ username: 'sandra', password: '2sandy4me', name: 'Sandy', location:'Sandy Beaches, SC' });
        const glamgal = await createUser({username: 'glamgal', password: 'soglam', name: 'Elan', location:'Fort Collins, CO'})
        //test it!
        console.log("albert:", albert);
        console.log("sandra:", sandra);
        console.log("glamgal:", glamgal);

        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!");
        throw error;
    };
};


//this function deletes our tables and then reacreates them and then ends the connection
async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
    } catch (error) {
        console.error(error);
    };
};


//create an asynchronous function which will test our db 
async function testDB() {
    try {
        console.log("Starting to test database...")
        //connect the client to the database, finally
        // client.connect();
        console.log("Calling getAllUsers");
        const users = await getAllUsers();
        console.log("getAllUsers:", users);


        console.log("Calling updateUser on users[0]")
        const updateUserResult = await updateUser(users[0].id, {
        name: "Newname Sogood",
        location: "Lesterville, KY"
        });
        console.log("Result:", updateUserResult);



        //queries are promises, so we can await them
        //deconstruct the rows field to give us individual id objects
            // const {rows} = await client.query('SELECT * FROM users;');

        // //console log to see what you get when connected and created first query
             // console.log(rows);

        console.log("Finished database tests!");
    } catch (error) {
        console.log("Error testing databse!")
        console.error(error);
    };
};



rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(()=> client.end());