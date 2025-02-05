import { describe, expect, jest, test } from "@jest/globals";
import request from "supertest";
import { ExpressApp } from "../express-app";
import connectMongoDB from "../db/connectMongoDB";
import { getAllPosts } from "../controllers/post.controller";
//supertest use to do intergration test

const fetchPosts = jest.fn();
const app = fetchPosts({
  fetchPosts: fetchPosts,
});
describe("GET /Post", () => {});
