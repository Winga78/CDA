import { describe, it, expect } from "vitest";

describe("Auth-service Connection", () => {
  it("doit répondre avec un statut 200", async () => {
    const response = await fetch(process.env.VITE_AUTH_SERVICE_URL || "http://auth-service:3000");
    expect(response.status).toBe(200);
  });
});

describe("Chat-service Connection", () => {
    it("doit répondre avec un statut 200", async () => {
      const response = await fetch(process.env.VITE_VOTE_SERVICE_URL||"http://chat-service:3001/");
      expect(response.status).toBe(200);
    });
});


describe("Vote-service Connection", () => {
    it("doit répondre avec un statut 200", async () => {
      const response = await fetch(process.env.VITE_PROJECT_SERVICE_URL||"http://project-service:3002");
      expect(response.status).toBe(200);
    });
});


describe("project_user_post-service Connection", () => {
  it("doit répondre avec un statut 200", async () => {
    const response = await fetch(process.env.VITE_PROJECT_USER_POST_SERVICE_URL||"http://project_user_post-service:3003");
    expect(response.status).toBe(200);
  });
});