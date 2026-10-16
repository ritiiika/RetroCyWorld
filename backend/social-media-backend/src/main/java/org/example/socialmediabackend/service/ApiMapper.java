package org.example.socialmediabackend.service;
import org.example.socialmediabackend.model.*; import java.util.*;
public final class ApiMapper {
 private ApiMapper(){}
 public static Map<String,Object> user(User u){Map<String,Object> m=new LinkedHashMap<>();m.put("id",u.getId());m.put("fullName",u.getFullName());m.put("username",u.getUsername());m.put("email",u.getEmail());m.put("bio",u.getBio());m.put("createdAt",u.getCreatedAt());return m;}
 public static Map<String,Object> post(Post p){return post(p,false);}
 public static Map<String,Object> post(Post p,boolean likedByCurrentUser){Map<String,Object> m=new LinkedHashMap<>();m.put("id",p.getId());m.put("user",user(p.getUser()));m.put("content",p.getContent());m.put("imageUrl",p.getImageUrl());m.put("likes",p.getLikes());m.put("likedByCurrentUser",likedByCurrentUser);m.put("shares",p.getShares());m.put("createdAt",p.getCreatedAt());return m;}
 public static Map<String,Object> comment(Comment c){Map<String,Object> m=new LinkedHashMap<>();m.put("id",c.getId());m.put("postId",c.getPost().getId());m.put("user",user(c.getUser()));m.put("message",c.getMessage());m.put("createdAt",c.getCreatedAt());return m;}
}
