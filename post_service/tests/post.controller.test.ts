import { describe, expect, jest, test } from "@jest/globals";
import Post from "../models/post.model";
import * as PostService from "../services/post.service";
import {
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
} from "../controllers/post.controller";
import { Response } from "express";
import { getDefaultAutoSelectFamilyAttemptTimeout } from "net";
//api call
const mockUser = {};
const mockRequest = { params: {} } as CustomRequest;
const mockResponse = {} as any as Response;
(mockResponse.status = jest.fn(() => mockResponse)),
  (mockResponse.json = jest.fn((x: any) => x));

const posts = [
  new Post({
    _id: 123,
    createdAt: Date.now(),
    user: "Emily",
    text: "Unit Test",
  }),
  new Post({
    _id: 456,
    createdAt: Date.now(),
    user: "Rosie",
    text: "Unit Test",
  }),
];

describe("GetAllPosts", () => {
  // function
  // first look at the function
  // what we want to test in that function
  // should return empty post if no post present
  // should return an array of post
  // create mock data

  test("should respond with an empty array if there are no posts", async () => {
    //await getAllPosts(mockRequest, mockResponse);
    const emptyArray = new Array();
    jest.spyOn(PostService, "fetchPosts").mockResolvedValue(emptyArray);
    await getAllPosts(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(emptyArray);
  });

  test("should respond with an array of posts", async () => {
    //await getAllPosts(mockRequest, mockResponse);
    jest.spyOn(PostService, "fetchPosts").mockResolvedValue(posts);
    await getAllPosts(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(posts);
  });
});

describe("GetLikedPosts", () => {
  test("should response with Liked Posts", async () => {
    mockRequest.params.id = "1";
    jest.spyOn(PostService, "fetchLikedPosts").mockResolvedValue(posts);
    await getLikedPosts(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(posts);
  });
});

describe("GetFollowingPosts", () => {
  test("should response with Liked Posts", async () => {
    mockRequest.user = { username: "Tay", _id: "2", email: "Tay@gmail.com" };
    jest.spyOn(PostService, "fetchFollowingPosts").mockResolvedValue(posts);
    await getFollowingPosts(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(posts);
  });
});
