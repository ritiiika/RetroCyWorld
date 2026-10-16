package org.example.socialmediabackend.model;
import jakarta.persistence.*; import java.time.Instant;
@Entity @Table(name="comments")
public class Comment {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.EAGER,optional=false) @JoinColumn(name="post_id",nullable=false) private Post post;
 @ManyToOne(fetch=FetchType.EAGER,optional=false) @JoinColumn(name="user_id",nullable=false) private User user;
 @Column(nullable=false,length=1000) private String message; @Column(nullable=false,updatable=false) private Instant createdAt=Instant.now();
 public Comment(){} public Long getId(){return id;} public Post getPost(){return post;} public void setPost(Post v){post=v;} public User getUser(){return user;} public void setUser(User v){user=v;} public String getMessage(){return message;} public void setMessage(String v){message=v;} public Instant getCreatedAt(){return createdAt;}
}
