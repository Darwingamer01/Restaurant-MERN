import request from "supertest";
import app from "../server";
import { UserModel } from "../models/User";

describe("Authentication", () => {
  describe("POST /api/v1/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "Test@123",
        name: "Test User",
        phone: "+91 9876543210",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.headers["set-cookie"]).toBeDefined();

      // Verify user created in DB
      const user = await UserModel.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user?.role).toBe("customer");
    });

    it("should not register user with existing email", async () => {
      const userData = {
        email: "test@example.com",
        password: "Test@123",
        name: "Test User",
      };

      // Create user first
      await request(app).post("/api/v1/auth/register").send(userData);

      // Try again
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User already exists with this email");
    });

    it("should validate input data", async () => {
      const invalidData = {
        email: "invalid-email",
        password: "123",
        name: "T",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation error");
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      const user = new UserModel({
        email: "test@example.com",
        password: "Test@123",
        name: "Test User",
        role: "customer",
      });
      await user.save();
    });

    it("should login with valid credentials", async () => {
      const loginData = { email: "test@example.com", password: "Test@123" };

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should not login with invalid credentials", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "test@example.com", password: "wrongpassword" })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should not login with non-existent user", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "nonexistent@example.com", password: "Test@123" })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    let refreshToken: string;

    beforeEach(async () => {
      const userData = {
        email: "test@example.com",
        password: "Test@123",
        name: "Test User",
      };

      const registerResponse = await request(app)
        .post("/api/v1/auth/register")
        .send(userData);

      const cookies = Array.isArray(registerResponse.headers["set-cookie"])
        ? registerResponse.headers["set-cookie"]
        : registerResponse.headers["set-cookie"]
        ? [registerResponse.headers["set-cookie"]]
        : [];

      refreshToken =
        cookies
          .find((cookie: string) => cookie.startsWith("refreshToken="))
          ?.split("=")[1]
          ?.split(";")[0] || "";
    });

    it("should refresh tokens with valid refresh token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/refresh")
        .set("Cookie", `refreshToken=${refreshToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Token refreshed successfully");
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("should not refresh without refresh token", async () => {
      const response = await request(app).post("/api/v1/auth/refresh").expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Refresh token required");
    });
  });

  describe("GET /api/v1/auth/me", () => {
    let accessToken: string;

    beforeEach(async () => {
      const userData = {
        email: "test@example.com",
        password: "Test@123",
        name: "Test User",
      };

      const registerResponse = await request(app)
        .post("/api/v1/auth/register")
        .send(userData);

      accessToken = registerResponse.body.data.accessToken;
    });

    it("should get current user with valid token", async () => {
      const response = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe("test@example.com");
      expect(response.body.data.user.name).toBe("Test User");
    });

    it("should not get user without token", async () => {
      const response = await request(app).get("/api/v1/auth/me").expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Access token required");
    });
  });

  describe("POST /api/v1/auth/logout", () => {
    let accessToken: string;
    let refreshToken: string;

    beforeEach(async () => {
      const userData = {
        email: "test@example.com",
        password: "Test@123",
        name: "Test User",
      };

      const registerResponse = await request(app)
        .post("/api/v1/auth/register")
        .send(userData);

      accessToken = registerResponse.body.data.accessToken;

      const cookies = Array.isArray(registerResponse.headers["set-cookie"])
        ? registerResponse.headers["set-cookie"]
        : registerResponse.headers["set-cookie"]
        ? [registerResponse.headers["set-cookie"]]
        : [];

      refreshToken =
        cookies
          .find((cookie: string) => cookie.startsWith("refreshToken="))
          ?.split("=")[1]
          ?.split(";")[0] || "";
    });

    it("should logout successfully", async () => {
      const response = await request(app)
        .post("/api/v1/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Cookie", `refreshToken=${refreshToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Logout successful");

      const cookies = Array.isArray(response.headers["set-cookie"])
        ? response.headers["set-cookie"]
        : response.headers["set-cookie"]
        ? [response.headers["set-cookie"]]
        : [];

      const clearCookieHeader = cookies.find((cookie: string) =>
        cookie.includes("refreshToken=")
      );

      expect(clearCookieHeader).toContain("Max-Age=0");
    });
  });
});
