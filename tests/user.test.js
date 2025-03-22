import { assert } from 'chai';
import { User, UserType } from '../models/user.js';
import { suite, test, before, after } from 'mocha';
import mongoose from 'mongoose';
const { MongoMemoryServer } = await import('mongodb-memory-server');

suite("User Model Tests", () => {

    before(async () => {
        // Start by connecting to an in-memory database (MongoMemoryServer) as done in previous tests
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        // Clean up after tests and close connection
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    test("Creating a User with a valid email and password", async () => {
        const user = new User({
            login: "testuser@example.com",
            password: "password123",
            name: "John",
            secondName: "Doe",
        });

        const savedUser = await user.save();

        assert.equal(savedUser.login, "testuser@example.com");
        assert.isDefined(savedUser.password);  // Ensure the password is defined
        assert.equal(savedUser.name, "John");
        assert.equal(savedUser.secondName, "Doe");
    });

    test("Creating a User with missing required fields", async () => {
        const user = new User({
            login: "missingPassword@example.com",
            // password is missing
        });

        try {
            await user.save();
        } catch (error) {
            assert.include(error.message, 'User validation failed');
            assert.include(error.message, 'password');
        }
    });


    test("Creating a User with an invalid email", async () => {
        const user = new User({
            login: "invalid-email-format",
            password: "password123",
        });

        try {
            await user.save();
        } catch (error) {
            assert.include(error.message, 'User validation failed');
            assert.include(error.message, 'login');
        }
    });

    test("Creating a User with a valid UserType", async () => {
        // Create a valid UserType first
        const userType = new UserType({ typeName: "Admin" });
        const savedUserType = await userType.save();

        const user = new User({
            login: "adminuser@example.com",
            password: "adminpassword123",
            userType: savedUserType._id,
        });

        const savedUser = await user.save();

        assert.equal(savedUser.login, "adminuser@example.com");
        assert.equal(savedUser.userType.toString(), savedUserType._id.toString());
    });

    test("Updating a User's details", async () => {
        const user = new User({
            login: "userToUpdate@example.com",
            password: "oldpassword123",
        });

        const savedUser = await user.save();

        // Update user's name
        savedUser.name = "UpdatedName";
        const updatedUser = await savedUser.save();

        assert.equal(updatedUser.name, "UpdatedName");
    });

    test("Deleting a User", async () => {
        const user = new User({
            login: "usertodelete@example.com",
            password: "deletepassword123",
        });

        const savedUser = await user.save();
        await User.findByIdAndDelete(savedUser._id);

        const deletedUser = await User.findById(savedUser._id);
        assert.isNull(deletedUser);  // Ensure the user is deleted
    });
});
