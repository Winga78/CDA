import { describe, it, expect } from "vitest";
//test
describe("Auth-service Connection", () => {
  it("doit répondre avec un statut 200", async () => {
    const response = await fetch('/api/auth');
    expect(response.status).toBe(200);
  });
});

describe("Chat-service Connection", () => {
    it("doit répondre avec un statut 200", async () => {
      const response = await fetch('/api/posts');
      expect(response.status).toBe(200);
    });
});


describe("Project-service Connection", () => {
    it("doit répondre avec un statut 200", async () => {
      const response = await fetch('/api/projects') ;
      expect(response.status).toBe(200);
    });
});


describe("project_user Connection", () => {
  it("doit répondre avec un statut 200", async () => {
    const response = await fetch('/api/project-user');
    expect(response.status).toBe(200);
  });
});

describe("post_user Connection", () => {
  it("doit répondre avec un statut 200", async () => {
    const response = await fetch('/api/post-user');
    expect(response.status).toBe(200);
  });
});