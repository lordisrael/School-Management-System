const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const { createUser, loginUser } = require("../controllers/userCtrl");
const User = require("../managers/models/user.schema");
const errorhandler = require("../mws/errorHandler.mw")

jest.mock("../managers/models/user.schema");
jest.mock("jsonwebtoken");

const { createJWT, createRefreshJWT } = require("../managers/token/jwt");
jest.mock("../managers/token/jwt", () => ({
  createJWT: jest.fn((id, name) => `mockedAccessToken-${id}-${name}`),
  createRefreshJWT: jest.fn((id) => `mockedRefreshToken-${id}`),
}));



const app = express();
app.use(express.json());
app.post("/api/auth/register", createUser);
app.post("/api/auth/login", loginUser);

app.use(errorhandler)

describe("Auth Controller", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user and return a token", async () => {
      const mockUser = {
        _id: "1",
        username: "JohnDoe",
        email: "test@example.com",
        password: "password123",
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);
    //   jwt.sign.mockReturnValue("mockedToken");
      createJWT.mockReturnValue("mockedAccessToken");

      const res = await request(app).post("/api/auth/register").send({
        username: mockUser.username,
        email: mockUser.email,
        password: mockUser.password,
      });

      expect(res.status).toBe(201);
      expect(res.body.user).toEqual(mockUser);
      //expect(res.body.token).toBe("mockedToken");
      expect(res.body.token).toBe("mockedAccessToken");
      expect(createJWT).toHaveBeenCalledWith(mockUser._id);
    });

    it("should throw a conflict error if the email already exists", async () => {
      User.findOne.mockResolvedValue({ email: "test@example.com" });

      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
      });

      expect(res.status).toBe(409);
      expect(res.body.msg).toBe("Email already Exists");
    });
  });

    describe("POST /api/auth/login", () => {
      it("should log in an existing user and return a token", async () => {
        const mockUser = {
          _id: "1",
          email: "test@example.com",
          comparePassword: jest.fn().mockResolvedValue(true),
        };

        User.findOne.mockResolvedValue(mockUser);
        createJWT.mockReturnValue("mockedAccessToken");
        createRefreshJWT.mockReturnValue("mockedRefreshToken");

        const res = await request(app).post("/api/auth/login").send({
          email: mockUser.email,
          password: "password123",
        });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe("Success");
        expect(res.body.data.email).toBe(mockUser.email);
        expect(res.body.token).toBe("mockedAccessToken");
       expect(createJWT).toHaveBeenCalledWith(mockUser._id, undefined); // Pass the expected second argument
       expect(createRefreshJWT).toHaveBeenCalledWith(mockUser._id);

      });

      it("should throw an unauthenticated error for invalid credentials", async () => {
        User.findOne.mockResolvedValue(null);

        const res = await request(app).post("/api/auth/login").send({
          email: "invalid@example.com",
          password: "wrongpassword",
        });

        expect(res.status).toBe(401);
        expect(res.body.msg).toBe("Invalid credentials");
      });
    });
});
