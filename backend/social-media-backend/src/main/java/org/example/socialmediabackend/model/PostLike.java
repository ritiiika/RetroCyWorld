package org.example.socialmediabackend.model;
import jakarta.persistence.*; import java.time.Instant;
@Entity @Table(name="post_likes", uniqueConstraints=@UniqueConstraint(columnNames={"post_id","user_id"}))
public class PostLike {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.EAGER,optional=false) @JoinColumn(name="post_id",nullable=false) private Post post;
 @ManyToOne(fetch=FetchType.EAGER,optional=false) @JoinColumn(name="user_id",nullable=false) private User user;
 @Column(nullable=false,updatable=false) private Instant createdAt=Instant.now();
 public PostLike(){} public Long getId(){return id;} public Post getPost(){return post;} public void setPost(Post v){post=v;} public User getUser(){return user;} public void setUser(User v){user=v;}
}
