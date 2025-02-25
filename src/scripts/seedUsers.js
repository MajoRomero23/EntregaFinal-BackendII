const mongoose = require("mongoose");
const UserModel = require("../models/user.models.js");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const seedUsers = async () => {
    try {

        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conectado a MongoDB");


        const users = [
            { first_name: "Jacinto", last_name: "Juarez", email: "jacinto@example.com", age: 45, password: "password123" },
            { first_name: "Andrea", last_name: "Perez", email: "Andrea@example.com", age: 32, password: "password123" },
        ];

        await UserModel.insertMany(users);
        console.log("Usuarios insertados correctamente");
    } catch (error) {
        console.error("Error al insertar usuarios:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedUsers();