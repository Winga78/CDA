import { describe, it, expect } from "vitest";
//test
describe("Auth-service Connection", () => {
  it("doit répondre avec un statut 200", async () => {
    const response = await fetch(process.env.AUTH_DOCKER_URL || "api/auth");
    expect(response.status).toBe(200);
  });
});

describe("Chat-service Connection", () => {
    it("doit répondre avec un statut 200", async () => {
      const response = await fetch(process.env.CHAT_DOCKER_URL ||"api/chat");
      expect(response.status).toBe(200);
    });
});


describe("Project-service Connection", () => {
    it("doit répondre avec un statut 200", async () => {
      const response = await fetch(process.env.PROJECT_DOCKER_URL || "api/projects") ;
      expect(response.status).toBe(200);
    });
});


describe("project_user_post-service Connection", () => {
  it("doit répondre avec un statut 200", async () => {
    const response = await fetch(process.env.PROJECT_USER_POST_DOCKER_URL||"api/project-user-post");
    expect(response.status).toBe(200);
  });
});