// grab our client with destructuring from the export in index.js
const {client, getAllUsers, createUser, updateUser, createPost, updatePost, getAllPosts, getPostsByUser, getUserById} = require('./index');





//call a query which will drop all tables from our database
async function dropTables(){
    try {
        console.log("Starting to drop tables...");

        await client.query(`
            DROP TABLE IF EXISTS posts;
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

        await client.query(`
            CREATE TABLE posts (
                id SERIAL PRIMARY KEY,
                "authorId" INTEGER REFERENCES users(id) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
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

async function createInitialPosts() {
    try {
        console.log("Starting to create initial posts...");
        const [albert, sandra, glamgal] = await getAllUsers();

        await createPost({
            authorId: albert.id,
            title: "First Post",
            content: "This is my first post and it's so great!"
        });

        await createPost({
            authorId: albert.id,
            title: "Second Post by Alby",
            content: "This is my second post and I am lovin it!"
        });
        await createPost({
            authorId: sandra.id,
            title: "Sandy's First Post",
            content: "My name is Sandra and I love the sand!"
        });
        await createPost({
            authorId: glamgal.id,
            title: "First Glamorous Post",
            content: "I. Am. Glam."
        });

        // console.log("posts: ", post1, post2, post3, post4)
        console.log("Done creating posts...");
    } catch (error) {
        throw error;
    }
}





//this function deletes our tables and then reacreates them and then ends the connection
async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
    } catch (error) {
        console.error(error);
    };
};


//create an asynchronous function which will test our db 
async function testDB() {
    try {
        console.log("Starting to test database...")
        
        //test our getAllUsers function
        console.log("Calling getAllUsers");
        const users = await getAllUsers();
        console.log("getAllUsers:", users);


        console.log("Calling updateUser on users[0]")
        const updateUserResult = await updateUser(users[0].id, {
        name: "Newname Sogood",
        location: "Lesterville, KY"
        });
        console.log("Result:", updateUserResult);


        console.log("Calling getAllPosts");
        const posts = await getAllPosts();
        console.log("Result:", posts);

        console.log("Calling updatePost on posts[0]");
        const updatePostResult = await updatePost(posts[0].id, {
          title: "New Title",
          content: "Updated Content"
        });
        console.log("Result:", updatePostResult);
    
        console.log("Calling getUserById with 1");
        const albert = await getUserById(1);
        console.log("Result:", albert);




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